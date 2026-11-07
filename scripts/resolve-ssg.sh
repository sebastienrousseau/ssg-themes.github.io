#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0 OR MIT
#
# Resolves the `ssg` binary for build.sh and audit.sh, and holds it to the
# version CI builds with (.github/ssg-version), so a local build cannot
# quietly use a different generator from the one that gates the deploy.
#
# Source it; it sets SSG. Overrides:
#   SSG=/path/to/ssg      use a specific binary (an unreleased build, say)
#   ALLOW_SSG_DRIFT=1     warn instead of failing when the version differs
#   SSG_EXPECTED_VERSION  the version to hold to; CI sets it to the version
#                         it installed, which differs from the pin only when
#                         ssg-version.yml is gating a candidate release
#
# A binary at /tmp/builds/... used to be preferred silently over PATH,
# which is how local and CI builds came to run different generators.

ssg_pin_file="$(git rev-parse --show-toplevel)/.github/ssg-version"

if [[ -n "${SSG:-}" ]]; then
  if [[ ! -x "${SSG}" ]] && ! command -v "${SSG}" >/dev/null 2>&1; then
    echo "error: SSG override is not executable: ${SSG}" >&2
    exit 1
  fi
elif command -v ssg >/dev/null 2>&1; then
  SSG="ssg"
else
  echo "error: no \`ssg\` binary found on PATH (pinned: $(tr -d '[:space:]' < "${ssg_pin_file}"))" >&2
  exit 1
fi

ssg_pinned="${SSG_EXPECTED_VERSION:-$(tr -d '[:space:]' < "${ssg_pin_file}")}"
ssg_found="$("${SSG}" --version 2>/dev/null | awk '{print $NF}')"
if [[ "${ssg_found}" != "${ssg_pinned}" ]]; then
  if [[ "${ALLOW_SSG_DRIFT:-0}" == "1" ]]; then
    echo "warning: ssg ${ssg_found} differs from the pinned ${ssg_pinned} (ALLOW_SSG_DRIFT=1)" >&2
  else
    echo "error: ssg ${ssg_found:-unknown} differs from the pinned ${ssg_pinned} in .github/ssg-version" >&2
    echo "       install it (mise use cargo:ssg@${ssg_pinned}) or set ALLOW_SSG_DRIFT=1" >&2
    exit 1
  fi
fi
unset ssg_pin_file ssg_pinned ssg_found
