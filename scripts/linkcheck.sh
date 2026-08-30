#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

# Crawls the built site the way CI does and fails on a broken link.
#
# This existed only in CI, which is how two 404s reached the live site: every
# lucid page carrying a code block linked to a /highlight.css that was never
# published. It went unseen because the showcase index did not list lucid, so
# the crawler — which starts at / and follows links — never reached those
# pages at all. Running it locally closes that gap.

PORT="${LINK_PORT:-8766}"
[[ -d public ]] || { echo "error: run \`make build\` first" >&2; exit 1; }

python3 -m http.server "${PORT}" --directory public >/dev/null 2>&1 &
SERVER=$!
trap 'kill "${SERVER}" 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do
  curl -sf "http://127.0.0.1:${PORT}/" >/dev/null && break
  sleep 0.25
done

npx --yes linkinator "http://127.0.0.1:${PORT}/" \
  --recurse --silent --skip "^https?://(?!127\.0\.0\.1)"
