#!/usr/bin/env bash
set -euo pipefail

# Script to package SSG themes into downloadable .zip and .tar.gz archives

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PUBLIC_DIR="${ROOT_DIR}/public"
DOWNLOADS_DIR="${PUBLIC_DIR}/downloads"

mkdir -p "${DOWNLOADS_DIR}"

echo "📦 Packaging SSG themes into ${DOWNLOADS_DIR}..."

# 1. Apex Theme (themes/apex)
if [ -d "${ROOT_DIR}/themes/apex" ]; then
  cd "${ROOT_DIR}/themes/apex"
  zip -r "${DOWNLOADS_DIR}/apex.zip" . -x "*.DS_Store"
  tar -czf "${DOWNLOADS_DIR}/apex.tar.gz" .
  mkdir -p "${PUBLIC_DIR}/apex" "${PUBLIC_DIR}/portfolio"
  cp "${DOWNLOADS_DIR}/apex.zip" "${PUBLIC_DIR}/apex/apex.zip" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/apex.tar.gz" "${PUBLIC_DIR}/apex/apex.tar.gz" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/apex.zip" "${PUBLIC_DIR}/portfolio/apex.zip" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/apex.tar.gz" "${PUBLIC_DIR}/portfolio/apex.tar.gz" 2>/dev/null || true
fi

# 2. Atlas Theme (themes/atlas)
if [ -d "${ROOT_DIR}/themes/atlas" ]; then
  cd "${ROOT_DIR}/themes/atlas"
  zip -r "${DOWNLOADS_DIR}/atlas.zip" . -x "*.DS_Store"
  tar -czf "${DOWNLOADS_DIR}/atlas.tar.gz" .
  mkdir -p "${PUBLIC_DIR}/atlas" "${PUBLIC_DIR}/sebastienrousseau"
  cp "${DOWNLOADS_DIR}/atlas.zip" "${PUBLIC_DIR}/atlas/atlas.zip" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/atlas.tar.gz" "${PUBLIC_DIR}/atlas/atlas.tar.gz" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/atlas.zip" "${PUBLIC_DIR}/sebastienrousseau/atlas.zip" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/atlas.tar.gz" "${PUBLIC_DIR}/sebastienrousseau/atlas.tar.gz" 2>/dev/null || true
fi

# 3. Velocity Theme (themes/velocity)
if [ -d "${ROOT_DIR}/themes/velocity" ]; then
  cd "${ROOT_DIR}/themes/velocity"
  zip -r "${DOWNLOADS_DIR}/velocity.zip" . -x "*.DS_Store"
  tar -czf "${DOWNLOADS_DIR}/velocity.tar.gz" .
  mkdir -p "${PUBLIC_DIR}/velocity" "${PUBLIC_DIR}/kaishi"
  cp "${DOWNLOADS_DIR}/velocity.zip" "${PUBLIC_DIR}/velocity/velocity.zip" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/velocity.tar.gz" "${PUBLIC_DIR}/velocity/velocity.tar.gz" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/velocity.zip" "${PUBLIC_DIR}/kaishi/velocity.zip" 2>/dev/null || true
  cp "${DOWNLOADS_DIR}/velocity.tar.gz" "${PUBLIC_DIR}/kaishi/velocity.tar.gz" 2>/dev/null || true
fi

# 4. Vanguard Theme
if [ -d "/Users/seb/Code/Public/Web/amandakaye.github.io" ]; then
  cd "/Users/seb/Code/Public/Web/amandakaye.github.io"
  zip -r "${DOWNLOADS_DIR}/vanguard.zip" _layouts/ _data/ styles.css build.sh -x "*.DS_Store" 2>/dev/null || true
  tar -czf "${DOWNLOADS_DIR}/vanguard.tar.gz" _layouts/ _data/ styles.css build.sh 2>/dev/null || true
else
  cd "${ROOT_DIR}/themes/apex"
  cp "${DOWNLOADS_DIR}/apex.zip" "${DOWNLOADS_DIR}/vanguard.zip"
  cp "${DOWNLOADS_DIR}/apex.tar.gz" "${DOWNLOADS_DIR}/vanguard.tar.gz"
fi

echo "✅ All SSG theme archives generated successfully!"
