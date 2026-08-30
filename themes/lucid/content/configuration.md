---
author: "SSG Theme Suite"
date: "2026-08-30"
language: "en"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
locale_path: "/lucid/"
base_path: "/lucid/"
en_current: " aria-current=\"true\""
fr_current: ""
slug_install: "installation"
slug_config: "configuration"
slug_a11y: "accessibility"
label_skip: "Skip to main content"
label_menu: "Menu"
label_nav: "Main"
label_langs: "Language"
label_theme: "Theme"
label_theme_system: "System"
label_docs: "Documentation"
label_footer_nav: "Documentation"
label_docs_nav: "Documentation sections"
label_crumbs: "Breadcrumb"
label_pager: "Page"
label_prev: "Previous"
label_next: "Next"
label_toc: "On this page"
nav_home: "Home"
nav_install: "Installation"
nav_config: "Configuration"
nav_a11y: "Accessibility"
name: "Lucid"
short_name: "LU"
footer_note: "A documentation theme for Static Site Generator, published under MIT or Apache-2.0."
copyright: "© 2026 SSG Theme Suite. Licensed under MIT or Apache-2.0."
screenshot_alt: "The Lucid documentation theme, showing side navigation, a reading column and an in-page contents list."
translation_key: "config"
title: "Configuration — Lucid"
description: "Configure navigation, locales and colour tokens in the Lucid documentation theme."
keywords: "configure lucid theme, ssg i18n, documentation navigation"
eyebrow: "Reference"
headline: "Configuration"
lead: "Every visible string in Lucid comes from front matter rather than from markup, which is what makes a new language a directory rather than a fork."
toc_1: "Front matter"
toc_1_id: "front-matter"
toc_2: "Adding a language"
toc_2_id: "adding-a-language"
toc_3: "Colour tokens"
toc_3_id: "colour-tokens"
cur_install: ""
cur_config: " aria-current=\"page\""
cur_a11y: ""
prev_href: "/lucid/installation/"
prev_label: "Installation"
next_href: "/lucid/accessibility/"
next_label: "Accessibility"
layout: "doc"
---

## Front matter

No layout in Lucid contains a hard-coded sentence. Navigation labels, button text, the breadcrumb name and even the word "Menu" are front-matter keys, so translating the theme never means editing HTML.

```yaml
nav_install: "Installation"
label_toc: "On this page"
label_prev: "Previous"
```

A page that omits a key renders it empty rather than falling back to English, which makes a missing translation visible instead of silently monolingual.

## Adding a language

Declare the locale in `ssg.toml`:

```toml
[i18n]
default_locale = "en"
locales = ["en", "fr", "de"]
url_prefix = "sub_path"
```

Then add `content/de/` with one file per page. Every page carries a `translation_key`, and pages sharing a key are treated as translations of each other, which is how `hreflang` alternates are emitted. The repository's own validation fails the build if a key does not resolve in every declared locale — a half-translated site is a build error, not a surprise for a reader.

The default locale is served from the root and every other locale from its own prefix, so `/`, `/fr/` and `/de/` are all real paths with real alternates.

## Colour tokens

Colour is declared once, as custom properties, and used nowhere else:

```css
--ink: #0d1117;        /* body text        */
--ink-soft: #232a35;   /* secondary text   */
--accent: #08417f;     /* links, buttons   */
--surface: #f4f6f9;    /* raised ground    */
```

Because every pair is verified in CI, changing a token to something that fails contrast fails the build. See [Accessibility](/lucid/accessibility/) for the exact thresholds.
