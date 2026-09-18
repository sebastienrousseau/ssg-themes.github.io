---
name: "Apex"
short_name: "AX"
title: "Case studies — Apex"
description: "Three worked examples showing how Apex handles a consulting portfolio, a research practice and an advisory board profile."
keywords: "apex case studies, portfolio examples, ssg theme demo"
author: "SSG Theme Suite"
date: "2026-08-11"
layout: "projects"
language: "en-GB"
lang_code: "EN"
lang_change: "Change language"
label_nav: "Primary"
label_menu: "Menu"
label_theme: "Dark theme"
nav_label_home: "Home"
nav_label_projects: "Case studies"
nav_label_frameworks: "Frameworks"
nav_label_about: "About"
nav_label_contact: "Contact"
slug_projects: "projects"
slug_frameworks: "frameworks"
slug_about: "about"
slug_contact: "contact"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
news_publication_date: "2026-08-11"
nav_projects: "true"
eyebrow: "Case studies"
headline: "Three ways to use Apex"
lead: "Sample content showing the shapes the theme is designed to hold. Replace it with your own."
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
ui_case_studies: "Case studies"
ui_frameworks: "Frameworks"
ui_specifications: "Specifications"
ui_json_feed: "JSON Feed"
ui_built_with: "Built with"
ui_static_site_generator: "Static Site Generator"
ui_built_with_2: "Built with"
ui_made_with_ssg: "Made with SSG"
ui_wcag_2_2_aa: ". WCAG 2.2 AA verified in CI."
ui_language: "Language"
locale_path: "/apex/"
base_path: "/apex/"
en_current: ' aria-current="true"'
fr_current: ""
translation_key: "projects"
---

## Independent consulting practice

A five-page site: a home page that leads with outcomes, a case-study index,
a frameworks page describing method, an about page carrying credentials,
and a contact form posting to a form endpoint of your choosing.

The metric cards on the home page are the natural place for the numbers a
prospective client scans for — engagement length, team size, measurable
result. Keep them to four; a fifth pushes the grid to a second row on
laptop widths and dilutes the effect.

## Research and advisory profile

Swap the case-study index for a publications list and point the RSS,
Atom and JSON feeds in the footer at it. SSG generates all three from the
same content, and the theme links them so readers and aggregators can find
them without a plugin.

For long-form pages, the `.prose` container caps line length at 68
characters, which is where sustained reading comfort sits for this type
size.

## Advisory board member

The shortest useful configuration: home, about, contact. Delete the other
Markdown files and remove their entries from `header.html` and
`footer.html` — two edits, because the navigation is a partial rather than
repeated markup.

## Choosing between the three

| | Consulting | Research | Advisory |
| --- | --- | --- | --- |
| Pages | 5 | 4 | 3 |
| Feeds | Optional | Recommended | Not needed |
| Contact form | Yes | Email link | Email link |
| Best for | Client acquisition | Citation and reach | Credibility |
