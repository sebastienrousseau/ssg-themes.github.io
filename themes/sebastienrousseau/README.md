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

- **Root-only.** Links and asset paths are absolute (`/about/index.html`, `/main.js`) as on the live site. Served under a sub-path, as the gallery demo is, the navigation points at the gallery root.
- **Gallery gates.** With the site tier wired into the gates (`tier = "site"`, `budget_kb` and `allowed_origins` in `theme.toml`, read by `validate.py` and `pageweight.py`), the theme passes `check-structure`, `check-weight`, `check-chrome` and `check-schema` (verified on 2026-10-06 with ssg 0.0.66). `check-audit` fails on this theme by design: `ssg audit` resolves the root-absolute internal links against the gallery root, where the theme is served under `/sebastienrousseau/`; that is the root-only limitation above, not a broken link on the live site. The Playwright suites (`check-responsive`, `check-aaa`, `check-pa11y`) and Lighthouse were not run against it here.
- **Locales.** The live site publishes 34 locales from generated translations. The samples ship English and French.
- **Tag pages.** The theme ships no `tera/` templates; the site builds with `--no-tag-pages` and generates its own topic and tag landings.

## Security

Inline scripts are allowed by SHA-256 hash only; the generator extracts inline styles and scripts into `/_csp/` with Subresource Integrity, and the edge header set (`_headers`) carries `frame-ancestors`. See the site's [security documentation](https://github.com/sebastienrousseau/sebastienrousseau.github.io/blob/main/project-docs/security.md).

## Licence

MIT, as the rest of this repository. The sample content is the site's own copy and stays © Sebastien Rousseau.
