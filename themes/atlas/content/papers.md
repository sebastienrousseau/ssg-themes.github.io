---
name: "Atlas"
short_name: "AT"
title: "Papers — Atlas"
description: "Sample long-form and reference index for research-style publishing."
keywords: "atlas papers, research index, technical writing"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "papers"
language: "en-GB"
schema: "page"
changefreq: "monthly"
permalink: "https://ssg-themes.github.io/atlas/papers/"
copyright_year: "2026"
form_origin: "https://example.com"
base_path: "/atlas/"
site_url: "https://ssg-themes.github.io/atlas/"
asset_path: "/atlas/"
asset_url: "https://ssg-themes.github.io/atlas/"
nav_papers: "true"
eyebrow: "Papers"
headline: "Long-form and reference"
lead: "Where work too long for an article lives. Sample entries follow."
translation_key: "papers"
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

## What belongs here

Anything a reader would print, cite, or return to with a specific question:
specifications, methodology write-ups, benchmark reports, position papers.

The distinguishing test is not length but re-entry. If someone will arrive
looking for one section rather than reading start to finish, it belongs
here and needs a table of contents.

## Reference formatting

| Element | Convention |
| --- | --- |
| Headings | Sentence case, stable wording |
| Dates | ISO 8601 in `datetime`, long form visible |
| Figures | Numbered, captioned, described in alt text |
| Tables | Header row marked with `<th scope="col">` |
| Corrections | Dated note at the head, original text struck |

## Accessibility of long documents

Wide tables sit inside the theme's `.table-wrap`, which gives them their
own scroll container so the page body never scrolls sideways at 320 px —
the most common WCAG 1.4.10 failure in technical writing.

Headings step by exactly one level. Skipping from `h2` to `h4` breaks the
document outline that screen-reader users navigate by.
