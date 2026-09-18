---
name: "Kaishi"
short_name: "KA"
title: "Kaishi — Apple-inspired starter theme for SSG"
description: "Apple-inspired starter theme: translucent sticky header, pill controls and a soft card geometry, on a colour system gated at WCAG AAA."
keywords: "kaishi, ssg theme, starter theme, apple design, accessible theme"
author: "SSG Theme Suite"
date: "2026-09-01"
news_publication_date: "2026-09-01"
layout: "index"
language: "en-GB"
release_alt: "Bright yellow modular lockers arranged as a precise release wall"
lang_code: "EN"
lang_change: "Change language"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_home: "true"
eyebrow: "Starter theme"
headline: "A clean start, accessible from the first commit"
lead: "Kaishi is a starter theme that borrows Apple's restraint — a translucent sticky header, pill controls, generous type — and holds every colour pair to WCAG AAA rather than AA."
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
kai_see_what_is_included: "See what is included"
kai_download_zip: "Download .zip"
kai_download_tar_gz: "Download .tar.gz"
kai_built_for_shipping_quickly: "Built for shipping quickly"
kai_no_build_toolchain: "No build toolchain"
kai_no_npm_install_no: "No npm install, no bundler, no lockfile. Edit Markdown, run one binary, deploy the folder."
kai_nothing_phones_home: "Nothing phones home"
kai_no_cdn_webfont_host: "No CDN, webfont host, analytics or tag manager. There is nothing to disclose in a cookie banner."
kai_accessible_by_default: "Accessible by default"
kai_colour_tokens_are_gated: "Colour tokens are gated at AAA for text; keyboard paths and focus states are checked in CI."
kai_search_included: "Search included"
kai_the_generator_injects_an: "The generator injects an accessible search dialog with a live-region result count. The theme skins it."
kai_feeds_included: "Feeds included"
kai_rss_atom_and_json: "RSS, Atom and JSON Feed are generated from the same content and linked in the document head."
kai_one_file_to_re: "One file to re-skin"
kai_the_whole_palette_is: "The whole palette is a token block at the top of"
translation_key: "home"
slug_about: "about"
slug_contact: "contact"
slug_features: "features"
---

## Who this is for

Kaishi suits a first site: a personal page, a small product, or the public
face of an open-source project. It gives you Apple's visual restraint
without the research, and an accessibility floor you cannot accidentally
fall through.

If you need a case-study portfolio, use Apex. For long-form writing or
research, use Atlas. For documentation, use Lucid.

## What makes it Kaishi

The look rests on three details, all of them tokens rather than markup:

- **A translucent header.** The masthead blurs the page behind it, but only
  where `backdrop-filter` is supported. Everywhere else it stays opaque, so
  the contrast pair the gate verifies is the pair that ships.
- **Pill controls.** Buttons use a 980px radius rather than `50%`, so a wide
  button keeps semicircular ends instead of turning into an ellipse.
- **Soft cards.** A 24px corner and a barely-there shadow, rather than a
  border doing all the work.

## Accessibility

Every colour pair in this theme is checked at **AAA (7:1)** for text by
`scripts/contrast.py` in CI — not AA, and not by eye. Dark mode is checked
as its own palette, which is where themes usually fail: a muted grey that
reads well on white is often invisible on black.

## What "no build step" means

There is no `package.json`. The stylesheet is hand-authored CSS using
cascade layers and custom properties, which every target browser supports
natively. The two JavaScript files total under 4 KB and are plain ES5 —
no transpiler, no polyfill, no module graph.

To work on the theme you run the generator and refresh. That is the whole
loop.

## Extending it

Adding a page is two files: a Markdown file in `content/` and a layout in
`_layouts/` that opens with `{{#extends "base"}}`. The header, footer and
document shell come along automatically, so a new page starts at about
eight lines.
