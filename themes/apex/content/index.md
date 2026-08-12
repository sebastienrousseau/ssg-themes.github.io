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
schema: "page"
changefreq: "weekly"
permalink: "https://ssg-themes.github.io/apex/"
copyright_year: "2026"
form_origin: "https://example.com"
base_path: "/apex/"
site_url: "https://ssg-themes.github.io/apex/"
news_publication_date: "2026-08-11"
nav_home: "true"
hero_alt: "Portrait of the site owner, shown at the top of the home page."
eyebrow: "Executive portfolio"
headline: "A portfolio theme that earns its accessibility claim"
lead: "Apex is built for consultants, directors and advisors who need a fast, credible site without a build toolchain. Every accessibility and performance claim it makes is checked by a gate in CI."
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
