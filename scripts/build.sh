#!/usr/bin/env bash
set -euo pipefail

# Build script for the SSG theme showcase.
#
#   ./scripts/build.sh [theme|all]
#
# Each theme is driven entirely by its own `ssg.toml`, which carries the
# site name, description, base URL and the content/template/output paths.
# Nothing here rewrites generated HTML.
#
# What this script deliberately no longer does, and why:
#
#   * It does not strip `integrity="..."` attributes. The previous version
#     ran `sed -e 's| integrity="[^"]*"||g'` across every built file, which
#     removed exactly the Subresource Integrity hashes the README claimed
#     as a feature.
#   * It does not cache-bust by string-replacing `.js"` and `.css"`. The
#     generator already emits content-addressed filenames under `_csp/`,
#     and the blind replacement also corrupted those strings wherever they
#     appeared in prose or code samples.
#   * It does not delete `<div lang="en">…</div>` with a DOTALL regex. That
#     was a workaround for Markdown bodies rendering as escaped source; the
#     real fix was `{{!content}}` (unescaped) in the layouts.
#   * It does not copy every asset into every output subdirectory. Layouts
#     now use a `{{base_path}}` root-relative prefix, so one copy resolves
#     from any depth.

cd "$(git rev-parse --show-toplevel)"

THEMES=(apex atlas velocity)
TARGET="${1:-all}"

# Prefer a locally built binary when present so the repo can be built
# against an unreleased generator; otherwise use whatever is on PATH.
if [[ -x "/tmp/builds/cargo/release/ssg" ]]; then
  SSG="/tmp/builds/cargo/release/ssg"
elif command -v ssg >/dev/null 2>&1; then
  SSG="ssg"
else
  echo "error: no \`ssg\` binary found on PATH" >&2
  exit 1
fi

build_theme() {
  local theme="$1"
  local config="themes/${theme}/ssg.toml"

  if [[ ! -f "${config}" ]]; then
    echo "error: ${config} not found" >&2
    return 1
  fi

  echo "==> building ${theme}"
  "${SSG}" build -f "${config}"

  # Standalone stylesheet and scripts. These live in `_layouts/` beside the
  # templates that reference them, but the generator only compiles `.html`
  # from that directory — it never copies siblings — so without this step
  # every page 404s on its stylesheet and renders unstyled.
  for asset in styles.css main.js theme-init.js; do
    if [[ -f "themes/${theme}/_layouts/${asset}" ]]; then
      cp -f "themes/${theme}/_layouts/${asset}" "public/${theme}/${asset}"
    fi
  done

  # Screenshots, referenced by the gallery landing page.
  if [[ -d "themes/${theme}/images" ]]; then
    mkdir -p "public/${theme}/images"
    cp -f "themes/${theme}/images/"*.png "themes/${theme}/images/"*.webp \
       "public/${theme}/images/"
  fi

  # Static assets that are not generated: images, favicon, downloads.
  if [[ -d "themes/${theme}/assets" ]]; then
    mkdir -p "public/${theme}/assets"
    cp -R "themes/${theme}/assets/." "public/${theme}/assets/"
  fi
  if [[ -f "themes/${theme}/assets/favicon.ico" ]]; then
    cp -f "themes/${theme}/assets/favicon.ico" "public/${theme}/favicon.ico"
  elif [[ -f "favicon.ico" ]]; then
    cp -f "favicon.ico" "public/${theme}/favicon.ico"
  fi
}

mkdir -p public

if [[ "${TARGET}" == "all" ]]; then
  for theme in "${THEMES[@]}"; do
    build_theme "${theme}"
  done
else
  build_theme "${TARGET}"
fi

# Release archives, built from the theme sources rather than the output so
# what a visitor downloads is the theme, not a rendered copy of the demo.
if [[ -f "scripts/package-themes.sh" ]]; then
  bash scripts/package-themes.sh
fi

# Gallery landing page.
if [[ -f "public_index.html" ]]; then
  cp -f "public_index.html" "public/index.html"
fi
if [[ -f "favicon.ico" ]]; then
  cp -f "favicon.ico" "public/favicon.ico"
fi

# Root-level agent discovery for the gallery. Each theme gets its own
# generated llms.txt; this one describes the collection.
if [[ -f "llms.txt" ]]; then
  cp -f "llms.txt" "public/llms.txt"
fi

echo "==> showcase built into public/"
