---
name: "Apex"
short_name: "AX"
title: "À propos — Apex"
description: "Comment Apex est structuré, ce qu'il vise et comment l'adapter à votre pratique."
keywords: "apex specifications, ssg theme architecture, wcag 2.2, design tokens"
author: "SSG Theme Suite"
date: "2026-08-11"
layout: "about"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
label_nav: "Principale"
label_menu: "Menu"
label_theme: "Thème sombre"
nav_label_home: "Accueil"
nav_label_projects: "Études de cas"
nav_label_frameworks: "Référentiels"
nav_label_about: "À propos"
nav_label_contact: "Contact"
slug_projects: "etudes-de-cas"
slug_frameworks: "referentiels"
slug_about: "a-propos"
slug_contact: "contact"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
news_publication_date: "2026-08-11"
nav_about: "true"
eyebrow: "À propos"
headline: "Comment Apex est construit"
lead: "L'architecture en bref, et les fichiers que vous modifierez réellement."
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
ui_case_studies: "Études de cas"
ui_frameworks: "Référentiels"
ui_specifications: "Spécifications"
ui_json_feed: "JSON Feed"
ui_built_with: "Construit avec"
ui_static_site_generator: "Static Site Generator"
ui_built_with_2: "Construit avec"
ui_made_with_ssg: "Réalisé avec SSG"
ui_wcag_2_2_aa: ". Conformité WCAG 2.2 AA vérifiée en intégration continue."
ui_language: "Langue"
locale_path: "/apex/fr/"
base_path: "/apex/"
en_current: ""
fr_current: ' aria-current="true"'
translation_key: "about"
---
## Template architecture

Layouts use StaticWeaver's inheritance and partials, both of which SSG has
supported for some time:

- `base.html` holds the document shell and declares a `main` block.
- Every page layout opens with `{{#extends "base"}}` and fills that block.
- `header.html` and `footer.html` are partials, included with `{{> header}}`.

Page copy lives in `content/*.md` and is injected with `{{!content}}` —
the unescaped form. The escaped `{{content}}` renders Markdown output as
visible source text, which is why earlier releases shipped empty bodies.

## Design tokens

Colour, type scale and spacing are custom properties in a single
`@layer tokens` block. Layers keep specificity flat, so a site can override
any component from its own stylesheet without `!important`.

Dark mode is defined three times on purpose: once on bare `:root` for the
light default, once inside `prefers-color-scheme: dark` guarded by
`:root:not([data-theme="light"])`, and once on `:root[data-theme="dark"]`.
That covers all three viewer states — explicit light, explicit dark, and
the unstamped "follow the system" default.

## Accessibility

| Criterion | Level | How it is met |
| --- | --- | --- |
| 1.4.3 / 1.4.6 Contrast | AA / AAA | Token pairs gated at 7:1 for text |
| 1.4.10 Reflow | AA | Auto-fit grids; no horizontal scroll at 320px |
| 1.4.11 Non-text contrast | AA | Borders and focus ring gated at 3:1 |
| 2.1.1 Keyboard | A | Every control is a real button or link |
| 2.4.5 Multiple ways | AA | Nav, footer map, search and sitemap |
| 2.4.7 / 2.4.13 Focus | AA / AAA | 3px `:focus-visible` ring with offset |
| 2.3.3 Animation | AAA | Global `prefers-reduced-motion` block |
| 2.5.8 Target size | AA | Controls are at least 44px |

## Browser support

Apex targets browsers supporting cascade layers, container queries and
`:focus-visible` — Chrome 111+, Firefox 128+, Safari 16.4+. Older browsers
get an unstyled but fully readable document, since layout uses flow and
grid rather than absolute positioning.
