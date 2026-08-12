---
name: "Velocity"
short_name: "VL"
title: "Features — Velocity"
description: "Everything included in the Velocity theme, and the things it deliberately leaves out."
keywords: "velocity features, ssg theme features"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "features"
language: "en-GB"
schema: "page"
changefreq: "monthly"
permalink: "https://ssg-themes.github.io/velocity/features/"
copyright_year: "2026"
form_origin: "https://example.com"
base_path: "/velocity/"
site_url: "https://ssg-themes.github.io/velocity/"
nav_features: "true"
eyebrow: "Features"
headline: "What is in the box"
lead: "A short list, honestly described. Where a capability comes from the generator rather than the theme, it says so."
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
