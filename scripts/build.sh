#!/usr/bin/env bash
set -euo pipefail

# Build script for SSG Themes Showcase (ssg-themes.github.io)
# Usage: ./scripts/build.sh [theme-name|all]

TARGET="${1:-all}"
BUILD_VERSION="$(date +%s)"

build_single_theme() {
  local THEME="$1"
  local THEME_DIR="themes/${THEME}"
  local OUTPUT_DIR="public/${THEME}"

  if [[ ! -d "${THEME_DIR}" ]]; then
    echo "Error: Theme '${THEME}' not found in ${THEME_DIR}"
    return 1
  fi

  echo "========================================================"
  echo " Building SSG Theme: ${THEME}"
  echo "========================================================"

  mkdir -p "${OUTPUT_DIR}"

  # Run SSG build
  ssg build \
    -c="${THEME_DIR}/content" \
    -t="${THEME_DIR}/_layouts" \
    -o="${OUTPUT_DIR}"

  # Copy static assets if present
  if [[ -d "${THEME_DIR}/assets" ]]; then
    mkdir -p "${OUTPUT_DIR}/assets"
    cp -R "${THEME_DIR}/assets/"* "${OUTPUT_DIR}/assets/" 2>/dev/null || true
  fi

  # Copy standalone layout CSS/JS files into output AFTER ssg build finishes
  for file in styles.css main.js theme-init.js search.js search.css sw.js; do
    if [[ -f "${THEME_DIR}/_layouts/${file}" ]]; then
      cp -f "${THEME_DIR}/_layouts/${file}" "${OUTPUT_DIR}/${file}"
    fi
  done

  # Copy theme favicon.ico
  if [[ -f "${THEME_DIR}/assets/favicon.ico" ]]; then
    cp -f "${THEME_DIR}/assets/favicon.ico" "${OUTPUT_DIR}/favicon.ico"
  elif [[ -f "favicon.ico" ]]; then
    cp -f "favicon.ico" "${OUTPUT_DIR}/favicon.ico"
  fi

  echo "✅ Build complete for theme '${THEME}' -> ${OUTPUT_DIR}"
}

mkdir -p public

if [[ "${TARGET}" == "all" ]]; then
  echo "Building all themes in monorepo..."
  for tdir in themes/*; do
    if [[ -d "${tdir}" ]]; then
      tname="$(basename "${tdir}")"
      build_single_theme "${tname}"
    fi
  done
else
  build_single_theme "${TARGET}"
fi

# Copy root favicon.ico to public/
if [[ -f "favicon.ico" ]]; then
  cp -f "favicon.ico" "public/favicon.ico"
fi

# Stage root Theme Gallery Showcase index.html
if [[ -f "public_index.html" ]]; then
  cp -f "public_index.html" "public/index.html"
elif [[ -f "index.html" ]]; then
  cp -f "index.html" "public/index.html"
fi

# Generate .html file fallbacks for directory outputs and stage ALL asset dependencies into subdirectories
find public -type f -name "index.html" | while read -r idx; do
  dir="$(dirname "$idx")"
  if [[ "$dir" != "public" && "$dir" != "public/portfolio" && "$dir" != "public/sebastienrousseau" && "$dir" != "public/kaishi" ]]; then
    cp -f "$idx" "${dir}.html" 2>/dev/null || true

    # Stage ALL JS, CSS, favicon, search index, and _csp assets into subdirectories for 100% 200 OK resolution
    parent="$(dirname "$dir")"
    cp -f "${parent}"/*.js "${dir}/" 2>/dev/null || true
    cp -f "${parent}"/*.css "${dir}/" 2>/dev/null || true
    cp -f "${parent}"/search-index*.json "${dir}/" 2>/dev/null || true
    if [[ -f "${parent}/favicon.ico" ]]; then
      cp -f "${parent}/favicon.ico" "${dir}/favicon.ico" 2>/dev/null || true
    fi

    if [[ -d "${parent}/_csp" ]]; then
      mkdir -p "${dir}/_csp"
      cp -R "${parent}/_csp/"* "${dir}/_csp/" 2>/dev/null || true
    fi
    if [[ -d "${parent}/assets" ]]; then
      mkdir -p "${dir}/assets"
      cp -R "${parent}/assets/"* "${dir}/assets/" 2>/dev/null || true
    fi
  fi
done

# Inject favicon link tag, apply cache buster to script/link tags and strip auto-injected <div lang="en"> fallbacks
if [[ "$(uname)" == "Darwin" ]]; then
  find public -type f -name "*.html" -exec sed -i '' \
    -e 's|href="/_csp/|href="_csp/|g' \
    -e 's|src="/_csp/|src="_csp/|g' \
    -e 's| integrity="[^"]*"||g' \
    -e 's|<meta name="description" content="&amp;lt;div lang=&quot;en&quot; &amp;lt;/div">||g' \
    -e 's|<meta property="og:description" content="&amp;lt;div lang=&quot;en&quot; &amp;lt;/div">||g' \
    -e 's|<meta name="twitter:description" content="&amp;lt;div lang=&quot;en&quot; &amp;lt;/div">||g' \
    -e 's|&lt;div lang="en">&lt;/div>||g' \
    -e "s|\.js\"|.js?v=${BUILD_VERSION}\"|g" \
    -e "s|\.css\"|.css?v=${BUILD_VERSION}\"|g" \
    -e 's|</head>|<link rel="icon" type="image/x-icon" href="favicon.ico"></head>|g' \
    {} + 2>/dev/null || true
else
  find public -type f -name "*.html" -exec sed -i \
    -e 's|href="/_csp/|href="_csp/|g' \
    -e 's|src="/_csp/|src="_csp/|g' \
    -e 's| integrity="[^"]*"||g' \
    -e 's|<meta name="description" content="&amp;lt;div lang=&quot;en&quot; &amp;lt;/div">||g' \
    -e 's|<meta property="og:description" content="&amp;lt;div lang=&quot;en&quot; &amp;lt;/div">||g' \
    -e 's|<meta name="twitter:description" content="&amp;lt;div lang=&quot;en&quot; &amp;lt;/div">||g' \
    -e 's|&lt;div lang="en">&lt;/div>||g' \
    -e "s|\.js\"|.js?v=${BUILD_VERSION}\"|g" \
    -e "s|\.css\"|.css?v=${BUILD_VERSION}\"|g" \
    -e 's|</head>|<link rel="icon" type="image/x-icon" href="favicon.ico"></head>|g' \
    {} + 2>/dev/null || true
fi

echo "========================================================"
echo " Showcase build complete in public/"
echo "========================================================"
