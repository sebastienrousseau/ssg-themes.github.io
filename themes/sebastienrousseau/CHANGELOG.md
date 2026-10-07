# Changelog

All notable changes to the sebastienrousseau theme are recorded here. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
