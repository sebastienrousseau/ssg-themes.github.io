---
name: "Atlas"
short_name: "AT"
title: "Articles — Atlas"
description: "Sample article index showing how Atlas presents a body of writing."
keywords: "atlas articles, article index, editorial theme demo"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "articles"
language: "en-GB"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_articles: "true"
eyebrow: "Articles"
headline: "Writing"
lead: "Sample entries demonstrating the index shape. Replace them with your own."
translation_key: "articles"
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

## Structuring a knowledge hub

Most hubs begin as a blog and stay one, which is why so many of them are
unusable after year two. A stream is ordered by when you wrote something;
a hub is ordered by what a reader needs. Those two orders diverge quickly.

The practical fix is to separate durable pages from dated ones early, give
the durable pages stable URLs, and let the dated ones link into them.

## Writing for citation

A page that gets cited is one a reader can quote precisely. That means
stable headings, a visible publication date paired with a machine-readable
`<time>` element, and a correction note when something material changes —
not a silent edit.

Atlas's `article` layout emits both date forms and leaves room above the
prose for a standfirst that states the claim.

## On updating rather than rewriting

An update adds; a rewrite replaces. If a reader who bookmarked the page two
years ago would be confused by what they now find, it was a rewrite, and it
deserves a new URL and a pointer from the old one.

## Adding your own

Create a Markdown file in `content/` with `layout: "article"` and the front
matter fields listed in `content.schema.toml`. The build validates those
fields, so a mistyped date fails the build rather than the page.
