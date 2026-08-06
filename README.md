# Static Site Generator Themes (`ssg-themes.github.io`)

A monorepo and live showcase of production-ready, WCAG 2.1 AAA compliant, SEO-optimized static site generator themes compiled with **`ssg` (Shokunin)**.

Benchmarked against [sebastienrousseau.github.io](https://github.com/sebastienrousseau/sebastienrousseau.github.io) and hosted live at **[https://ssg-themes.github.io](https://ssg-themes.github.io)**.

---

## 📖 How to Use These Themes with `ssg` (Static Site Generator)

`ssg` compiles static websites by combining a **Content Directory** (`.md` files with YAML frontmatter) and a **Template/Layout Directory** (`.html` layouts, styles, and assets).

There are two primary ways to use any theme from this monorepo in your own site:

### Method 1: Using a Theme in a New Project (Recommended)

To start a new client site or personal portfolio using a theme (e.g. `portfolio`):

1. **Copy the theme files into your project repository:**
   ```bash
   # Create your project directory
   mkdir my-client-site && cd my-client-site

   # Copy layouts, data, and sample content from ssg-themes
   cp -R /path/to/ssg-themes.github.io/themes/portfolio/_layouts ./_layouts
   cp -R /path/to/ssg-themes.github.io/themes/portfolio/_data ./_data
   cp -R /path/to/ssg-themes.github.io/themes/portfolio/content ./_posts
   ```

2. **Add your content in Markdown (`_posts/*.md`):**
   Create or edit Markdown files in `_posts/` with YAML frontmatter specifying `layout` and meta fields.

3. **Build your site using `ssg`:**
   ```bash
   ssg build -c=_posts -t=_layouts -o=public
   ```
   *Your compiled, minified static website will be emitted into `public/`.*

---

### Method 2: Pointing `ssg` Directly to Theme Layouts

If you keep content in your project repo and reference themes directly from this monorepo:

```bash
ssg build \
  -c=./my-content \
  -t=/path/to/ssg-themes.github.io/themes/portfolio/_layouts \
  -o=./public
```

---

## 🎨 Themes Available

| Theme Name | Directory | Target Use Case | Key Features |
| :--- | :--- | :--- | :--- |
| **`portfolio`** | [`themes/portfolio`](themes/portfolio/) | Executive Portfolios & Leadership | ROI Metrics Dashboard, 2026 Recruiter Matrix, Case Studies, Dark/Light Mode |
| **`sebastienrousseau`** | [`themes/sebastienrousseau`](themes/sebastienrousseau/) | Editorial & Knowledge Hubs | Newsreader Serif Typography, Research Papers, ISO 20022/AI Articles, CSP/SRI |
| **`kaishi`** | [`themes/kaishi`](themes/kaishi/) | Starters & Product Landings | Lightweight footprint, Feature Grids, Modern Contact & Thank-You Forms |

---

## ⚙️ Monorepo Directory Structure

```
ssg-themes.github.io/
├── Makefile               # Build tasks for all themes
├── README.md              # Documentation & usage guide
├── scripts/
│   ├── build.sh           # Universal theme compiler script
│   └── validate.py        # Automated theme validator
├── themes/
│   ├── portfolio/         # Executive Portfolio Theme
│   │   ├── theme.json     # Theme manifest
│   │   ├── _data/         # Site metadata & navigation
│   │   ├── _layouts/      # HTML layouts, JS, and CSS
│   │   └── content/       # Sample Markdown files
│   ├── sebastienrousseau/ # Editorial & Knowledge Hub Theme
│   └── kaishi/            # Starter & Product Theme
└── public/                # GitHub Pages build output
    ├── index.html         # Live SSG Theme Gallery Hub
    ├── portfolio/         # Live Demo: Portfolio Theme
    ├── sebastienrousseau/ # Live Demo: Sebastien Rousseau Theme
    └── kaishi/            # Live Demo: Kaishi Theme
```

---

## 🛠️ CLI Quick Reference (`ssg` Commands)

### Build all themes in the monorepo:
```bash
make build-all
# or
./scripts/build.sh all
```

### Build a specific theme:
```bash
make build-portfolio
# or
./scripts/build.sh portfolio
```

### Run local dev server with Live Reload:
```bash
ssg dev -c=themes/portfolio/content -t=themes/portfolio/_layouts
```

### Validate theme schemas and manifests:
```bash
make check
```

---

## ✍️ YAML Frontmatter Specification

When authoring pages for any theme, include standard frontmatter fields:

```yaml
---
name: "Client Name"
short_name: "CN"
title: "Page Title | Client Name"
description: "SEO meta description for search engines."
keywords: "Keyword 1, Keyword 2, Keyword 3"
author: "Author Name"
date: "2026-08-05"
language: "en-GB"
layout: "index" # Mapped to _layouts/index.html (or page, project, frameworks, about, contact)
permalink: "https://example.com/"
---
```

---

## 🚀 Creating a New Theme in the Monorepo

To create a new theme package (e.g. `themes/agency`):

1. **Create directory:** `mkdir -p themes/agency/{_layouts,_data,content}`
2. **Add manifest:** Create `themes/agency/theme.json` with theme metadata.
3. **Add layouts:** Place `index.html`, `page.html`, `styles.css`, and layout files in `themes/agency/_layouts/`.
4. **Add content:** Add starter `.md` files in `themes/agency/content/`.
5. **Validate & Build:** Run `make check` and `make build-all`.
