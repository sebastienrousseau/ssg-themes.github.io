# Changelog — Apex

All notable changes to this theme. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-08-11

Rewritten. This release is not backwards compatible with 1.0.0: layouts,
front-matter fields and the token names have all changed.

### Fixed

- **Mobile navigation was unreachable.** The stylesheet hid `.nav-menu`
  below 768px and revealed a `.nav-toggle` that no layout emitted, leaving
  phones with no navigation at all. The disclosure button now ships in
  `header.html` and is wired to `main.js`.
- **Markdown bodies rendered as escaped source.** Layouts used
  `{{content}}`, which HTML-escapes. They now use `{{!content}}`,
  so `content/*.md` bodies carry the page copy.
- **Client-side search crashed on the first keystroke.** The bundled
  `search.js` called `.filter` on the search index, which is an object with
  an `entries` array. It has been removed in favour of the generator's own
  search widget, which ships a proper dialog role, live-region result
  announcements and an integrity hash.
- **Light-mode colour tokens failed the advertised AAA level.** Muted text
  sat at 4.66–4.91:1 and borders at 1.48:1. Tokens are now gated by
  `scripts/contrast.py` at 7:1 for text and 3:1 for non-text, in both
  schemes.
- Contact forms posted to `action="#"`, discarding the submission. The
  endpoint now comes from the `form_action` front-matter field.

### Added

- Template inheritance and partials: one `base.html`, one `header.html`,
  one `footer.html`.
- `ssg.toml` per theme, so `llms.txt` and JSON-LD carry real values.
- `content/content.schema.toml` — front matter is validated at build time.
- `:focus-visible` rings, a global `prefers-reduced-motion` block, and
  44px minimum target sizes.
- Cascade layers, container queries and auto-fit grids; no horizontal
  scroll at 320px.
- Authored JSON-LD `@graph`, feed links, and a View Transitions hint.
- Screenshot and thumbnail at registry-required sizes; `theme.toml`
  manifest with `min_version`.

### Removed

- All third-party requests. Previously: jsDelivr, Google Fonts, Google Tag
  Manager, Cloudflare Insights and Microsoft Clarity.
- `_data/`, which the generator never read.

## [1.0.0] — 2026-08-08

Initial release.
