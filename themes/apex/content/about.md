---
name: "Apex"
short_name: "AX"
title: "Specifications — Apex"
description: "How Apex is built: template inheritance, the token system, the accessibility gates it passes, and the browser support it targets."
keywords: "apex specifications, ssg theme architecture, wcag 2.2, design tokens"
author: "SSG Theme Suite"
date: "2026-08-11"
layout: "about"
language: "en-GB"
schema: "page"
changefreq: "monthly"
permalink: "https://ssg-themes.github.io/apex/about/"
copyright_year: "2026"
form_origin: "https://example.com"
base_path: "/apex/"
site_url: "https://ssg-themes.github.io/apex/"
news_publication_date: "2026-08-11"
nav_about: "true"
eyebrow: "Specifications"
headline: "How Apex is put together"
lead: "A short, honest account of the architecture, the gates, and the trade-offs."
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
