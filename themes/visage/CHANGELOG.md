# Changelog

## Unreleased

### Fixed

- The desktop header no longer shifts on load. The page streams, so the first paint can come before the language switcher and the theme toggle are parsed, and the nav, packed against them, moved 66 px left when they arrived: a layout shift of 0.0013 that failed Lighthouse's desktop budget of 0 on some runs. The two controls now hold fixed grid tracks, and the switcher its final height, from the first paint.

## 1.0.0 — 2026-09-13

- Initial Visage theme.
- Added original aesthetic-health landing page and about page.
- Added Skeletonic-based responsive styling and light/dark palettes.
- Added structured data, agent discovery and resilient interaction fallbacks.
