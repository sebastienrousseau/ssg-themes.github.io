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
translation_key: "post-1"
title: "Measuring instead of claiming — Quill"
description: "A stylesheet can declare a rule that matches nothing, and read as correct for months."
keywords: "blog, craft"
post_title: "Measuring instead of claiming"
post_cat: "Craft"
post_author: "Ada Whitfield"
post_date: "21 August 2026"
post_iso: "2026-08-21"
post_read: "6 min read"
prev_href: "/quill/"
prev_label: "Home"
next_href: "/quill/posts/the-cost-of-a-sticky-header/"
next_label: "The real cost of a sticky header"
layout: "post"
---

A stylesheet is a set of claims. Each rule says that when this pattern
appears, these properties apply. The trouble is that a claim can be false and
still look entirely reasonable in the file.

## A rule that matched nothing

Consider a rule meant to put space between paragraphs:

```css
.prose > * + * { margin-top: 2.5em; }
```

It reads correctly. It is also inert when the generator wraps rendered
Markdown in an element of its own, because then the paragraphs are not
children of `.prose` — they are grandchildren, and the child combinator does
not reach them.

Nothing complains. The stylesheet parses, the page renders, and the spacing
is simply absent. The only way to find it is to ask the browser what it
actually computed:

```js
getComputedStyle(paragraph).marginTop
```

Zero, where the design called for forty pixels.

## Why review does not catch this

Reading a diff tells you what a rule says, not whether it applies. Both
require knowing the shape of the DOM the rule will meet, and that shape is
decided somewhere else — by a generator, a component, a wrapper added six
months ago for an unrelated reason.

> A rule you have read is not a rule you have verified.

## Measure the output, not the source

The useful checks all share a shape. They load the built page in a real
browser, ask it what it painted, and compare that against the claim:

| Claim | What to measure |
| --- | --- |
| Text meets a contrast ratio | The computed colour against its actual background |
| Nothing overflows on a phone | Every element's horizontal extent at that width |
| Focus is never hidden | Which element a click would hit, at the focus ring |

None of these can be answered from the source. All of them can be answered
in a few lines against the output.
