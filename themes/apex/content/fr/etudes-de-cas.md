---
name: "Apex"
short_name: "AX"
title: "Études de cas — Apex"
description: "Des études de cas d'exemple montrant comment Apex présente un travail de conseil sans transformer la page en argumentaire."
keywords: "apex case studies, portfolio examples, ssg theme demo"
author: "SSG Theme Suite"
date: "2026-08-11"
layout: "projects"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
label_nav: "Principale"
label_menu: "Menu"
label_theme: "Thème sombre"
nav_label_home: "Accueil"
nav_label_projects: "Études de cas"
nav_label_frameworks: "Référentiels"
nav_label_about: "À propos"
nav_label_contact: "Contact"
slug_projects: "etudes-de-cas"
slug_frameworks: "referentiels"
slug_about: "a-propos"
slug_contact: "contact"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
news_publication_date: "2026-08-11"
nav_projects: "true"
eyebrow: "Études de cas"
headline: "Le travail, en contexte"
lead: "Chaque cas associe la décision, la contrainte et le résultat, plutôt qu'une simple liste de logos."
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
ui_case_studies: "Études de cas"
ui_frameworks: "Référentiels"
ui_specifications: "Spécifications"
ui_json_feed: "JSON Feed"
ui_built_with: "Construit avec"
ui_static_site_generator: "Static Site Generator"
ui_built_with_2: "Construit avec"
ui_made_with_ssg: "Réalisé avec SSG"
ui_wcag_2_2_aa: ". Conformité WCAG 2.2 AA vérifiée en intégration continue."
ui_language: "Langue"
locale_path: "/apex/fr/"
base_path: "/apex/"
en_current: ""
fr_current: ' aria-current="true"'
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
