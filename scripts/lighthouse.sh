#!/usr/bin/env bash
set -euo pipefail
# Lighthouse against the built site, asserting the thresholds in
# .lighthouserc.json (all four categories at 1.0).
#
# On the thresholds in .lighthouserc.json: all four category scores are hard
# gates at 1.0. FCP (1800ms), LCP (2500ms), and CLS (0) are also hard gates at
# Lighthouse's mobile "good" boundaries. Keeping the category scores and raw
# budgets as errors means a successful run has no hidden warning-only escape.
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

# A `tier = "site"` theme is a live site's own theme (see pageweight.py): it
# is held to every assertion in .lighthouserc.json except the transfer
# budget, which is the `transfer_budget_kb` its theme.toml declares. It runs
# as its own lhci pass against a config derived from .lighthouserc.json, so
# the archetype thresholds stay in one file and cannot drift.
SITE_TIER=()
while IFS= read -r line; do SITE_TIER+=("${line}"); done < <(
  python3 scripts/lighthouse_tiers.py site-themes "${THEMES[@]}"
)

# With staticDistDir, LHCI owns the temporary server and replaces this origin
# while preserving each path. A stable placeholder avoids starting a second,
# unused server and makes the same command work locally and in CI.
ARGS=(--collect.url="http://localhost/")
for t in "${THEMES[@]}"; do
  if [[ ! -d "public/${t}" ]]; then
    echo "error: theme ${t} is not in the build" >&2
    exit 1
  fi
  [[ " ${SITE_TIER[*]-} " == *" ${t} "* ]] && continue
  ARGS+=(--collect.url="http://localhost/${t}/")
done

echo "lighthouse: $(( ${#ARGS[@]} )) archetype pages (showcase + themes), ${#SITE_TIER[@]} site-tier theme(s)"

run_profile() {
  local profile="$1"
  local settings=()
  if [[ "${profile}" == "desktop" ]]; then
    settings+=(--collect.settings.preset=desktop)
  fi
  echo "lighthouse profile: ${profile}"
  ${LHCI} autorun \
    "${ARGS[@]}" \
    "${settings[@]}" \
    --collect.numberOfRuns="${LIGHTHOUSE_RUNS:-3}" \
    --upload.target=filesystem \
    --upload.outputDir="./.lighthouse/${profile}"
  local t config
  for t in "${SITE_TIER[@]}"; do
    config=".lighthouse/site-tier-${t}.json"
    mkdir -p .lighthouse
    python3 scripts/lighthouse_tiers.py config "${t}" > "${config}"
    echo "lighthouse profile: ${profile}, site tier: ${t}"
    ${LHCI} autorun \
      --config="${config}" \
      --collect.url="http://localhost/${t}/" \
      "${settings[@]}" \
      --collect.numberOfRuns="${LIGHTHOUSE_RUNS:-3}" \
      --upload.target=filesystem \
      --upload.outputDir="./.lighthouse/${profile}-${t}"
  done
}

case "${LIGHTHOUSE_PRESET:-both}" in
  both)
    run_profile mobile
    run_profile desktop
    ;;
  mobile|desktop)
    run_profile "${LIGHTHOUSE_PRESET}"
    ;;
  *)
    echo "error: LIGHTHOUSE_PRESET must be mobile, desktop, or both" >&2
    exit 1
    ;;
esac
