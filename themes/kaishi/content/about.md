---
name: "Kaishi"
short_name: "KA"
title: "About — Kaishi"
description: "How Kaishi is structured, what it targets, and how to customise it."
keywords: "kaishi about, theme architecture, customisation"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "about"
language: "en-GB"
lang_code: "EN"
lang_change: "Change language"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_about: "true"
eyebrow: "About"
headline: "How Kaishi is built"
lead: "The architecture in brief, and the two files you will actually edit."
label_theme: "Theme"
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
ui_features: "Features"
ui_primary: "Primary"
ui_features_2: "Features"
ui_json_feed: "JSON Feed"
ui_built_with: "Built with"
ui_static_site_generator: "Static Site Generator"
ui_built_with_2: "Built with"
ui_made_with_ssg: "Made with SSG"
ui_wcag_2_2_aa: ". WCAG 2.2 AA verified in CI."
ui_language: "Language"
locale_path: "/kaishi/"
base_path: "/kaishi/"
en_current: ' aria-current="true"'
fr_current: ""
translation_key: "about"
slug_about: "about"
slug_contact: "contact"
slug_features: "features"
---

## Structure

```
themes/kaishi/
├── ssg.toml            site name, description, base URL
├── content/            page copy as Markdown
└── _layouts/
    ├── base.html       document shell, declares the `main` block
    ├── header.html     navigation partial
    ├── footer.html     footer partial
    ├── index.html      each page layout extends base
    └── styles.css      the entire design system
```

## The two files you will edit

`ssg.toml` carries the site name, description and base URL. Getting this
wrong is how a site ends up publishing an `llms.txt` that reads
"MySsgSite" and JSON-LD pointing at `127.0.0.1`.

`_layouts/styles.css` opens with a `@layer tokens` block holding every
colour, type step and spacing value. Change `--accent` there and the whole
theme follows.

## Verifying a change

Run `make check` from the repository root. It parses the token blocks and
asserts every declared pair against its WCAG target — 7:1 for text, 3:1 for
borders and the focus ring — in both light and dark. A failing token is a
failing build, not a warning.

## Browser targets

Cascade layers, container queries and `:focus-visible`: Chrome 111+,
Firefox 128+, Safari 16.4+. Older browsers receive readable unstyled
content rather than a broken layout.
