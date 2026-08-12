# SSG Themes

Three production themes for [Static Site Generator (SSG)](https://github.com/sebastienrousseau/static-site-generator), each with its own design system, all sharing the same architecture and the same set of CI gates.

[![Build and gates](https://github.com/sebastienrousseau/ssg-themes.github.io/actions/workflows/build.yml/badge.svg)](https://github.com/sebastienrousseau/ssg-themes.github.io/actions/workflows/build.yml)
[![Licence: MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)

| Theme | For | Look |
| :-- | :-- | :-- |
| **[Apex](themes/apex/)** | Portfolios, consulting, advisory | Cool neutrals, deep blue, interface sans |
| **[Atlas](themes/atlas/)** | Long-form writing, research, reference | Warm-neutral ground, forest green, serif reading column |
| **[Velocity](themes/velocity/)** | Product landing pages, starters | Slate and bronze, tight radii, smallest layout set |

---

## Quick start

```bash
# Copy a theme into your project
cp -R themes/apex my-site
cd my-site

# Set your own site name and base URL
$EDITOR ssg.toml

# Build
ssg build -f ssg.toml
```

Requires **ssg 0.0.49 or later**. On earlier versions the layout named in
front matter is never resolved and every page renders through `page.html`.

Each theme's own README documents its layouts, front-matter contract and
token system: [Apex](themes/apex/README.md) ·
[Atlas](themes/atlas/README.md) · [Velocity](themes/velocity/README.md).

---

## What is actually verified

Every claim below is produced by a gate that runs on each commit. There are
no hardcoded score badges in this repository.

| Gate | What it asserts | Command |
| :-- | :-- | :-- |
| Structure | Manifests, required layouts, screenshots at registry sizes, no third-party host or tracker reference, every layout extends `base.html`, `{{!content}}` never regresses to `{{content}}` | `scripts/validate.py` |
| Contrast | Text token pairs ≥ 7:1 (WCAG 1.4.6, AAA); borders and focus ring ≥ 3:1 (WCAG 1.4.11) — in **both** light and dark | `scripts/contrast.py` |
| Page weight | Every page ≤ 20 KB gzipped including its CSS and JS; zero third-party subresources | `scripts/pageweight.py` |
| Accessibility | `accessibility-report.json` reports 0 issues; axe-core passes `wcag22aa` | `ssg build`, axe-core |
| Generator audit | JSON-LD, hreflang, CSP/SRI, HTML5, broken links, Open Graph, feeds, search index | `ssg audit` |

Run them all locally:

```bash
make check
```

**Measured, as of the current build:** 102 token pairs pass contrast, 16
pages pass the weight budget with the heaviest at 6.9 KB gzipped, 0
accessibility issues across 15 pages, and 0 third-party subresources.

### What is *not* claimed

- **Not AAA overall.** The colour tokens clear AAA contrast, and that is
  gated. Full AAA conformance requires manual criteria (sign-language
  alternatives, extended audio description, context-sensitive help) that no
  theme can satisfy on its own. The themes target **WCAG 2.2 AA**.
- **Not "sub-10 ms".** A three-theme build takes roughly 80–90 ms of
  generator time each on a warm cache. It is fast; the old figure was wrong
  by about an order of magnitude.
- **No Lighthouse score badge.** Lighthouse runs in CI and its report is
  uploaded as an artifact, but a score depends on the host and network, so
  it is not asserted as a fixed number.

---

## Architecture

All three themes share one structure:

```
themes/<name>/
├── ssg.toml                  site name, description, base URL, paths
├── theme.toml / theme.json   manifest (registry format + JSON mirror)
├── README.md, CHANGELOG.md
├── images/
│   ├── screenshot.png        1500×1000
│   └── tn.png                900×600
├── content/
│   ├── content.schema.toml   typed front-matter contract
│   └── *.md                  page copy
└── _layouts/
    ├── base.html             document shell; declares the `main` block
    ├── header.html           navigation partial
    ├── footer.html           footer partial
    ├── <layout>.html         {{#extends "base"}} + {{#block "main"}}
    ├── styles.css            the whole design system
    └── main.js, theme-init.js
```

Layouts use StaticWeaver's inheritance (`{{#extends}}` / `{{#block}}`),
partials (`{{> header}}`) and conditionals (`{{#if}}`), so the document
shell exists once per theme rather than once per layout.

Two constraints are worth knowing before you edit a layout:

- **An unresolved `{{tag}}` is a hard build error**, not an empty string.
  Guard optional fields with `{{#if field}}…{{/if}}`.
- **`{{#each}}` cannot iterate front-matter arrays.** The generator
  stringifies metadata before the template engine sees it, so index pages
  list entries in Markdown rather than looping.

---

## Development

```bash
make build              # build all themes into public/
make build-apex         # or a single theme
make check              # structure + contrast + build + weight
make clean
ssg dev -f themes/apex/ssg.toml   # live preview
```

---

## Licence

MIT — see [LICENSE](LICENSE). The same licence applies to every theme; each
`theme.toml` and `theme.json` states it, and the structure gate fails if
they disagree.
