---
author: "SSG Theme Suite"
date: "2026-08-30"
language: "en"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
locale_path: "/lucid/"
base_path: "/lucid/"
en_current: " aria-current=\"true\""
fr_current: ""
slug_install: "installation"
slug_config: "configuration"
slug_a11y: "accessibility"
label_skip: "Skip to main content"
label_menu: "Menu"
label_nav: "Main"
label_langs: "Language"
label_theme: "Theme"
label_theme_system: "System"
label_docs: "Documentation"
label_footer_nav: "Documentation"
label_docs_nav: "Documentation sections"
label_crumbs: "Breadcrumb"
label_pager: "Page"
label_prev: "Previous"
label_next: "Next"
label_toc: "On this page"
nav_home: "Home"
nav_install: "Installation"
nav_config: "Configuration"
nav_a11y: "Accessibility"
name: "Lucid"
short_name: "LU"
footer_note: "A documentation theme for Static Site Generator, published under MIT or Apache-2.0."
copyright: "© 2026 SSG Theme Suite. Licensed under MIT or Apache-2.0."
screenshot_alt: "The Lucid documentation theme, showing side navigation, a reading column and an in-page contents list."
translation_key: "a11y"
title: "Accessibility — Lucid"
description: "What Lucid guarantees, how each guarantee is measured, and which WCAG AAA criteria a theme cannot decide on its own."
keywords: "wcag aaa theme, accessible documentation, contrast enhanced"
eyebrow: "Reference"
headline: "Accessibility"
lead: "Lucid meets every WCAG 2.2 AAA criterion a theme can determine on its own. Each claim below is enforced by a gate in the repository that builds it, and where a criterion depends on your words rather than the template, this page says so instead of claiming it."
toc_1: "Conformance"
toc_1_id: "conformance"
toc_2: "How it is measured"
toc_2_id: "how-it-is-measured"
toc_3: "What the theme cannot decide"
toc_3_id: "what-the-theme-cannot-decide"
cur_install: ""
cur_config: ""
cur_a11y: " aria-current=\"page\""
prev_href: "/lucid/configuration/"
prev_label: "Configuration"
next_href: "/lucid/"
next_label: "Home"
layout: "doc"
---

## Conformance

Lucid targets **WCAG 2.2 level AAA**. Every AAA success criterion that a theme
can determine is met and gated.

Seven of the criteria a documentation theme must satisfy — reflow, text
spacing, focus visibility, language of parts — **have no AAA level defined**.
AA, or A, *is* the top of the scale for those. They are listed separately below
so that a level marked "AA" is not mistaken for a gap, and where exceeding the
required threshold was possible, Lucid exceeds it.

### Met at AAA

| Criterion | How Lucid meets it |
| --- | --- |
| 1.4.6 Contrast (Enhanced) | Every text token pair is at least 7:1 in both colour schemes |
| 1.4.8 Visual Presentation | A reading column near 66 characters, 1.6 line height, paragraph spacing above 1.5x that, text never justified, and a colour scheme the reader chooses |
| 1.4.9 Images of Text (No Exception) | There are none. Every heading, label and control is live text |
| 2.1.3 Keyboard (No Exception) | Every control is a native link or button; nothing requires a pointer |
| 2.2.3 No Timing | Nothing expires, moves on, or refreshes |
| 2.3.2 Three Flashes | Nothing flashes |
| 2.3.3 Animation from Interactions | All motion is disabled under `prefers-reduced-motion` |
| 2.4.8 Location | Breadcrumbs on every page, plus `aria-current` on the current item |
| 2.4.10 Section Headings | Every section is introduced by a real heading, in order, with no level skipped |
| 2.4.12 Focus Not Obscured (Enhanced) | No part of a focus ring is ever covered — hit-tested at 1,066 focus stops |
| 2.4.13 Focus Appearance | A 3px ring at a 2px offset, above 4.5:1 against both the component and its background |
| 2.5.5 Target Size (Enhanced) | Every link, button and control is at least 44 by 44 pixels |
| 2.5.6 Concurrent Input Mechanisms | Keyboard, pointer and touch all work at once; none is switched off |
| 3.2.5 Change on Request | Nothing navigates, opens or reloads on its own |

### Criteria with no AAA level, met at the highest defined

| Criterion | Highest level | How Lucid meets it |
| --- | --- | --- |
| 1.4.10 Reflow | AA | One column at 320px and at 400% zoom, with no horizontal scrolling |
| 1.4.11 Non-text Contrast | AA | **4.5:1** for focus rings and control borders, where the criterion asks 3:1 |
| 1.4.12 Text Spacing | AA | Survives the reader overriding line, word, letter and paragraph spacing |
| 2.4.7 Focus Visible | AA | Focus is restyled, never removed |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Met at the Enhanced level above, which subsumes it |
| 2.4.1 Bypass Blocks | A | A skip link, and landmarks on every region |
| 3.1.2 Language of Parts | AA | Each language link carries its own `lang` and `hreflang` |

The current page in a navigation list is marked with `aria-current`, not colour
alone, which is 1.4.1 Use of Colour.

## How it is measured

Contrast is not eyeballed, and neither is anything else here. Three suites run
against the built site in a real browser, in both colour schemes:

```bash
make check-contrast   # every token pair, light and dark
make check-aaa        # rendered contrast, target size, reflow, focus
```

`check-contrast` parses the stylesheet and computes the ratio for every pair
the theme renders. `check-aaa` goes further, because a token can pass in
isolation and still be painted on a ground it was never paired with: it reads
the *computed* colour of every text run as the browser drew it, measures every
target, resizes 8 pages across 11 viewports asserting nothing scrolls
sideways, and tabs through every page at 7 widths hit-testing each focus ring.

Focus is checked by paint order rather than by overlapping rectangles, because
the two disagree: the skip link deliberately overlaps the masthead and is
perfectly visible on top of it. Only asking the browser what it would hand a
click at a given point tells you which is which.

Any failure returns a non-zero exit code and names the page, the viewport, the
element and the measurement it missed.

## What the theme cannot decide

A theme can guarantee presentation. It cannot guarantee the things WCAG asks of
the words inside it, and claiming otherwise would be the kind of assertion this
page exists to avoid.

- **3.1.5 Reading Level (AAA)** depends on your prose, not the template.
- **2.4.9 Link Purpose, Link Only (AAA)** depends on your link text. Lucid names
  the destination in its own navigation — "Configuration" rather than "read
  more" — but your content is yours.
- **3.1.3 Unusual Words** and **3.1.4 Abbreviations (AAA)** ask for glossaries
  and expansions that only an author can supply.
- **1.2.x Media alternatives** apply only if you add audio or video; the theme
  ships none.
- **Image alternative text** is yours to write. The theme's own decorative logo
  is marked `alt=""` so a screen reader passes over it.

If a criterion is not listed anywhere on this page, treat it as unverified
rather than met.
