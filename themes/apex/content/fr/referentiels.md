---
name: "Apex"
short_name: "AX"
title: "Référentiels — Apex"
description: "Les référentiels et méthodes qu'Apex met en avant, présentés comme des outils de décision plutôt que comme des promesses."
keywords: "apex frameworks, content structure, editorial conventions"
author: "SSG Theme Suite"
date: "2026-08-11"
layout: "frameworks"
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
nav_frameworks: "true"
eyebrow: "Référentiels"
headline: "Des méthodes, pas des slogans"
lead: "Des cadres de travail décrits avec leurs limites et les conditions dans lesquelles ils s'appliquent."
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
translation_key: "frameworks"
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
