---
name: "Apex"
short_name: "AX"
title: "Frameworks — Apex"
description: "The editorial and structural conventions Apex encodes, and why each one is there."
keywords: "apex frameworks, content structure, editorial conventions"
author: "SSG Theme Suite"
date: "2026-08-11"
layout: "frameworks"
language: "en-GB"
schema: "page"
changefreq: "monthly"
permalink: "https://ssg-themes.github.io/apex/frameworks/"
copyright_year: "2026"
form_origin: "https://example.com"
base_path: "/apex/"
site_url: "https://ssg-themes.github.io/apex/"
news_publication_date: "2026-08-11"
nav_frameworks: "true"
eyebrow: "Frameworks"
headline: "Conventions worth keeping"
lead: "Apex encodes a small number of opinions. Each one is here because removing it measurably costs something."
---

## One idea per page, stated first

Each layout opens with an eyebrow, a headline and a lead paragraph, drawn
from front matter rather than written into the HTML. That ordering gives
screen-reader users the page's purpose in the first three elements after
the landmark, and gives search engines a description that matches what the
page actually says.

## Numbers need provenance

The metric cards deliberately carry a sentence of explanation under each
figure. A number without a source is decoration; the previous release of
this theme advertised "100/100 Lighthouse" from a hardcoded image badge,
which is exactly the failure mode this convention exists to prevent.

## Navigation lives in one file

`header.html` is a partial. Every layout includes it. There is no second
copy to drift, and the current page is marked with `aria-current="page"`
driven by a front-matter flag rather than by duplicated markup.

## Forms must have a destination

`contact.html` reads its endpoint from the `form_action` front-matter
field. If you do not set it, the build fails rather than shipping a form
that silently discards what visitors type.

## Content is content

Page copy is Markdown, not HTML. It is injected with `{{!content}}`, which
means you can restructure the prose on any page without opening a layout —
and translators can work on the Markdown alone.
