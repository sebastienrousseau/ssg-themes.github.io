# Changelog

All notable changes to the sebastienrousseau theme are recorded here. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.2.1] - 2026-10-06

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
