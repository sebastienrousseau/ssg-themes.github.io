# Changelog — Kinetic

All notable changes to this theme are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-08-15

### Added

- Initial release. Five pages: home, platform, solutions, pricing, contact,
  plus a 404 layout.
- Two progressive-enhancement islands. `feature-tabs` turns four stacked
  sections into a tab strip with roving-tabindex keyboard support;
  `pricing-toggle` adds an annual/monthly control to an already-complete
  monthly table. Neither renders a control it cannot wire up.
- Colour tokens gated at WCAG 1.4.6 AAA (7:1) for text and 1.4.11 (3:1) for
  borders and the focus ring, in both light and dark.
- Decorative gradients confined to backgrounds that carry no text, since a
  gradient cannot be contrast-checked.
- Print stylesheet: chrome and the tab strip are dropped, tokens forced to
  light, and external link targets appended to their text.
- No-JS navigation fallback via `html.no-js`.
