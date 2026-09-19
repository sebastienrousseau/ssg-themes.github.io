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
#
# They stay warnings because they are not a property of the build. Repeat
# runs of an unchanged tree move LCP by roughly 150ms, the granularity of
# the simulator's round trip, and consecutive runs failed four different
# themes each on total blocking time, first paint and speed index. What
# errors instead is `resource-summary:total:size` in .lighthouserc.json,
# which is identical on every machine: 50 KiB for a theme page, and a
# budget of its own for the gallery.
#
# TTFB is ~455ms and first paint ~920ms on every theme, so the spread that
# remains is whether a theme's largest element is a photograph or a
# headline. Raising a paint budget further would mean inlining critical
# CSS, which style-src 'self' rules out.
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
# Refuse to run if something else already holds the port: a failed bind is
# silent, and the suite would then measure whatever site that process serves.
if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "error: port ${PORT} is already in use; set PORT to a free port" >&2
  exit 1
fi

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
SETTINGS=()
if [[ "${LIGHTHOUSE_PRESET:-mobile}" == "desktop" ]]; then
  SETTINGS+=(--collect.settings.preset=desktop)
  echo "lighthouse profile: desktop"
else
  echo "lighthouse profile: mobile"
fi
${LHCI} autorun \
  "${ARGS[@]}" \
  "${SETTINGS[@]}" \
  --collect.numberOfRuns="${LIGHTHOUSE_RUNS:-3}" \
  --upload.target=filesystem \
  --upload.outputDir=./.lighthouse
