---
author: "SSG Theme Suite"
date: "2026-08-30"
language: "en-GB"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
locale_path: "/quill/"
base_path: "/quill/"
en_current: ' aria-current="true"'
fr_current: ""
name: "Quill"
short_name: "QU"
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
translation_key: "post-3"
title: "Writing for two languages from the start — Quill"
description: "Retrofitting a second locale finds every place a layout assumed English."
keywords: "blog, writing"
post_title: "Writing for two languages from the start"
post_cat: "Writing"
post_author: "Ines Moreau"
post_date: "3 August 2026"
post_iso: "2026-08-03"
post_read: "7 min read"
prev_href: "/quill/posts/the-cost-of-a-sticky-header/"
prev_label: "The real cost of a sticky header"
next_href: "/quill/archive/"
next_label: "Archive"
layout: "post"
---

Adding a second language to a finished site is an audit you did not ask
for. Every assumption about the length of a word, the shape of a date, and
the characters an identifier may contain gets tested at once.

## Length is the obvious one

German compounds and French phrasing are routinely longer than their English
equivalents. A navigation bar sized to fit *Home, Archive, About* has no room
for *Accueil, Archives, À propos* — so it wraps, the header grows, and every
offset measured from it is wrong.

The fix is not to shorten the translation. It is to stop hard-coding the
consequence:

```js
root.style.setProperty("--masthead-h", head.getBoundingClientRect().height + "px");
```

## Identifiers are the subtle one

The one that is easy to miss is slugs. A common way to build a heading id is
to lowercase the text and replace anything that is not a letter or digit with
a hyphen:

```js
text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
```

That is fine until a heading is *Conformité*, which becomes `conformit`. Or
*Comment c'est mesuré*, which becomes `comment-c-est-mesur`. Every accented
character is treated as a separator, so the tail of the word disappears and
the link that pointed at it no longer resolves.

Normalising first fixes it:

```js
text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()
```

> An identifier scheme that only survives ASCII is a trap for whoever adds
> the next language.

## Ship the second locale early

The value of shipping two languages from the first release is not the second
audience. It is that every one of these assumptions is caught while the code
is small enough to change.
