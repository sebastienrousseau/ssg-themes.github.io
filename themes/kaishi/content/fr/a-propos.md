---
name: "Kaishi"
short_name: "KA"
title: "À propos — Kaishi"
description: "Comment Kaishi est structuré, ce qu'il vise et comment le personnaliser."
keywords: "kaishi about, theme architecture, customisation"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "about"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_about: "true"
eyebrow: "À propos"
headline: "Comment Kaishi est construit"
lead: "L'architecture en bref, et le fichier que vous modifierez réellement."
label_theme: "Thème"
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
ui_features: "Fonctionnalités"
ui_primary: "Principale"
ui_features_2: "Fonctionnalités"
ui_json_feed: "JSON Feed"
ui_built_with: "Construit avec"
ui_static_site_generator: "Static Site Generator"
ui_built_with_2: "Construit avec"
ui_made_with_ssg: "Réalisé avec SSG"
ui_wcag_2_2_aa: ". Conformité WCAG 2.2 AA vérifiée en intégration continue."
ui_language: "Langue"
locale_path: "/kaishi/fr/"
base_path: "/kaishi/"
en_current: ""
fr_current: ' aria-current="true"'
translation_key: "about"
slug_about: "a-propos"
slug_contact: "contact"
slug_features: "fonctionnalites"
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
