<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions
step by 0.0.1 per release. The full notes for each release live in
[`releases/`](releases/).

## [0.0.7] - Unreleased

### Added

- `make test`: unit tests for the scripts that rewrite built HTML, run first
  in `make check` and in CI.
- `scripts/resolve-ssg.sh`: one place that finds the `ssg` binary and fails
  when it differs from `.github/ssg-version`.

### Changed

- The sebastienrousseau theme takes the site's column layouts and type scale.
- The generator pin moves to ssg 0.0.72.
- Every GitHub Action is pinned to a full commit SHA. Checkouts no longer
  keep the token, jobs have timeouts, and a deploy on `main` is never
  cancelled midway.
- The Pages artifact is uploaded straight after the build, before any
  npm-installed test tool runs.
- Dependabot groups its updates per ecosystem and may open up to ten PRs.
- `ssg-version.yml` opens its bump PR against the open release branch
  rather than `main`.

### Fixed

- Brand links, copy buttons and search triggers in 18 themes now have an
  accessible name that contains their visible text (WCAG 2.5.3), which axe
  4.14 reports and which had turned `main` red.
- The hero portrait preload under `/sebastienrousseau/` points at files
  that exist: `imagesrcset` is now re-based like `srcset`.
- The responsive overlap check measures each line box of a wrapped link,
  not its bounding rectangle, which reported links in running text as
  overlapping.
- A crates.io version string can no longer reach a shell script in CI
  unvalidated.

## [0.0.6] - 2026-11-01

### Changed

- ssg, GitHub Actions, Playwright and axe-core dependencies bumped. See
  [releases/v0.0.6.md](releases/v0.0.6.md).

## [0.0.5] - 2026-11-01

See [releases/v0.0.5.md](releases/v0.0.5.md).

## [0.0.4] - 2026-09-27

See [releases/v0.0.4.md](releases/v0.0.4.md).

## [0.0.3] - 2026-09-21

See [releases/v0.0.3.md](releases/v0.0.3.md).

## [0.0.2] - 2026-09-13

See [releases/v0.0.2.md](releases/v0.0.2.md).

## [0.0.1] - 2026-08-13

See [releases/v0.0.1.md](releases/v0.0.1.md).

[0.0.7]: https://github.com/sebastienrousseau/ssg-themes.github.io/compare/v0.0.6...feat/v0.0.7
[0.0.6]: https://github.com/sebastienrousseau/ssg-themes.github.io/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/sebastienrousseau/ssg-themes.github.io/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/sebastienrousseau/ssg-themes.github.io/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/sebastienrousseau/ssg-themes.github.io/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/sebastienrousseau/ssg-themes.github.io/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/sebastienrousseau/ssg-themes.github.io/releases/tag/v0.0.1
