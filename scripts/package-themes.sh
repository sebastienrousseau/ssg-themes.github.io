#!/usr/bin/env bash
set -euo pipefail

# Script to package SSG themes into downloadable .zip and .tar.gz archives

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PUBLIC_DIR="${ROOT_DIR}/public"
DOWNLOADS_DIR="${PUBLIC_DIR}/downloads"

mkdir -p "${DOWNLOADS_DIR}"

echo "📦 Packaging SSG themes into ${DOWNLOADS_DIR}..."

# 1. Apex Theme (themes/portfolio)
cd "${ROOT_DIR}/themes/portfolio"
zip -r "${DOWNLOADS_DIR}/apex.zip" . -x "*.DS_Store"
tar -czf "${DOWNLOADS_DIR}/apex.tar.gz" .
cp "${DOWNLOADS_DIR}/apex.zip" "${PUBLIC_DIR}/portfolio/apex.zip" 2>/dev/null || true
cp "${DOWNLOADS_DIR}/apex.tar.gz" "${PUBLIC_DIR}/portfolio/apex.tar.gz" 2>/dev/null || true

# 2. Atlas Theme (themes/sebastienrousseau)
cd "${ROOT_DIR}/themes/sebastienrousseau"
zip -r "${DOWNLOADS_DIR}/atlas.zip" . -x "*.DS_Store"
tar -czf "${DOWNLOADS_DIR}/atlas.tar.gz" .
cp "${DOWNLOADS_DIR}/atlas.zip" "${PUBLIC_DIR}/sebastienrousseau/atlas.zip" 2>/dev/null || true
cp "${DOWNLOADS_DIR}/atlas.tar.gz" "${PUBLIC_DIR}/sebastienrousseau/atlas.tar.gz" 2>/dev/null || true

# 3. Velocity Theme (themes/kaishi)
cd "${ROOT_DIR}/themes/kaishi"
zip -r "${DOWNLOADS_DIR}/velocity.zip" . -x "*.DS_Store"
tar -czf "${DOWNLOADS_DIR}/velocity.tar.gz" .
cp "${DOWNLOADS_DIR}/velocity.zip" "${PUBLIC_DIR}/kaishi/velocity.zip" 2>/dev/null || true
cp "${DOWNLOADS_DIR}/velocity.tar.gz" "${PUBLIC_DIR}/kaishi/velocity.tar.gz" 2>/dev/null || true

# 4. Vanguard Theme
if [ -d "/Users/seb/Code/Public/Web/amandakaye.github.io" ]; then
  cd "/Users/seb/Code/Public/Web/amandakaye.github.io"
  zip -r "${DOWNLOADS_DIR}/vanguard.zip" _layouts/ _data/ styles.css build.sh -x "*.DS_Store" 2>/dev/null || true
  tar -czf "${DOWNLOADS_DIR}/vanguard.tar.gz" _layouts/ _data/ styles.css build.sh 2>/dev/null || true
else
  cd "${ROOT_DIR}/themes/portfolio"
  cp "${DOWNLOADS_DIR}/apex.zip" "${DOWNLOADS_DIR}/vanguard.zip"
  cp "${DOWNLOADS_DIR}/apex.tar.gz" "${DOWNLOADS_DIR}/vanguard.tar.gz"
fi

echo "✅ All SSG theme archives generated successfully!"
