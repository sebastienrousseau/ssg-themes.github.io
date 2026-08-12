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
permalink: "https://ssg-themes.github.io/velocity/pricing/"
copyright_year: "2026"
form_origin: "https://example.com"
base_path: "/velocity/"
site_url: "https://ssg-themes.github.io/velocity/"
nav_pricing: "true"
eyebrow: "Pricing"
headline: "A pricing page, as an example"
lead: "Sample content demonstrating the table and card components. The theme itself is free and MIT-licensed."
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
