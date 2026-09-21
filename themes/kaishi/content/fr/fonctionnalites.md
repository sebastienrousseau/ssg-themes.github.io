---
name: "Kaishi"
short_name: "KA"
title: "Fonctionnalités — Kaishi"
description: "Tout ce que contient le thème Kaishi, et ce qu'il laisse délibérément de côté."
keywords: "kaishi features, ssg theme features"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "features"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_features: "true"
eyebrow: "Fonctionnalités"
headline: "Ce qu'il y a dans la boîte"
lead: "Une liste courte, décrite honnêtement. Quand une capacité vient du générateur plutôt que du thème, c'est précisé."
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
translation_key: "features"
slug_about: "a-propos"
slug_contact: "contact"
slug_features: "fonctionnalites"
---
## From the theme

- Five page layouts sharing one `base.html` through template inheritance
- Header, footer and navigation as partials — one file to edit, not five
- A token-based colour system with light and dark palettes, both gated
- A navigation disclosure that works with keyboard and pointer
- A contact form that posts to an endpoint you configure
- `:focus-visible` rings and a global `prefers-reduced-motion` block

## From the generator

These arrive because you are using Static Site Generator, not because of
anything in the theme. The theme's job is to link and style them.

- Client-side search, injected as an accessible dialog with SRI on its script
- RSS, Atom and JSON Feed, generated from the same content
- `sitemap.xml`, `robots.txt` and a web app manifest
- A CycloneDX SBOM for the build
- `llms.txt` for agent discovery, populated from `ssg.toml`
- CSS and JS fingerprinting with Subresource Integrity hashes

## Deliberately absent

- No webfonts. The type stack resolves to fonts already on the device, so
  nothing reflows late and no third party sees your visitors' IP addresses.
- No icon font or icon library. The handful of icons are inline SVG.
- No carousel, no modal system, no animation library.
- No analytics. Add your own if you need it, and disclose it.
