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

# Where GitHub Pages actually serves this repository. Confirm with:
#   gh api repos/<owner>/<repo>/pages --jq .html_url
SHOWCASE_BASE_URL="${SHOWCASE_BASE_URL:-https://sebastienrousseau.com/ssg-themes.github.io}"

BUILD_TMP="$(mktemp -d)"
trap 'rm -rf "${BUILD_TMP}"' EXIT

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

  # Themes ship `base_url = "https://example.com"` because they are
  # distributable artefacts — the showcase's deployment origin is not
  # theirs to carry, and a user copying a theme must not inherit it.
  #
  # The showcase overrides it here. SHOWCASE_BASE_URL must match where
  # GitHub Pages actually serves this repo: it is a *project* site, so the
  # repository name is part of the path. Getting this wrong is silent —
  # canonical URLs, hreflang, JSON-LD and the fingerprinted `_csp/` and
  # `_islands/` prefixes are all derived from it.
  local staged_config="${BUILD_TMP}/${theme}.ssg.toml"
  sed "s|^base_url = .*|base_url = \"${SHOWCASE_BASE_URL}/${theme}\"|" \
    "${config}" > "${staged_config}"

  "${SSG}" build -f "${staged_config}"

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

# Legacy theme paths.
#
# The themes were renamed (portfolio -> apex, sebastienrousseau -> atlas,
# kaishi -> velocity) and the old build mirrored the output into both. Those
# paths are live and may have inbound links, so dropping the mirror without
# a redirect would turn three working URLs into 404s.
#
# GitHub Pages serves no redirect rules, so this is the static equivalent:
# a canonical pointing at the new home for crawlers, a meta refresh for
# browsers, and a visible link for anyone with JavaScript and refresh
# disabled. Deliberately not a copy of the site — two live copies of the
# same content is what the canonical is there to prevent.
emit_legacy_redirect() {
  local legacy="$1" target="$2"
  mkdir -p "public/${legacy}"
  cat > "public/${legacy}/index.html" <<HTML
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Moved to ${target} — SSG Themes</title>
    <meta name="description" content="The ${legacy} theme was renamed to ${target}. This page redirects to its new home." />

    <!-- Hand-authored, so the generator's inline-extraction pass never sees
         it and the one <style> block below stays inline. Everything else
         stays strict; there is no script on the page at all. -->
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self';
               base-uri 'none';
               object-src 'none';
               script-src 'none';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;
               font-src 'self';
               connect-src 'self';
               form-action 'none'"
    />

    <link rel="canonical" href="${SHOWCASE_BASE_URL}/${target}/" />
    <meta name="robots" content="noindex, follow" />

    <!-- Social metadata describes the destination, not this stub: anything
         that unfurls this URL should show the theme it redirects to. -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${target} — SSG Themes" />
    <meta property="og:description" content="The ${legacy} theme was renamed to ${target}." />
    <meta property="og:url" content="${SHOWCASE_BASE_URL}/${target}/" />
    <meta property="og:image" content="${SHOWCASE_BASE_URL}/${target}/images/screenshot.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${target} — SSG Themes" />
    <meta name="twitter:image" content="${SHOWCASE_BASE_URL}/${target}/images/screenshot.png" />
    <meta http-equiv="refresh" content="0; url=${SHOWCASE_BASE_URL}/${target}/" />
    <style>
      body { font-family: system-ui, sans-serif; margin: 4rem auto; max-width: 40rem;
             padding-inline: 1.5rem; line-height: 1.6; color: #1d1d1f; background: #fbfbfd; }
      a { color: #00458f; }
      @media (prefers-color-scheme: dark) {
        body { color: #f5f5f7; background: #000; } a { color: #4db0ff; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>This theme was renamed</h1>
      <p><code>${legacy}</code> is now <strong>${target}</strong>.</p>
      <p><a href="${SHOWCASE_BASE_URL}/${target}/">Continue to ${target}</a></p>
    </main>
  </body>
</html>
HTML
  echo "==> redirect ${legacy}/ -> ${target}/"
}

if [[ "${TARGET}" == "all" ]]; then
  emit_legacy_redirect portfolio apex
  emit_legacy_redirect sebastienrousseau atlas
  emit_legacy_redirect kaishi velocity
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
