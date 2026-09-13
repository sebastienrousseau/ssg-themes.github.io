# Changelog — Prism

All notable changes to this theme are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-09-13

### Added

- Initial release, migrated from the standalone "Lumina" template into the
  theme suite so it is gated by the same CI as every other theme. Six pages:
  home, products, solutions, developers, governance, contact, plus a 404
  layout.
- Navy masthead with a disclosure mega-menu. Each top-level item is a real
  link to its page; the panel beside it is opened by a separate button with
  `aria-expanded`, so keyboard users get the same menu pointer users do and
  the page still navigates without JavaScript.
- Sloped hero with three product mock-ups laid out on a grid, so they
  reflow to a single column at 320px instead of floating over each other.
- Colour tokens gated at WCAG 1.4.6 AAA (7:1) for text and 1.4.11 (3:1) for
  borders and the focus ring, in both light and dark. The masthead, hero and
  developer panel carry their own gated tokens, checked by
  `scripts/contrast.py` alongside the shared vocabulary.
- Print stylesheet, `prefers-contrast: more`, forced-colours and Display P3
  restatements, in line with the rest of the suite.

### Changed

- The mesh-gradient hero background is confined to the mock-up column and
  no longer sits behind any text, because a gradient cannot be
  contrast-checked. Hero copy sits on a solid navy ground at 17:1.
- The animated marquee of settlements is now a static, wrapping list. An
  auto-scrolling strip that never stops needs a pause control under WCAG
  2.2.2 and its `max-content` track failed the reflow gate at every width.
- The floating mock-up and mesh animations are gone for the same reason:
  motion that runs for more than five seconds needs a pause control.
- Body and muted text darkened from `#4a5568` / `#718096` to clear 7:1 on
  every ground they are used on; the original muted grey measured 4.6:1.
- The locale `<select>` in the footer, which was wired to nothing, is
  replaced by the generator's language-switcher slot.
- Partner badges no longer use `opacity` and `grayscale` to look muted;
  they use a gated muted token instead, so what is measured is what is seen.
