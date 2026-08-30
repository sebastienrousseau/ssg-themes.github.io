# Changelog

All notable changes to the Lucid theme are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] — 2026-08-30

### Added

- Initial release: a documentation theme following the U.S. Web Design System
  documentation-page pattern — side navigation, in-page contents, breadcrumb
  and named prev/next pagination.
- Light and dark colour schemes, both verified at WCAG AAA. Every token pair
  the theme renders is asserted at 7:1 for text and 3:1 for non-text by
  `scripts/contrast.py`, in both schemes, so a failing palette cannot build.
- 44 by 44 pixel minimum on every interactive target, meeting WCAG 2.5.5 at
  AAA rather than the 24 pixel AA minimum.
- English and French content, with `translation_key` on every page so
  `hreflang` alternates are generated and a missing translation fails
  validation.
- A typed front-matter contract in `content/content.schema.toml`, separating
  the 37 fields the shell needs on every page from the 48 that belong to a
  single layout.
- Colour-scheme control that cycles system, light and dark — including back
  to system, which a two-way switch cannot express.
- `make check-aaa`: two Playwright suites measuring what a browser paints
  rather than what the stylesheet declares — rendered contrast against
  computed backgrounds, 44px targets, heading order, landmarks, accessible
  names and 1.4.8 paragraph spacing across 8 pages and both colour schemes,
  plus reflow across 11 viewports (176 combinations).
- Non-text contrast held to 4.5:1 rather than the 3:1 of WCAG 1.4.11, which
  has no AAA level. Opt-in per theme, because raising it for every theme
  would fail four of them on a rule they never claimed.

### Fixed during development

- `.prose > * + *` matched nothing: the generator wraps rendered Markdown in
  its own element, so every paragraph had 0px spacing where 1.4.8 requires
  1.5x the line height. The rule read correctly and did nothing — found by
  measuring the page rather than trusting the stylesheet.
- The syntax highlighter labels shell tokens with the scope name `shell`,
  which collided with the layout container class of the same name and gave
  every token 21px of horizontal padding: `ssg --version` rendered as
  `ssg  --  version`. The container is renamed, and box properties are
  neutralised inside code blocks so the whole class of collision cannot
  recur.
- A markdown table forced a 320px viewport to 337px until cell content was
  allowed to break, and long shell commands now wrap rather than scroll
  below the reading width.
