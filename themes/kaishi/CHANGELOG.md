# Changelog

All notable changes to the Kaishi theme are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-09-01

### Added

- First release, migrated from the standalone `kaishi.github.io` site into
  the theme suite so it is gated by the same CI as every other theme.
- Apple-inspired design layer: translucent sticky header, 980px pill
  controls, 24px card geometry and the SF Pro system font stack.

### Fixed

- Dark-mode colour tokens. The original site reused one `--text-muted`
  (`#374151`) across both schemes, which measured **1.75:1** on the dark
  surface, and an accent (`#0056b3`) at **2.98:1** on black — both below
  even AA. Dark mode now carries its own palette and every pair clears AAA.
- The light-mode accent, which measured 6.81:1 and so met AA but not the
  AAA level the site claimed.
