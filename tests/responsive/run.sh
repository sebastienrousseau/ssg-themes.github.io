#!/usr/bin/env bash
set -euo pipefail

# Serves the built site at its deployed URL path and runs the viewport audit.
#
# The path prefix matters: the themes derive every root-absolute URL from
# `base_url`, so serving `public/` at `/` would 404 every stylesheet and the
# audit would measure unstyled pages.

cd "$(git rev-parse --show-toplevel)"
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
  trap 'kill "${SERVER}" 2>/dev/null || true; rm -rf "${ROOT}"' EXIT
else
  ROOT="public"
  BASE="http://127.0.0.1:${PORT}"
  trap 'kill "${SERVER}" 2>/dev/null || true' EXIT
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

node tests/responsive/audit.mjs --base "${BASE}"
node tests/responsive/interaction.mjs --base "${BASE}"
node tests/responsive/semantics.mjs   --base "${BASE}"
node tests/responsive/axe.mjs         --base "${BASE}"
