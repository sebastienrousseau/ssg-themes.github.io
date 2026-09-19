#!/usr/bin/env bash
set -euo pipefail

# Measures the AAA claims the themes make, against the built site. The page
# set is discovered from public/ (see pages.mjs), so every theme shipped in
# themes/ is visited and a new one is covered the day it lands.
#
# The repository's other gates read source: `contrast.py` checks the tokens a
# stylesheet declares, which is necessary but not sufficient — a token can
# pass in isolation and still be rendered on a ground it was never paired
# with. These four suites check what a browser actually paints, in both
# colour schemes:
#
#   modes.mjs   every theme in light, dark and system modes, including proof
#               that an explicit choice overrides the operating-system mode
#   a11y.mjs    every rendered text run against its real computed background
#               (7:1, or 4.5:1 for large text), every non-inline target at
#               44x44, heading order, landmarks, accessible names
#   reflow.mjs  every page x 11 viewports x 2 schemes, asserting no horizontal
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
export BASE="http://127.0.0.1:${PORT}"

[[ -d public ]] || { echo "error: run \`make build\` first" >&2; exit 1; }
# CI installs Playwright under tests/responsive for the other browser gates;
# locally it is usually at the repository root. Accept either rather than
# making the caller install the same thing twice.
#
# NODE_PATH does not help here: it is honoured by CommonJS require() and
# ignored by ESM import, and these suites are ESM. ESM resolves by walking
# node_modules directories upward from the importing *file*, so the package
# has to be reachable on that path - hence the symlink rather than a variable.
NM=""
for candidate in node_modules tests/responsive/node_modules; do
  if [[ -d "${candidate}/@playwright/test" ]]; then
    NM="${PWD}/${candidate}"
    break
  fi
done
# The install has disappeared mid-run more than once on a memory-pressured
# machine, and the failure surfaces as a module-not-found trace that says
# nothing about its cause. `npm ci` is idempotent and the lockfile is right
# here, so restore it rather than making a person read a stack trace.
if [[ -z "${NM}" && -f tests/responsive/package-lock.json ]]; then
  echo "playwright: not installed, restoring from tests/responsive/package-lock.json" >&2
  (cd tests/responsive && npm ci >/dev/null 2>&1) || true
  [[ -d "tests/responsive/node_modules/@playwright/test" ]] \
    && NM="${PWD}/tests/responsive/node_modules"
fi
if [[ -z "${NM}" ]]; then
  echo "error: @playwright/test not installed — see the header of this file" >&2
  exit 1
fi
if [[ "${NM}" != "${PWD}/tests/aaa/node_modules" ]]; then
  ln -sfn "${NM}" tests/aaa/node_modules
fi
echo "playwright: ${NM}"

# Refuse to run if something else already holds the port: a failed bind is
# silent, and the suite would then measure whatever site that process serves.
if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "error: port ${PORT} is already in use; set PORT to a free port" >&2
  exit 1
fi

python3 -m http.server "${PORT}" --directory public >/dev/null 2>&1 &
SERVER=$!
trap 'kill "${SERVER}" 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do
  curl -sf "http://127.0.0.1:${PORT}/lucid/" >/dev/null && break
  sleep 0.25
done

node tests/aaa/selftest.mjs
node tests/aaa/composition-selftest.mjs
node tests/aaa/modes.mjs
node tests/aaa/a11y.mjs
node tests/aaa/reflow.mjs
node tests/aaa/focus.mjs
# Composition: cropped or stretched images, a photograph used twice on one
# page, and text laid over text. None of the suites above can see any of it.
node tests/aaa/gradient.mjs
node tests/aaa/composition.mjs
