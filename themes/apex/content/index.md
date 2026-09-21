---
name: "Apex"
short_name: "AX"
title: "Apex — executive portfolio theme for SSG"
description: "A production-ready portfolio theme for Static Site Generator: WCAG 2.2 AA verified in CI, zero third-party requests, and a token system you can re-skin without touching a layout."
keywords: "apex, ssg theme, static site generator, portfolio theme, accessible theme"
author: "SSG Theme Suite"
date: "2026-08-11"
layout: "index"
language: "en-GB"
lang_code: "EN"
lang_change: "Change language"
label_nav: "Primary"
label_menu: "Menu"
label_theme: "Dark theme"
nav_label_home: "Home"
nav_label_projects: "Case studies"
nav_label_frameworks: "Frameworks"
nav_label_about: "About"
nav_label_contact: "Contact"
slug_projects: "projects"
slug_frameworks: "frameworks"
slug_about: "about"
slug_contact: "contact"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
news_publication_date: "2026-08-11"
nav_home: "true"
hero_alt: "A laptop on a wooden desk showing a report, with hands resting on the keyboard."
eyebrow: "Executive portfolio"
headline: "A portfolio theme that earns its accessibility claim"
lead: "Apex is built for consultants, directors and advisors who need a fast, credible site without a build toolchain. Every accessibility and performance claim it makes is checked by a gate in CI."
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
ui_case_studies: "Case studies"
ui_frameworks: "Frameworks"
ui_specifications: "Specifications"
ui_json_feed: "JSON Feed"
ui_built_with: "Built with"
ui_static_site_generator: "Static Site Generator"
ui_built_with_2: "Built with"
ui_made_with_ssg: "Made with SSG"
ui_wcag_2_2_aa: ". WCAG 2.2 AA verified in CI."
ui_language: "Language"
locale_path: "/apex/"
base_path: "/apex/"
en_current: ' aria-current="true"'
fr_current: ""
ape_view_case_studies: "View case studies"
ape_download_zip: "Download .zip"
ape_download_tar_gz: "Download .tar.gz"
ape_measured_not_asserted: "Measured, not asserted"
ape_every_figure_below_is: "Every figure below is produced by a CI gate on each commit. Nothing here is a static badge."
ape_wcag_2_2_conformance: "WCAG 2.2 conformance"
ape_verified_by_axe_core: "Verified by axe-core and"
ape_third_party_requests: "Third-party requests"
ape_no_cdn_no_webfont: "No CDN, no webfont host, no analytics. Everything ships from your own origin."
ape_lt_7_nbsp_kb: "&lt;7&nbsp;KB"
ape_heaviest_page_compressed: "Heaviest page, compressed"
ape_html_plus_the_fingerprinted: "HTML plus the fingerprinted CSS and JS it references. Enforced at 20&nbsp;KB by"
ape_cumulative_layout_shift: "Cumulative layout shift"
ape_every_image_carries_intrinsic: "Every image carries intrinsic dimensions; no late-loading webfont reflows the page."
ape_about_this_theme: "About this theme"
translation_key: "home"
---

## What you get

Apex ships five page types — home, case studies, frameworks, about and
contact — sharing a single `base.html` through template inheritance. The
header, footer and navigation live in partials, so changing a menu item is
a one-line edit in one file rather than a find-and-replace across layouts.

The colour system is defined once as custom properties and re-checked on
every commit by `scripts/contrast.py`. Text pairs clear WCAG 1.4.6 at
7:1 — the AAA threshold — and borders and the focus ring clear 1.4.11 at
3:1. Change a token and the gate tells you if you have broken something.

## What it deliberately does not do

There is no CDN, no webfont host, no analytics snippet and no cookie
banner, because there is nothing to consent to. The type stack resolves to
fonts already on the device, which is why there is no layout shift when a
webfont arrives late — none arrives at all.

Search is provided by SSG itself. The generator injects an accessible
search widget with a proper dialog role, live-region result announcements
and a Subresource Integrity hash on its script; the theme only re-skins it
to match your palette.

## Making it yours

Start with `_layouts/styles.css`. The `@layer tokens` block at the top is
the whole design system: change `--accent`, run `make check`, and the
contrast gate confirms the new value still passes before you ship it.
