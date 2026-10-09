# Changelog

All notable changes to the sebastienrousseau theme are recorded here. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- The self-hosted variable fonts carry only the weights their
  `@font-face` rules declare (400 to 700): Newsreader 132 to 95 KB,
  Inter 48 to 36 KB, and 214 KB less across all eight files.
  `tools/limit_font_axes.py` does it from `fonts.css`; metrics are
  untouched, so every line breaks where it did.
- A first view renders in the metric-matched system faces; the webfonts
  are fetched after the page's `load` event, and later views use them
  from the start (`theme-init.js` adds `.wf` to `<html>` once `main.js`
  has recorded them). No font download sits on the path to first paint,
  and nothing swaps under the reader: every face is
  `font-display: optional`, and the Newsreader preload is gone. On the
  demo home, Lighthouse mobile performance goes from 0.96 to 1.0 (first
  paint 1.66 to 1.36 s, largest paint 2.71 to 1.51 s, layout shift
  0.0054 to 0).
- The client logos are served at display size from `/_csp/`
  (190 by 64 px, 29 KB for all six) instead of 6096 by 2048 px from the
  CDN (1.5 MB).

### Fixed

- The service worker registers only where the theme is served from the
  host root. Under a sub-path, such as the gallery demo, it requested a
  `/sw.js` the host does not have and logged an error on every page.

## [1.2.1] - 2026-10-06

### Changed

- The theme meets the gallery's design contract, and the live site adopts
  the result through the theme: a three-state colour-scheme control
  (`#mode-toggle`: system, light, dark, persisted; system is no
  `data-theme` attribute), 44 px targets for every navigation, footer,
  card, chip, breadcrumb and credential link, inline-block prose links
  that never wrap across two lines, 3:2 card and featured media frames,
  a story hero that becomes a natural-aspect banner below 1024 px, no
  line clamps on titles and excerpts, a rotating hero title that fits
  320 px, closed `details` hidden with `visibility`, decorative clipping
  with `overflow: clip`, 12 px table headers, Spotify players that load
  on request from a link usable without JavaScript, code blocks that
  wrap instead of scrolling sideways, dark ink on the pills
  in dark mode, and the mode-control colours as tokens.
- `ssg.toml` sets `no_taxonomy_pages = true`, as the live site builds with
  `--no-tag-pages`; the samples carry the site's own tags landing.

### Fixed

- Text on photographs and gradients meets AAA, measured from rendered
  pixels: the story hero's scrim is 62-70% black (its title measured
  2.75:1), the playlists topper gains a radial scrim (3.18:1), the
  featured band's kicker uses a lighter rose (3.80:1) and its meta line a
  lighter tint (6.89:1). Translucent white text is opaque tokens, which
  HTML_CodeSniffer can measure (it reported NaN:1).
- The demo's self-hosted fonts load under the gallery path: `fonts.css`
  names its files relative to itself instead of `/fonts/`, which on the
  gallery is the host root (all eight returned 404, so the demo rendered
  in fallback fonts).
- Focus stays in view when it enters the reCAPTCHA widget, whose
  cross-origin frame the browser does not scroll the page for; the
  loader also skips a placeholder site key, for which Google can only
  render an error widget.
- The on-request Spotify loader builds the embed URL from the playlist
  id in the link's href (22 alphanumerics, fixed origin) instead of
  taking a frame source from a data attribute; CodeQL flagged the
  attribute as DOM text reinterpreted as HTML. The 40 player links drop
  their unused data-src and data-allow attributes.
- The gallery demo resolves under `/sebastienrousseau/`. The templates
  keep their root-absolute links (they must stay byte-identical to the
  site's), so the showcase build re-bases them onto the theme's path
  with `scripts/rebase_links.py`; the site's self-hosted fonts and the
  store badge the playlist layout loads from `/_csp/` ship through
  `assets/_root/`, published at the theme root.
- Every page the header and footer link to ships as a sample in both
  locales; article cards for stories the demo does not carry link to the
  live article; the 32 locales the demo does not ship get a landing page
  each; the suite page carries the `#catalog` anchor its layout targets.

### Added

- First release, extracted from the twelve generated layouts of
  sebastienrousseau.com at site version 1.2.1 (commit `aaa7c41c87`).
  One shell (`base.html`, `header.html`, `footer.html`, `styles.css`)
  replaces 2.6 MB of repeated markup: the twelve flat layouts were 213 KB
  each because the whole stylesheet was inlined in every one.
- `tools/extract_from_site.py` imports the site's layouts and
  `tools/flatten.py` produces them again. Running one after the other
  reproduces the site's `_layouts/` byte for byte, which is this theme's
  fidelity gate.
- Sample content: the site's own home, about, articles, contact, research,
  playlists, projects, story, thank-you, 404 and editorial pages, plus one
  dated article, with French counterparts paired by `translation_key`.
