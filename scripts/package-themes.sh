#!/usr/bin/env bash
set -euo pipefail

# Packages each theme into .zip and .tar.gz release archives.
#
# Archives contain the theme *source* — layouts, content, config, docs and
# screenshots — so a download is something you can build, not a copy of the
# rendered demo. Archives are written once to public/downloads/ and linked
# from each theme's own directory rather than duplicated into it.

cd "$(git rev-parse --show-toplevel)"

DOWNLOADS="public/downloads"
# Derived from themes/ rather than restated. This list previously
# duplicated the one in build.sh and fell one behind it: kaishi was added
# to build.sh, built and published, but never packaged -- so the theme was
# browsable on the site with no download beside it. Deriving the list means
# adding a theme cannot leave it half-shipped again.
THEMES=()
for _dir in themes/*/; do
  THEMES+=("$(basename "${_dir}")")
done

if ((${#THEMES[@]} == 0)); then
  echo "error: no themes found under themes/" >&2
  exit 1
fi

mkdir -p "${DOWNLOADS}"

for theme in "${THEMES[@]}"; do
  [[ -d "themes/${theme}" ]] || continue

  echo "==> packaging ${theme}"
  rm -f "${DOWNLOADS}/${theme}.zip" "${DOWNLOADS}/${theme}.tar.gz"

  # `-x` patterns and `--exclude` keep editor and OS cruft out of a release.
  (cd themes && zip -qr "../${DOWNLOADS}/${theme}.zip" "${theme}" \
      -x "*.DS_Store" -x "*/.git/*")
  tar --exclude='.DS_Store' --exclude='.git' \
      -czf "${DOWNLOADS}/${theme}.tar.gz" -C themes "${theme}"

  mkdir -p "public/${theme}"
  cp -f "${DOWNLOADS}/${theme}.zip" "public/${theme}/${theme}.zip"
  cp -f "${DOWNLOADS}/${theme}.tar.gz" "public/${theme}/${theme}.tar.gz"
done

echo "==> archives in ${DOWNLOADS}/"
