---
name: "Atlas"
short_name: "AT"
title: "About — Atlas"
description: "Editorial standards, corrections policy, and how the Atlas theme is built."
keywords: "atlas about, editorial standards, corrections policy"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "about"
language: "en-GB"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_about: "true"
eyebrow: "About"
headline: "Standards and structure"
lead: "What this theme assumes about how you publish, and how it is put together."
translation_key: "about"
slug_articles: "articles/"
slug_papers: "papers/"
slug_about: "about/"
slug_contact: "contact/"
label_skip: "Skip to main content"
label_home: "Home"
label_articles: "Articles"
label_papers: "Papers"
label_about: "About"
label_contact: "Contact"
footer_writing: "Writing"
footer_hub: "Hub"
footer_feeds: "Feeds"
footer_built: "Built with"
footer_sitemap: "Sitemap"
footer_licence: "Released under the MIT licence."
footer_colophon: "Built with Static Site Generator (SSG). WCAG 2.2 AA verified in CI."
---

## Editorial standards, as a template

Replace this section with your own. It exists because a knowledge hub that
does not state its standards is asking readers to trust it on nothing.

- **Sourcing.** Claims of fact carry a link to a primary source.
- **Corrections.** Material errors get a dated note at the head of the page.
- **Updates.** Non-material changes are silent; anything that changes a
  conclusion gets a note.
- **Disclosure.** Commercial relationships relevant to a piece appear in it.

## How the theme is built

`base.html` holds the document shell and declares a `main` block. Every
page layout opens with `{{#extends "base"}}` and fills that block; the
header and footer are partials. Page copy is Markdown injected with
`{{!content}}`.

Earlier releases of this theme inlined a 183 KB stylesheet into each of
eight layouts — 1.9 MB of duplicated CSS that had already drifted into five
different versions. There is now one stylesheet.

## Verifying a change

`make check` parses the token blocks in `_layouts/styles.css` and asserts
every declared pair against its WCAG target in both light and dark: 7:1 for
text, 3:1 for borders and the focus ring. A failing token fails the build.
