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
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_home: "true"
eyebrow: "Starter theme"
headline: "A clean start, accessible from the first commit"
lead: "Kaishi is a starter theme that borrows Apple's restraint — a translucent sticky header, pill controls, generous type — and holds every colour pair to WCAG AAA rather than AA."
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
