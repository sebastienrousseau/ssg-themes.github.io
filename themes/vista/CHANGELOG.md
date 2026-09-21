# Changelog — Vista

All notable changes to this theme are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-09-16

### Added

- Initial release. Four pages: home, features, specifications, contact,
  plus a 404 layout.
- A snap-scrolling feature rail with prev/next controls. It is a scroll
  region with an accessible name and a tab stop, reachable by trackpad,
  drag, arrow keys or the buttons; nothing auto-advances, so there is no
  timer needing a pause control under WCAG 2.2.2.
- Colour tokens gated at WCAG 1.4.6 AAA (7:1) for text and 1.4.11 (3:1)
  for borders and the focus ring, in both light and dark. The dark stage
  and silicon band carry their own `--stage-*` tokens, checked alongside
  the shared vocabulary.
- A φ-stepped type scale and a matching spacing scale (24, 40, 64, 104).
- Print stylesheet, `prefers-contrast: more`, forced-colours and Display P3
  restatements, in line with the rest of the suite.

### Notes

- The headline sits above the environment photograph rather than across it.
  Text over a photograph cannot be contrast-checked, and this photograph is
  a landscape whose brightness varies across its own width.
