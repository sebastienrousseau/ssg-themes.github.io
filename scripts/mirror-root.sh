#!/usr/bin/env bash
set -euo pipefail

# Builds a tree that mirrors the deployed URL layout and prints its path.
#
# GitHub Pages serves this repository as a *project* site, so `public/` is
# published at `/ssg-themes.github.io/`, not at `/`. Every root-absolute URL
# in the output therefore starts with that segment.
#
# Any tool that resolves those URLs against a directory — `ssg audit`,
# linkinator, an HTTP server feeding axe — needs the segment to exist on
# disk. Pointed straight at `public/`, each one looks for
# `public/ssg-themes.github.io/...`, finds nothing, and reports the site as
# broken when it is the root that is wrong. Before this existed, the axe
# step loaded pages whose stylesheet 404'd and declared them accessible,
# and linkinator reported 57 phantom broken links.
#
# Hard links keep this close to free and give tools real files rather than
# symlinks they may decline to follow.
#
# Usage:  ROOT="$(bash scripts/mirror-root.sh)"
# The caller owns the directory and is responsible for removing it.

cd "$(git rev-parse --show-toplevel)"

# Must match SHOWCASE_BASE_URL's path component in scripts/build.sh.
PREFIX="${SHOWCASE_PATH_PREFIX:-ssg-themes.github.io}"
ROOT="${MIRROR_ROOT:-.audit-root}"

if [[ ! -d public ]]; then
  echo "error: public/ not found — run \`make build\` first" >&2
  exit 1
fi

rm -rf "${ROOT}"
mkdir -p "${ROOT}"
# `cp -al` on Linux, `cp -Rl` on macOS — try the portable spelling first.
cp -Rl public "${ROOT}/${PREFIX}" 2>/dev/null \
  || cp -R public "${ROOT}/${PREFIX}"

echo "${ROOT}"
