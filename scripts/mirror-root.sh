#!/usr/bin/env bash
set -euo pipefail

# Prints the directory a tool should treat as the site root.
#
# The showcase is served from the root of its own host, so `public/` *is*
# the root and this prints it unchanged.
#
# It still exists because the repo was previously served at a path
# (`/ssg-themes.github.io/`), where every root-absolute URL in the output
# began with that segment. Any tool resolving those URLs against a
# directory — `ssg audit`, linkinator, an HTTP server feeding axe — needed
# the segment to exist on disk, or it reported the site as broken when it
# was the root that was wrong. Set `SHOWCASE_PATH_PREFIX` to bring that
# behaviour back for a project-path deployment.
#
# Usage:  ROOT="$(bash scripts/mirror-root.sh)"
# The caller owns the directory and is responsible for removing it, unless
# it is `public/` itself.

cd "$(git rev-parse --show-toplevel)"

# Must match SHOWCASE_BASE_URL's path component in scripts/build.sh.
# Empty for a site served from the root of its own host.
PREFIX="${SHOWCASE_PATH_PREFIX-}"
ROOT="${MIRROR_ROOT:-.audit-root}"

if [[ ! -d public ]]; then
  echo "error: public/ not found — run \`make build\` first" >&2
  exit 1
fi

if [[ -z "${PREFIX}" ]]; then
  # No path segment to reproduce: public/ is already the site root.
  echo "public"
  exit 0
fi

rm -rf "${ROOT}"
mkdir -p "${ROOT}"
# `cp -al` on Linux, `cp -Rl` on macOS — try the portable spelling first.
cp -Rl public "${ROOT}/${PREFIX}" 2>/dev/null \
  || cp -R public "${ROOT}/${PREFIX}"

echo "${ROOT}"
