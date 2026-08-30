#!/usr/bin/env bash
set -euo pipefail

# Runs `ssg audit` against a tree that mirrors the deployed URL layout.
#
# The mirroring itself, and why it is needed, lives in scripts/mirror-root.sh
# — several tools in this repo need the same trick.

cd "$(git rev-parse --show-toplevel)"

if [[ -x "/tmp/builds/cargo/release/ssg" ]]; then
  SSG="/tmp/builds/cargo/release/ssg"
elif command -v ssg >/dev/null 2>&1; then
  SSG="ssg"
else
  echo "error: no \`ssg\` binary found on PATH" >&2
  exit 1
fi

ROOT="$(bash scripts/mirror-root.sh)"

# Only clean up a tree this script caused to be created. When the site is
# served from the root of its own host there is no mirror: `mirror-root.sh`
# returns `public` itself, and removing that would delete the build the
# rest of `make check` still needs — which is exactly what happened the
# first time this ran without the guard.
if [[ "${ROOT}" != "public" ]]; then
  trap 'rm -rf "${ROOT}"' EXIT
fi

"${SSG}" audit -o "${ROOT}"

# The auditor assumes site root == URL root. Mirroring the deployment prefix
# fixes link and hreflang resolution but moves each theme's site-root
# conventions out of its view, so it reports llms.txt / agents.txt /
# ai-plugin.json / _headers as absent when every one is present. Rather than
# leave four permanent false findings, assert them here.
missing=0
for theme in apex atlas kinetic lucid quill stablo velocity voxt; do
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
