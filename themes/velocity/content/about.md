---
name: "Velocity"
short_name: "VL"
title: "About — Velocity"
description: "How Velocity is structured, what it targets, and how to customise it."
keywords: "velocity about, theme architecture, customisation"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "about"
language: "en-GB"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_about: "true"
eyebrow: "About"
headline: "How Velocity is built"
lead: "The architecture in brief, and the two files you will actually edit."
---

## Structure

```
themes/velocity/
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
