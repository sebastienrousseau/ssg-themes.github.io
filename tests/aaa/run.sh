#!/usr/bin/env bash
set -euo pipefail

# Measures the AAA claims the Lucid theme makes, against the built site.
#
# The repository's other gates read source: `contrast.py` checks the tokens a
# stylesheet declares, which is necessary but not sufficient — a token can
# pass in isolation and still be rendered on a ground it was never paired
# with. These two suites check what a browser actually paints, in both
# colour schemes:
#
#   a11y.mjs    every rendered text run against its real computed background
#               (7:1, or 4.5:1 for large text), every non-inline target at
#               44x44, heading order, landmarks, accessible names
#   reflow.mjs  8 pages x 11 viewports x 2 schemes, asserting no horizontal
#               scrolling and no element wider than the viewport
#   focus.mjs   tabs every page at 7 widths and hit-tests each focus ring, so
#               2.4.11 and 2.4.12 are decided by paint order rather than by
#               rectangle overlap - a skip link above the masthead overlaps it
#               legitimately, and only elementFromPoint can tell the two apart
#
# Requires Playwright. `npm install --no-save @playwright/test` then
# `npx playwright install chromium` if it is absent.

cd "$(git rev-parse --show-toplevel)"
PORT="${AAA_PORT:-8732}"

[[ -d public ]] || { echo "error: run \`make build\` first" >&2; exit 1; }
# CI installs Playwright under tests/responsive for the other browser gates;
# locally it is usually at the repository root. Accept either rather than
# making the caller install it twice.
if [[ -d node_modules/@playwright ]]; then
  export NODE_PATH="$PWD/node_modules"
elif [[ -d tests/responsive/node_modules/@playwright ]]; then
  export NODE_PATH="$PWD/tests/responsive/node_modules"
else
  echo "error: @playwright/test not installed — see the header of this file" >&2
  exit 1
fi

python3 -m http.server "${PORT}" --directory public >/dev/null 2>&1 &
SERVER=$!
trap 'kill "${SERVER}" 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do
  curl -sf "http://127.0.0.1:${PORT}/lucid/" >/dev/null && break
  sleep 0.25
done

node tests/aaa/a11y.mjs
node tests/aaa/reflow.mjs
node tests/aaa/focus.mjs
