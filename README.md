# Static Site Generator Themes (`ssg-themes.github.io`)

A monorepo and live theme showcase site for building, testing, and demoing high-performance, WCAG AAA accessible, SEO-optimized static site generator themes.

Benchmarked against [sebastienrousseau.github.io](https://github.com/sebastienrousseau/sebastienrousseau.github.io) and compiled with `ssg` (Static Site Generator).

---

## Monorepo Architecture

```
ssg-themes.github.io/
├── Makefile               # Universal build & validation tasks
├── scripts/
│   ├── build.sh           # Theme compiler wrapper for `ssg`
│   └── validate.py        # Theme structure & manifest validator
├── themes/
│   └── portfolio/         # Theme 1: Executive Portfolio & Leadership Theme
│       ├── README.md      # Theme usage & frontmatter specification
│       ├── theme.json     # Theme metadata manifest
│       ├── _data/         # Default site configuration & navigation
│       ├── _layouts/      # SSG HTML templates & core assets
│       ├── content/       # Content-first Markdown templates (.md)
│       └── assets/        # CSS design tokens, images, and fonts
└── public/                # Live GitHub Pages build output with theme demos
    ├── index.html         # Live SSG Theme Gallery & Showcase Hub
    └── portfolio/         # Live Demo: Executive Portfolio Theme
```

---

## Themes Showcase & Demos

### 1. `portfolio` (Executive Portfolio Theme)
- **Live Demo:** [https://ssg-themes.github.io/portfolio/](https://ssg-themes.github.io/portfolio/)
- **Use Case:** Executive portfolios, PMO directors, C-suite advisors, management consultants.
- **Features:** ROI metrics dashboard, 2026 Recruiter Assessment Matrix, case study layouts, framework playbooks, dark/light theme toggle.
- **Language & Accessibility:** 100% British English (`en-GB`), WCAG 2.1 AAA contrast compliance.

---

## How to Build Themes

### Build the `portfolio` theme:
```bash
make build-portfolio
```
Or directly using the build script:
```bash
./scripts/build.sh portfolio
```

### Run dev server with Watch & HMR:
```bash
make dev-portfolio
```

### Validate all themes in the monorepo:
```bash
make check
```

---

## Creating a New Theme

To add a new theme (e.g. `agency`, `blog`, `saas`):

1. Create a new directory under `themes/<theme-name>/`.
2. Add `theme.json` with theme metadata.
3. Create `_layouts/` containing `index.html`, `page.html`, and `styles.css`.
4. Add sample Markdown pages under `content/`.
5. Run `python3 scripts/validate.py` to ensure validation passes.
