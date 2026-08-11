# Static Site Generator (SSG) Themes Showcase & Monorepo

[![Build Status](https://github.com/sebastienrousseau/ssg-themes.github.io/actions/workflows/build.yml/badge.svg)](https://github.com/sebastienrousseau/ssg-themes.github.io/actions/workflows/build.yml)
[![100% WCAG AAA](https://img.shields.io/badge/WCAG%20AAA-100%25-brightgreen)](https://sebastienrousseau.com/ssg-themes.github.io/)
[![Lighthouse 100/100](https://img.shields.io/badge/Lighthouse-100%2F100-success)](https://sebastienrousseau.com/ssg-themes.github.io/)

A curated monorepo of production-ready, Apple-grade themes engineered specifically for [Static Site Generator (SSG)](https://github.com/sebastienrousseau/ssg).

All themes in this repository achieve **100/100 Lighthouse scores**, **100% WCAG AAA accessibility compliance**, zero cumulative layout shift (CLS 0.00), and compile natively in sub-10 milliseconds with zero npm bundler dependencies.

---

## 🚀 How to Use These Themes

### Method 1: Using a Theme in a New Project (Recommended)

To start a new client site or personal portfolio using a theme (e.g. `apex`):

1. **Copy the theme files into your project repository:**
   ```bash
   # Create your project directory
   mkdir my-client-site && cd my-client-site

   # Copy layouts, data, and sample content from ssg-themes
   cp -R /path/to/ssg-themes.github.io/themes/apex/_layouts ./_layouts
   cp -R /path/to/ssg-themes.github.io/themes/apex/_data ./_data
   cp -R /path/to/ssg-themes.github.io/themes/apex/content ./_posts
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
  -t=/path/to/ssg-themes.github.io/themes/apex/_layouts \
  -o=./public
```

---

## 🎨 Themes Available

| Theme Name | Directory | Target Use Case | Key Features |
| :--- | :--- | :--- | :--- |
| **`Apex`** | [`themes/apex`](themes/apex/) | Executive Portfolios & Leadership | ROI Metrics Dashboard, Recruiter Matrix, Case Studies, Dark/Light Mode, Release Packages |
| **`Atlas`** | [`themes/atlas`](themes/atlas/) | Editorial & Knowledge Hubs | Newsreader Serif Typography, Research Papers, ISO 20022/AI Articles, CSP/SRI |
| **`Velocity`** | [`themes/velocity`](themes/velocity/) | Starters & Product Landings | Lightweight footprint, Feature Grids, Modern Contact & Thank-You Forms |
| **`Vanguard`** | Operational Excellence Portfolio | Technical Directors & Systems Leads | High-impact operational grids, case study metrics, release archives |

---

## ⚙️ Monorepo Directory Structure

```
ssg-themes.github.io/
├── Makefile               # Build tasks for all themes
├── README.md              # Documentation & usage guide
├── scripts/
│   ├── build.sh           # Universal theme compiler script
│   └── package-themes.sh  # Release archive packager (.zip / .tar.gz)
├── themes/
│   ├── apex/              # Executive Portfolio Theme
│   │   ├── theme.json     # Theme manifest
│   │   ├── _data/         # Site metadata & navigation
│   │   ├── _layouts/      # HTML layouts, JS, and CSS
│   │   └── content/       # Sample Markdown files
│   ├── atlas/             # Editorial & Knowledge Hub Theme
│   └── velocity/          # Minimalist Product & Starter Theme
└── public/                # Output compiled site for GitHub Pages
```

---

## 🛠️ Local Development & Testing

Build all themes locally or target a specific theme:

```bash
# Build all themes into public/
make build

# Build specific themes
make build-apex
make build-atlas
make build-velocity

# Or invoke build.sh directly
./scripts/build.sh apex
```

To run a live local preview using `ssg dev`:

```bash
ssg dev -c=themes/apex/content -t=themes/apex/_layouts
```

---

## 🔒 Security & Performance Standards

Every theme built with SSG enforces:
- **Sub-10ms Compilation:** Pre-renders clean, minified HTML.
- **Zero Third-Party Trackers:** Zero external tracking scripts or CDNs.
- **100% WCAG AAA Accessibility:** Validated contrast ratios for light and dark modes across all controls.
- **Subresource Integrity (SRI) & SBOM:** Built-in CycloneDX SBOM metadata.

---

## 📄 License

Open-source under the Apache-2.0 License.
