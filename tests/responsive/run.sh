#!/usr/bin/env bash
set -euo pipefail

# Serves the built site at its deployed URL path and runs the viewport audit.
#
# The path prefix matters: the themes derive every root-absolute URL from
# `base_url`, so serving `public/` at `/` would 404 every stylesheet and the
# audit would measure unstyled pages.

cd "$(git rev-parse --show-toplevel)"

# The install has disappeared mid-run more than once on a memory-pressured
# machine; the suite then dies with a module-not-found trace that says
# nothing about why. `npm ci` is idempotent and the lockfile sits beside
# this script, so restore it rather than making a person read a stack trace.
if [[ ! -d tests/responsive/node_modules/@playwright/test ]]; then
  echo "playwright: not installed, restoring from package-lock.json" >&2
  (cd tests/responsive && npm ci >/dev/null 2>&1) || true
fi
if [[ ! -d tests/responsive/node_modules/@playwright/test ]]; then
  echo "error: @playwright/test not installed (cd tests/responsive && npm ci)" >&2
  exit 1
fi
PREFIX="${SHOWCASE_PATH_PREFIX-}"
PORT="${RESPONSIVE_PORT:-8765}"

[[ -d public ]] || { echo "error: run \`make build\` first" >&2; exit 1; }

# Served from the root of its own host, so `public/` is the document root
# and there is no prefix to reproduce. `SHOWCASE_PATH_PREFIX` restores the
# old project-path behaviour, where the segment had to exist on disk or
# every root-absolute stylesheet 404'd and the suites measured unstyled
# pages.
if [[ -n "${PREFIX}" ]]; then
  ROOT="$(mktemp -d)"
  cp -R public "${ROOT}/${PREFIX}"
  BASE="http://127.0.0.1:${PORT}/${PREFIX}"
  TMP_ROOT="${ROOT}"
else
  ROOT="public"
  BASE="http://127.0.0.1:${PORT}"
fi
# A single cleanup: a second `trap ... EXIT` later in the file replaces this
# one outright rather than adding to it, which is how the temporary root
# above came to be left behind once.
PAGES_BACKUP=""
cleanup() {
  kill "${SERVER}" 2>/dev/null || true
  [[ -n "${TMP_ROOT:-}" ]] && rm -rf "${TMP_ROOT}"
  [[ -n "${PAGES_BACKUP}" && -f "${PAGES_BACKUP}" ]] \
    && cp "${PAGES_BACKUP}" tests/responsive/pages.txt && rm -f "${PAGES_BACKUP}"
  return 0
}
trap cleanup EXIT

# Refuse to run if something else already holds the port. Without this the
# `http.server` below fails to bind, its error goes to /dev/null, and the
# suite happily measures whatever site the other process is serving — which
# is how this gate once reported defects for a project that is not this one.
if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "error: port ${PORT} is already in use; set RESPONSIVE_PORT to a free port" >&2
  lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >&2
  exit 1
fi

python3 -m http.server "${PORT}" --directory "${ROOT}" >/dev/null 2>&1 &
SERVER=$!

for _ in $(seq 1 40); do
  curl -sf -o /dev/null "${BASE}/" && break
  sleep 0.25
done

# Only audit pages that render; redirect stubs navigate off-origin.
find public -name '*.html' ! -path '*_islands*' -print0 \
  | xargs -0 grep -L 'http-equiv="refresh"' \
  | sed 's|^public||' | sort > tests/responsive/pages.txt

# Each gate runs over RESPONSIVE_BATCHES groups of pages, restarting its
# browser between them. A single Chromium held open across every page grows
# past what a constrained machine has free and the OS kills it; a gate that
# dies partway prints nothing, which reads as silence rather than failure.
# `pages.txt` is the full list and is restored on exit, so a batch cannot
# leave the suite measuring a subset next time. RESPONSIVE_BATCHES=1 gives
# the old single pass.
BATCHES="${RESPONSIVE_BATCHES:-5}"
ALL="$(mktemp)"
cp tests/responsive/pages.txt "${ALL}"
PAGES_BACKUP="${ALL}"

total="$(wc -l < "${ALL}" | tr -d ' ')"
per=$(( (total + BATCHES - 1) / BATCHES ))
for gate in audit interaction semantics axe; do
  for (( i = 0; i < BATCHES; i++ )); do
    # The blocked-island check looks for a pricing page and falls back to
    # the first page in the list when it finds none, so every batch keeps
    # one rather than asserting a pricing table on whatever came first.
    {
      sed -n "$(( i * per + 1 )),$(( (i + 1) * per ))p" "${ALL}"
      grep -E 'pricing' "${ALL}" || true
    } | sort -u > tests/responsive/pages.txt
    [[ -s tests/responsive/pages.txt ]] || continue
    node "tests/responsive/${gate}.mjs" --base "${BASE}"
  done
done
cp "${ALL}" tests/responsive/pages.txt
