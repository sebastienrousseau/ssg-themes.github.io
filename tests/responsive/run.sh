#!/usr/bin/env bash
set -euo pipefail

# Serves the built site at its deployed URL path and runs the viewport audit.
#
# The path prefix matters: the themes derive every root-absolute URL from
# `base_url`, so serving `public/` at `/` would 404 every stylesheet and the
# audit would measure unstyled pages.

cd "$(git rev-parse --show-toplevel)"
PREFIX="${SHOWCASE_PATH_PREFIX:-ssg-themes.github.io}"
PORT="${RESPONSIVE_PORT:-8765}"

[[ -d public ]] || { echo "error: run \`make build\` first" >&2; exit 1; }

ROOT="$(mktemp -d)"
cp -R public "${ROOT}/${PREFIX}"
python3 -m http.server "${PORT}" --directory "${ROOT}" >/dev/null 2>&1 &
SERVER=$!
trap 'kill "${SERVER}" 2>/dev/null || true; rm -rf "${ROOT}"' EXIT

for _ in $(seq 1 40); do
  curl -sf -o /dev/null "http://127.0.0.1:${PORT}/${PREFIX}/" && break
  sleep 0.25
done

# Only audit pages that render; redirect stubs navigate off-origin.
find public -name '*.html' ! -path '*_islands*' -print0 \
  | xargs -0 grep -L 'http-equiv="refresh"' \
  | sed 's|^public||' | sort > tests/responsive/pages.txt

node tests/responsive/audit.mjs --base "http://127.0.0.1:${PORT}/${PREFIX}"
