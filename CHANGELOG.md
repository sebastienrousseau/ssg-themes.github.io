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
- A category filter on the gallery: one toggle button per category, with
  counts taken from the tiles. Without JavaScript every theme still shows.
- Every theme demo carries a fixed "All N themes" link back to the
  gallery, in English or French, with N counted from `themes/*/theme.toml`.
  The downloadable theme sources do not include it. Its CSS ships as its
  own fingerprinted stylesheet; the generator's bundles are not modified.
- `make check-sri`: every local `integrity` hash in the built site is
  recomputed from the file it pins.
- `make check-a11y-report`: the CI step that asserts each theme's
  generated accessibility report is clean now also runs in `make check`.

### Changed

- The sebastienrousseau theme takes the site's column layouts and type scale.
- The sebastienrousseau theme takes the site's design system v2: the
  shell stylesheet in `@layer legacy`, with `design-system.css` after it
  as the one source of the type scale.
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
- The jspassgen header logo is an inline SVG hidden from assistive
  technology. ssg 0.0.72 reports its decorative `<img alt="">` as missing
  alt text, which failed the gate on every jspassgen page.
- `ruff check` passes on `scripts/` and `tests/unit/` again.
- The sebastienrousseau contact form's Send button keeps a border, so it
  stays visible in forced-colours mode (WCAG 1.4.11). The site carries the
  same fix.
- The browser gates are hermetic: every host but the local server and
  cloudcdn.pro resolves to "not found", so the site theme's Spotify
  embeds can no longer stall a page past the 30 s navigation timeout.
- The 1.4.4 clip check reports a clipped box only when it holds text,
  media or something focusable; a decorative layer of empty shapes has
  nothing to lose. `clip-selftest.mjs` pins both sides and runs first.
- Genre labels on the sebastienrousseau playlists page use `--ink-mute`
  instead of each lane's hue, several of which were below 4.5:1 on white
  (WCAG 1.4.3). The site carries the same fix.
- axe waits for entrance animations to finish before it measures, so a
  subtitle caught mid-fade is no longer reported as low contrast.
- The AAA target check applies WCAG 2.5.5's inline exception by the
  criterion's own test (an inline link whose block also holds words outside
  any control), whatever the markup's classes; `targets-selftest.mjs` pins
  both sides. The sebastienrousseau theme's standalone links (card CTAs,
  link rows, identifier and contact lists, single-link table cells) now
  have 44px targets, in the theme and the site.
- The responsive overlap check counts a control inside a fixed or sticky
  container as floating, as it already did for a fixed control itself.
- The focus-obscured check (WCAG 2.4.11/2.4.12) samples a link that wraps
  across lines fragment by fragment, so the words beside it no longer
  count as covering it; a self-test proves both directions.

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
