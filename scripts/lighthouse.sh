#!/usr/bin/env bash
set -euo pipefail
# Lighthouse against the built site, asserting the thresholds in
# .lighthouserc.json (all four categories at 1.0).
#
# On the thresholds in .lighthouserc.json: the four category scores gate, and
# all sampled pages hold 1.0 on every one of them. The three raw-timing budgets
# (FCP 1000ms, LCP 1200ms, CLS 0) are warnings, at their original values. They
# are stricter than Google's own "good" thresholds, and they had never actually
# run - the CI step that was meant to enforce them was continue-on-error with
# performance switched off - so nothing regressed to make them warnings.
# Apex is the one page that misses: its hero portrait puts LCP at ~1.36s, of
# which 458ms is simulated TTFB and ~570ms is waiting on the stylesheet. A
# srcset took it from 1.51s; a preload made it worse, not better, because the
# image then competed with the render-blocking CSS. Raising it further means
# inlining critical CSS, which style-src 'self' rules out.
#
# lhci's staticDistDir walks the whole tree, which at 99 pages is far more than
# a gate needs. One representative page per theme keeps it finite; the per-page
# detail is pa11y's job and tests/aaa's. The theme list is read from disk so a
# new theme is covered the day it lands.
cd "$(dirname "$0")/.."

[[ -d public ]] || { echo "error: run \`make build\` first" >&2; exit 1; }
# Same resolution problem as scripts/pa11y.sh: a shim on PATH is not proof the
# tool runs, and npx can supply it without a global install.
LHCI=""
if lhci --version >/dev/null 2>&1; then
  LHCI="lhci"
elif command -v mise >/dev/null 2>&1 && mise exec npm:@lhci/cli -- lhci --version >/dev/null 2>&1; then
  LHCI="mise exec npm:@lhci/cli -- lhci"
elif command -v npx >/dev/null 2>&1; then
  LHCI="npx --yes @lhci/cli"
else
  echo "error: lhci not runnable (npm install -g @lhci/cli)" >&2
  exit 1
fi

THEMES=()
while IFS= read -r t; do THEMES+=("${t}"); done < <(
  find themes -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort
)
if (( ${#THEMES[@]} < 20 )); then
  echo "error: found ${#THEMES[@]} themes, expected at least 20" >&2
  exit 1
fi

PORT="${PORT:-8734}"
python3 -m http.server "${PORT}" --bind 127.0.0.1 -d public >/dev/null 2>&1 &
SRV=$!
trap 'kill "${SRV}" 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do
  curl -sf "http://127.0.0.1:${PORT}/" >/dev/null && break
  sleep 0.25
done

ARGS=(--collect.url="http://127.0.0.1:${PORT}/")
for t in "${THEMES[@]}"; do
  if [[ ! -d "public/${t}" ]]; then
    echo "error: theme ${t} is not in the build" >&2
    exit 1
  fi
  ARGS+=(--collect.url="http://127.0.0.1:${PORT}/${t}/")
done

echo "lighthouse: $(( ${#THEMES[@]} + 1 )) pages (showcase + ${#THEMES[@]} themes)"
${LHCI} autorun \
  "${ARGS[@]}" \
  --collect.numberOfRuns=1 \
  --upload.target=filesystem \
  --upload.outputDir=./.lighthouse
