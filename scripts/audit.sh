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
