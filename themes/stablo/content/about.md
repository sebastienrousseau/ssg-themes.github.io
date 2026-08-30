---
author: "SSG Theme Suite"
date: "2026-08-30"
language: "en-GB"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
locale_path: "/stablo/"
base_path: "/stablo/"
en_current: ' aria-current="true"'
fr_current: ""
name: "Stablo"
short_name: "ST"
tagline: "Notes on building for the web, slowly and on purpose."
slug_archive: "archive"
slug_about: "about"
nav_home: "Home"
nav_archive: "Archive"
nav_about: "About"
cur_home: ""
cur_archive: ""
cur_about: ' aria-current="page"'
label_skip: "Skip to main content"
label_menu: "Menu"
label_nav: "Main"
label_langs: "Language"
label_theme: "Theme"
label_theme_system: "System"
label_light: "Light"
label_dark: "Dark"
label_crumbs: "Breadcrumb"
label_pager: "Post"
label_prev: "Previous"
label_next: "Next"
label_footer_nav: "Footer"
label_sections: "Sections"
nf_eyebrow: "404"
nf_h: "That page is not here"
nf_lead: "The link may be old, or the post may have been renamed. The archive lists everything that exists."
nf_cta: "Back to the blog"
footer_note: "A blog theme for Static Site Generator, published under MIT."
copyright: "© 2026 SSG Theme Suite. Licensed under MIT."
screenshot_alt: "The blog home page: featured posts with category labels, author bylines and dates."
translation_key: "about"
title: "About — Stablo"
description: "About this demonstration site and what the theme verifies."
keywords: "about, colophon"
eyebrow: "About"
headline: "About"
lead: "A demonstration site for the theme, and a note on what is actually verified."
layout: "page"
---

This is a demonstration site for the **Stablo** theme. The posts are
real prose rather than filler, because a theme that has only been tested
against *lorem ipsum* has not been tested against the thing it is for.

## What the theme provides

- A post index, an archive, and an about page
- English and French, with a `translation_key` on every page and `hreflang`
  alternates emitted from it
- A colour scheme the reader chooses: system, light or dark
- No client-side framework, and nothing that requires JavaScript to read

## What is verified

Every colour pair is checked at WCAG AAA — 7:1 for text — in both schemes
before the site builds. Borders and focus rings are held to 4.5:1, which is
stricter than the 3:1 that criterion asks, because it has no AAA level.

Beyond the tokens, the built pages are measured in a real browser: the
computed colour of every text run against the background it is actually
painted on, every target at 44 by 44 pixels, no horizontal overflow at any
width, and no focus ring that another element covers.
