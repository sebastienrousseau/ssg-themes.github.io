# Sebastienrousseau

The production theme of <https://sebastienrousseau.com>: a research-publishing site on applied AI, ISO 20022 payments and post-quantum cryptography, published in 34 languages. Twelve editorial layouts share one shell with a hash-strict Content Security Policy, per-page JSON-LD graphs, a light and dark token system, a service worker and an on-site search runtime.

- **Demo:** <https://themes.static-site-generator.com/sebastienrousseau/>
- **Licence:** MIT
- **Requires:** ssg 0.0.66+
- **Tier:** site theme. This is the theme of one live site, carrying that site's chrome, origins and page budget. It is published here so the site builds from a theme instead of twelve hand-maintained 213 KB files, and so the gallery has a worked example of a real 34-locale publication.

## Where it comes from

The site generated its layouts from one `index.html` by slicing the shell and injecting a hero, a main region and a JSON-LD block per layout. This theme is that decomposition made explicit:

| File | Role |
| --- | --- |
| `_layouts/base.html` | The shell: head, CSP meta, font preload, `{{> header}}`, `{{#block "main"}}`, `{{> footer}}`, `{{#block "schema"}}`, `main.js` |
| `_layouts/header.html` | Primary navigation with submenus, language switcher hook, theme toggle |
| `_layouts/footer.html` | Four-column footer with social links |
| `_layouts/styles.css` | The whole stylesheet (184 KB). `styles.html` is a symlink to it because `{{> styles}}` resolves `.html` names only |
| `_layouts/<layout>.html` | One file per layout, each `{{#extends "base"}}` and fills `main`, optionally `styles`, `schema`, `head_extra` and `font_preload` |
| `_layouts/main.js`, `theme-init.js`, `search.js`, `search.css`, `sw.js` | Runtime, copied verbatim |

Layouts: `index`, `about`, `articles`, `contact`, `link`, `page`, `papers`, `playlist`, `project`, `report` (dated articles), `story`, `thank-you`.

## Fidelity gate

`tools/extract_from_site.py` imports the site's `_layouts/` into this shape, and `tools/flatten.py` produces flat layouts again:

```bash
python3 themes/sebastienrousseau/tools/flatten.py themes/sebastienrousseau/_layouts /tmp/flat
diff -r /tmp/flat /path/to/sebastienrousseau.github.io/_layouts   # empty
```

The diff is 24 lines, all of them `{{!content}}` for `{{content}}` (the raw form this gallery mandates; identical output on staticdatagen 0.0.21 and later). Compiling the same content through the theme and through the flat layouts with `ssg --no-tag-pages -c -t -o` produces identical HTML (verified on 14 pages with ssg 0.0.66; only the news sitemap timestamp and the stylesheet file name differ), and a full build of the live site from the flattened layouts matched the baseline build page for page.

## Build

```bash
ssg build -f themes/sebastienrousseau/ssg.toml
```

The site itself does not consume the theme through `ssg build -f`. Its postbuild reads the flat layouts directly (CSP meta, `theme-init.js`, the design-token freeze test), so it runs `tools/flatten.py` and compiles the flattened `_layouts/` with the legacy `-c -t -o` form. Both routes render the same pages.

## Front matter

Every layout placeholder is a flat front-matter key; the engine aborts on an unresolved one. The sample pages under `content/` carry the full set the live site uses. The keys the shell cannot do without are declared in `content/content.schema.toml`: `title`, `description`, `layout`, `permalink`, `date`, `language`, `image`, `translation_key`.

Replace these before deploying: `cdn` (image CDN root), `form-id` and `recaptcha` on the contact page, `measurementID`, `permalink` and `id` on every page.

## Known limits

- **Root-only.** Links and asset paths are absolute (`/about/index.html`, `/main.js`) as on the live site, and the templates carry no `{{base_path}}` because they must stay byte-identical to the site's. The gallery build re-bases them onto `/sebastienrousseau/` after the fact (`scripts/rebase_links.py`, attribute values only, so inline-script hashes and `integrity` attributes stay valid), which is why the demo navigates under a sub-path. What that pass does not reach is the JavaScript: the service-worker registration, the search loader and the fingerprint loader still address `/sw.js`, `/search-ui.json` and `/main.<hash>.js` at the host root, so a copy of the theme belongs at the root of its own host.
- **Demo content.** The sample pages are the live site's own. The pages its header and footer link to (speaking, trust, topics, case studies, the ISO 20022 MCP suite pages, the legal and accessibility pages) ship as samples in both locales; article cards for stories the demo does not carry link to the article on the live site; and the 33 locales the demo does not ship each get a landing page that says so and links to the live edition. The `#catalog` anchor the project layout targets is written into the suite's sample page by hand, where the live site generates it.
- **Gallery gates.** With the site tier wired into the gates (`tier = "site"`, `budget_kb` and `allowed_origins` in `theme.toml`, read by `validate.py` and `pageweight.py`), the theme passes every gate the gallery runs: `check-structure`, `check-weight`, `check-chrome`, `check-schema`, `check-audit` (every `ssg audit` gate on the full 23-theme build), the four Playwright responsive suites (layout across 13 viewports and 2 schemes, keyboard and zoom, semantics and print, axe WCAG 2.2 AA plus the AAA rules), the AAA suites (modes, rendered contrast and 44 px targets, reflow, composition, focus, gradient) and the linkinator crawl, verified on 2026-10-07 with ssg 0.0.66. Meeting them changed the design in ways the live site adopts through the theme: the colour-scheme control is the gallery's three-state `#mode-toggle` (system, light, dark, persisted; "system" is no `data-theme` attribute, so the stylesheet follows the OS); every navigation, footer, card, chip, breadcrumb and credential link is a 44 px target; prose links are inline-block so a link never wraps across two lines; card and featured media frames are 3:2; the story hero becomes a natural-aspect banner below 1024 px; titles and excerpts are no longer line-clamped; the rotating hero title fits 320 px; closed `details` content is hidden with `visibility`; decorative clipping uses `overflow: clip`; table headers are 12 px or larger; Spotify players load on request from a link that works without JavaScript; code blocks wrap instead of scrolling sideways; and dark mode gives the pills dark ink on the light-blue accent.
- **Locales.** The live site publishes 34 locales from generated translations. The samples ship English and French; the other 32 locale roots are landing pages, not translations.
- **Tag pages.** The theme ships no `tera/` templates; the site builds with `--no-tag-pages` and generates its own topic and tag landings, and `ssg.toml` sets `no_taxonomy_pages = true` so the demo does the same (the generator's own per-term listings are standalone pages outside the theme's shell).

## Security

Inline scripts are allowed by SHA-256 hash only; the generator extracts inline styles and scripts into `/_csp/` with Subresource Integrity, and the edge header set (`_headers`) carries `frame-ancestors`. See the site's [security documentation](https://github.com/sebastienrousseau/sebastienrousseau.github.io/blob/main/project-docs/security.md).

## Licence

MIT, as the rest of this repository. The sample content is the site's own copy and stays © Sebastien Rousseau.
