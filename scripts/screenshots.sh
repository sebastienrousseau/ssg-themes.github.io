#!/usr/bin/env bash
#
# Regenerate the gallery screenshots for every theme.
#
# The registry needs four files per theme: screenshot.png/webp at 1500x1000
# and tn.png/webp at 900x600. `validate.py` enforces the dimensions, and the
# gallery serves the WebP with the PNG as fallback. A fifth, `card.webp` at
# 640px, is the rung the gallery's own cards render at.
#
# Capturing from the built site rather than drawing by hand is the whole
# point: a screenshot cannot drift from what the theme actually renders.
# There was no repeatable path from the captured PNG to the WebP the gallery
# loads, so the two could — and did — fall out of step. This does both.
#
# Usage:  scripts/screenshots.sh [theme ...]     (default: every theme)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

PORT="${SHOT_PORT:-8733}"
QUALITY="${SHOT_QUALITY:-82}"
# `ssg audit` raises IMG-OVER-BUDGET above this.
BUDGET="${SHOT_BUDGET:-256000}"

if [[ $# -gt 0 ]]; then
  THEMES=("$@")
else
  # Not `mapfile`: it needs bash 4, and this has to run under the bash 3.2
  # that ships with macOS as well as under CI's bash 5.
  THEMES=()
  while IFS= read -r t; do THEMES+=("${t}"); done < <(
    find themes -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort)
fi

for t in "${THEMES[@]}"; do
  if [[ ! -d "public/${t}" ]]; then
    echo "error: public/${t} not built — run 'make build' first" >&2
    exit 1
  fi
done

# Serve the built site exactly as published; a file:// capture would miss
# the absolute asset paths every theme uses.
python3 -m http.server "${PORT}" --directory public >/dev/null 2>&1 &
server=$!
trap 'kill "${server}" 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do
  curl -sf -o /dev/null "http://127.0.0.1:${PORT}/" && break
  perl -e 'select(undef,undef,undef,0.25)'
done

printf '==> capturing %d theme(s)\n' "${#THEMES[@]}"
SHOT_THEMES="$(IFS=,; echo "${THEMES[*]}")" \
  BASE="http://127.0.0.1:${PORT}" \
  node tests/aaa/shots.mjs

# The PNG is the registry artefact; the gallery page loads the WebP beside
# it. So this strips metadata and recompresses — both lossless — and stops
# there. An earlier version reduced to a 256-colour palette whenever a file
# passed 256 KB, which is what `ssg audit` budgets page images at; on the two
# photograph-led themes that meant visible banding on the very picture the
# gallery exists to show. The page references no PNG now, so the budget does
# not apply to it, and the size is reported rather than forced.
optimise_png() {
  local file="$1" budget="$2"
  magick "${file}" -strip \
    -define png:compression-level=9 -define png:compression-filter=5 \
    "${file}.opt" && mv "${file}.opt" "${file}"
  local size
  size=$(stat -f%z "${file}" 2>/dev/null || stat -c%s "${file}")
  if [[ "${size}" -gt "${budget}" ]]; then
    printf '    note: %s is %s bytes (page-image budget is %s; not page-referenced)\n' \
      "${file}" "${size}" "${budget}"
  fi
}

# The WebP the gallery actually loads, derived from the PNG just captured so
# the pair can never disagree. They used to be produced by separate ad-hoc
# commands, and drifted: several `tn.png` thumbnails ended up larger than the
# full-size `screenshot.png` they were supposed to be a reduction of.
for t in "${THEMES[@]}"; do
  for f in screenshot tn; do
    src="themes/${t}/images/${f}.png"
    [[ -f "${src}" ]] || continue
    optimise_png "${src}" "${BUDGET}"
    magick "${src}" -quality "${QUALITY}" "themes/${t}/images/${f}.webp"
  done
  # The rung the gallery actually renders. Its cards are 319-430 CSS px
  # wide, so the 1500px capture was roughly three times the pixels any of
  # them displays, and the page paid for it twenty-two times over.
  magick "themes/${t}/images/screenshot.png" -strip -resize 640x \
    -quality "${CARD_QUALITY:-76}" "themes/${t}/images/card.webp"
  printf '  %s: png optimised, webp and 640px card derived from it\n' "${t}"
done

# The gallery's own preview, used as its og:image. Captured the same way as
# the themes' so it cannot drift from the page it depicts.
if [[ $# -eq 0 ]]; then
  mkdir -p showcase/images
  BASE="http://127.0.0.1:${PORT}" node tests/aaa/showcase-shot.mjs
  optimise_png showcase/images/screenshot.png "${BUDGET}"
  magick showcase/images/screenshot.png -quality "${QUALITY}" showcase/images/screenshot.webp
  printf '  showcase: png optimised, webp derived from it\n'
fi

echo "screenshots: ${#THEMES[@]} theme(s) regenerated"
