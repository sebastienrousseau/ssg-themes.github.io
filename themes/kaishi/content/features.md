---
name: "Kaishi"
short_name: "KA"
title: "Features — Kaishi"
description: "Everything included in the Kaishi theme, and the things it deliberately leaves out."
keywords: "kaishi features, ssg theme features"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "features"
language: "en-GB"
lang_code: "EN"
lang_change: "Change language"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_features: "true"
eyebrow: "Features"
headline: "What is in the box"
lead: "A short list, honestly described. Where a capability comes from the generator rather than the theme, it says so."
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
translation_key: "features"
slug_about: "about"
slug_contact: "contact"
slug_features: "features"
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
