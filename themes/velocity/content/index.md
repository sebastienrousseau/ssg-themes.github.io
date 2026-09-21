---
name: "Velocity"
short_name: "VL"
title: "Velocity — product and starter theme for SSG"
description: "A lightweight landing-page and documentation starter for Static Site Generator. No bundler, no third-party requests, and a colour system gated at AAA for text."
keywords: "velocity, ssg theme, starter theme, landing page, static site generator"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "index"
language: "en-GB"
horizon_alt: "Layered mountain horizon at sunrise suggesting speed and forward motion"
lang_code: "EN"
lang_change: "Change language"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_home: "true"
eyebrow: "Starter theme"
headline: "Ship a product site this afternoon"
lead: "Velocity is the smallest useful Static Site Generator theme: five pages, one stylesheet, no build step and nothing loaded from anyone else’s server."
label_theme: "Theme"
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
locale_path: "/velocity/"
base_path: "/velocity/"
en_current: ' aria-current="true"'
fr_current: ""
label_nav: "Primary"
label_menu: "Menu"
label_langs: "Language"
label_product: "Product"
label_company: "Company"
label_feeds: "Feeds"
label_built_with: "Built with"
label_sitemap: "Sitemap"
label_licence: "Released under the MIT licence."
label_built_prefix: "Built with"
label_wcag: "WCAG 2.2 AA verified in CI."
nav_label_home: "Home"
nav_label_features: "Features"
nav_label_pricing: "Pricing"
nav_label_about: "About"
nav_label_contact: "Contact"
slug_features: "features"
slug_pricing: "pricing"
slug_about: "about"
slug_contact: "contact"
translation_key: "home"
---

## Who this is for

Velocity suits a product landing page, a small SaaS marketing site, or the
public face of an open-source project. It is deliberately smaller than
Apex: no case-study index, no portfolio hero, no metrics dashboard.

If you need a portfolio, use Apex. If you are publishing long-form writing
or research, use Atlas. If you want a page that explains a product and
collects enquiries, this is the one.

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
