#!/usr/bin/env bash
set -euo pipefail

# Build script for SSG Themes Showcase (ssg-themes.github.io)
# Usage: ./scripts/build.sh [theme-name]

THEME="${1:-portfolio}"
THEME_DIR="themes/${THEME}"
OUTPUT_DIR="public/${THEME}"

if [[ ! -d "${THEME_DIR}" ]]; then
  echo "Error: Theme '${THEME}' not found in ${THEME_DIR}"
  exit 1
fi

echo "========================================================"
echo " Building SSG Theme: ${THEME}"
echo " Content Dir:  ${THEME_DIR}/content"
echo " Template Dir: ${THEME_DIR}/_layouts"
echo " Output Dir:   ${OUTPUT_DIR}"
echo "========================================================"

mkdir -p "${OUTPUT_DIR}"

# Run SSG build
ssg build \
  -c="${THEME_DIR}/content" \
  -t="${THEME_DIR}/_layouts" \
  -o="${OUTPUT_DIR}"

# Copy static assets into output
if [[ -d "${THEME_DIR}/assets" ]]; then
  echo "Staging static assets..."
  mkdir -p "${OUTPUT_DIR}/assets"
  cp -R "${THEME_DIR}/assets/"* "${OUTPUT_DIR}/assets/"
fi

# Copy standalone JS/CSS files if present
for file in main.js theme-init.js search.js search.css; do
  if [[ -f "${THEME_DIR}/_layouts/${file}" ]]; then
    cp -f "${THEME_DIR}/_layouts/${file}" "${OUTPUT_DIR}/${file}"
  fi
done

echo "Build complete for theme '${THEME}' -> ${OUTPUT_DIR}"
