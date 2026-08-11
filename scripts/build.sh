#!/usr/bin/env bash
set -euo pipefail

# Build script for SSG Themes Showcase (ssg-themes.github.io)
# Usage: ./scripts/build.sh [theme-name|all]

RAW_TARGET="${1:-all}"
BUILD_VERSION="$(date +%s)"

# Map legacy target names to renamed theme folder names
case "${RAW_TARGET}" in
  portfolio) TARGET="apex" ;;
  sebastienrousseau) TARGET="atlas" ;;
  kaishi) TARGET="velocity" ;;
  *) TARGET="${RAW_TARGET}" ;;
esac

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

  # Mirror output to legacy folder paths for 100% backward compatibility
  if [[ "${THEME}" == "apex" ]]; then
    mkdir -p public/portfolio
    cp -R "${OUTPUT_DIR}/"* public/portfolio/ 2>/dev/null || true
  elif [[ "${THEME}" == "atlas" ]]; then
    mkdir -p public/sebastienrousseau
    cp -R "${OUTPUT_DIR}/"* public/sebastienrousseau/ 2>/dev/null || true
  elif [[ "${THEME}" == "velocity" ]]; then
    mkdir -p public/kaishi
    cp -R "${OUTPUT_DIR}/"* public/kaishi/ 2>/dev/null || true
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

# Run theme packager to generate .zip and .tar.gz archives
if [[ -f "scripts/package-themes.sh" ]]; then
  chmod +x scripts/package-themes.sh
  ./scripts/package-themes.sh
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
  if [[ "$dir" != "public" && "$dir" != "public/apex" && "$dir" != "public/atlas" && "$dir" != "public/velocity" && "$dir" != "public/portfolio" && "$dir" != "public/sebastienrousseau" && "$dir" != "public/kaishi" && "$dir" != "public/downloads" ]]; then
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

# Python post-processing: strip any auto-injected <div lang="en"> bleeding blocks completely
python3 -c '
import glob, re
for path in glob.glob("public/**/*.html", recursive=True):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    cleaned = re.sub(r"<div lang=\"en\">.*?</div>", "", content, flags=re.DOTALL)
    cleaned = re.sub(r"&lt;div lang=\"en\"&gt;.*?&lt;/div&gt;", "", cleaned, flags=re.DOTALL)
    cleaned = re.sub(r"<meta [^>]*content=\"&amp;lt;div lang=&quot;en&quot; [^>]*>", "", cleaned)
    if cleaned != content:
        with open(path, "w", encoding="utf-8") as f:
            f.write(cleaned)
' 2>/dev/null || true

# Inject favicon link tag, apply cache buster to script/link tags
if [[ "$(uname)" == "Darwin" ]]; then
  find public -type f -name "*.html" -exec sed -i '' \
    -e 's|href="/_csp/|href="_csp/|g' \
    -e 's|src="/_csp/|src="_csp/|g' \
    -e 's| integrity="[^"]*"||g' \
    -e "s|\.js\"|.js?v=${BUILD_VERSION}\"|g" \
    -e "s|\.css\"|.css?v=${BUILD_VERSION}\"|g" \
    -e 's|</head>|<link rel="icon" type="image/x-icon" href="favicon.ico"></head>|g' \
    {} + 2>/dev/null || true
else
  find public -type f -name "*.html" -exec sed -i \
    -e 's|href="/_csp/|href="_csp/|g' \
    -e 's|src="/_csp/|src="_csp/|g' \
    -e 's| integrity="[^"]*"||g' \
    -e "s|\.js\"|.js?v=${BUILD_VERSION}\"|g" \
    -e "s|\.css\"|.css?v=${BUILD_VERSION}\"|g" \
    -e 's|</head>|<link rel="icon" type="image/x-icon" href="favicon.ico"></head>|g' \
    {} + 2>/dev/null || true
fi

echo "========================================================"
echo " Showcase build complete in public/"
echo "========================================================"
