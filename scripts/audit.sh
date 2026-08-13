#!/usr/bin/env bash
set -euo pipefail

# Runs `ssg audit` against a tree that mirrors the deployed URL layout.
#
# GitHub Pages serves this repository as a *project* site, so `public/` is
# published at `/ssg-themes.github.io/`, not at `/`. Every root-absolute URL
# in the output therefore starts with that segment.
#
# `ssg audit` resolves those URLs against the directory it is given. Pointed
# straight at `public/`, it looks for `public/ssg-themes.github.io/apex/…`
# and reports several hundred phantom broken links and missing hreflang
# targets — the site is correct, the root is not.
#
# So mirror the path prefix first. Hard links keep this close to free and
# give the auditor real files rather than symlinks it may decline to follow.

cd "$(git rev-parse --show-toplevel)"

# Must match SHOWCASE_BASE_URL's path component in scripts/build.sh.
PREFIX="${SHOWCASE_PATH_PREFIX:-ssg-themes.github.io}"
ROOT=".audit-root"

if [[ ! -d public ]]; then
  echo "error: public/ not found — run \`make build\` first" >&2
  exit 1
fi

if [[ -x "/tmp/builds/cargo/release/ssg" ]]; then
  SSG="/tmp/builds/cargo/release/ssg"
elif command -v ssg >/dev/null 2>&1; then
  SSG="ssg"
else
  echo "error: no \`ssg\` binary found on PATH" >&2
  exit 1
fi

rm -rf "${ROOT}"
mkdir -p "${ROOT}"
# `cp -al` on Linux, `cp -Rl` on macOS — try the portable spelling first.
cp -Rl public "${ROOT}/${PREFIX}" 2>/dev/null \
  || cp -R public "${ROOT}/${PREFIX}"

trap 'rm -rf "${ROOT}"' EXIT

"${SSG}" audit -o "${ROOT}"

# The auditor assumes site root == URL root. Mirroring the deployment prefix
# fixes link and hreflang resolution but moves each theme's site-root
# conventions out of its view, so it reports llms.txt / agents.txt /
# ai-plugin.json / _headers as absent when every one is present. Rather than
# leave four permanent false findings, assert them here.
missing=0
for theme in apex atlas velocity; do
  for f in llms.txt agents.txt .well-known/ai-plugin.json .well-known/mcp.json _headers robots.txt sitemap.xml; do
    if [[ ! -f "public/${theme}/${f}" ]]; then
      echo "  FAIL  ${theme}/${f} missing" >&2
      missing=$((missing + 1))
    fi
  done
done
if (( missing > 0 )); then
  echo "site-root conventions: ${missing} missing" >&2
  exit 1
fi
echo "site-root conventions: present for all themes (checked here because the mirrored audit root hides them)"
