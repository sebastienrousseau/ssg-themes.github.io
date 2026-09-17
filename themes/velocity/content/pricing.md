---
name: "Velocity"
short_name: "VL"
title: "Pricing — Velocity"
description: "A worked example of a pricing page built with Velocity’s card grid and table components."
keywords: "velocity pricing page, pricing table example"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "pricing"
language: "en-GB"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_pricing: "true"
eyebrow: "Pricing"
headline: "A pricing page, as an example"
lead: "Sample content demonstrating the table and card components. The theme itself is free and MIT-licensed."
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
translation_key: "pricing"
---

## How this page works

The table above is an **island**: static HTML that a small module enhances
once it scrolls into view. Without JavaScript you get the complete monthly
pricing table — which is also what a crawler indexes. The billing-period
control is created by the module, so the page never shows a control that
cannot work.

`.table-wrap` gives the table its own horizontal scroll container, so a wide
table never makes the page body scroll sideways — the most common WCAG
1.4.10 failure on pricing pages.

## On the theme itself

Velocity is MIT-licensed and free for commercial use, with no attribution
requirement. This page exists to show the components, not to sell anything.

## Writing a real pricing page

Keep the tier count to three. Put the recommended tier in the middle and
mark it with the `.badge` component. State what happens at the limit rather
than only the limit itself — "builds queue" reads very differently from
"builds fail".
