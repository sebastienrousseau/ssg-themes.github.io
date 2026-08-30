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
cur_about: ""
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
translation_key: "post-2"
title: "The real cost of a sticky header — Stablo"
description: "It looks like a small convenience until you measure it on a phone."
keywords: "blog, design"
post_title: "The real cost of a sticky header"
post_cat: "Design"
post_author: "Ada Whitfield"
post_date: "12 August 2026"
post_iso: "2026-08-12"
post_read: "5 min read"
prev_href: "/stablo/posts/measuring-instead-of-claiming/"
prev_label: "Measuring instead of claiming"
next_href: "/stablo/posts/writing-for-two-languages/"
next_label: "Writing for two languages from the start"
layout: "post"
---

A header that follows you down the page is one of those decisions that
sounds free. It costs a fixed strip of the screen, and the size of that strip
is rarely the number in the design.

## Measure it at the width people use

The header in this theme is one row on a desktop. Narrow the window and the
navigation wraps, the language switcher wraps, and the row count grows:

| Viewport | Header height | Share of a 700px screen |
| --- | --- | --- |
| 1280px | 69px | 10% |
| 480px | 128px | 18% |
| 320px | 181px | 26% |

A quarter of a small screen, permanently, in exchange for not scrolling back
up.

## The part that is not a taste question

Sticky headers also break two accessibility criteria in a way that is not a
matter of preference. An anchor link scrolls its target to the top of the
viewport — which is underneath the header. So does moving focus.

The fix is to tell the browser where the top really is:

```css
html { scroll-padding-top: calc(var(--masthead-h) + 1rem); }
```

That works only if the offset is the *measured* height. Hard-coding a value
from one viewport leaves every other width wrong, and the widths where it is
most wrong are the narrow ones where the header is tallest.

## A reasonable default

Stick the header while it is a single row. When it wraps past a share of the
viewport, let it scroll away. That keeps the convenience where it is cheap
and drops it where it is not.
