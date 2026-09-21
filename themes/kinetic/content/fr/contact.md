---
name: "Kinetic"
short_name: "KN"
title: "Contact — Kinetic"
description: "Comment joindre l'équipe Kinetic : demander une démonstration, poser une question d'intégration ou signaler un problème."
keywords: "kinetic contact page, contact form example"
author: "SSG Theme Suite"
date: "2026-08-15"
news_publication_date: "2026-08-15"
layout: "contact"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
schema: "page"
changefreq: "yearly"
copyright_year: "2026"
form_origin: "https://example.com"
form_action: "https://example.com/enquiries"
nav_contact: "true"
eyebrow: "Contact"
headline: "Nous parler"
lead: "Dites-nous comment votre équipe travaille et nous vous dirons si la plateforme lui convient."
label_theme: "Thème"
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
ui_platform: "Plateforme"
ui_solutions: "Solutions"
ui_primary: "Principale"
ui_platform_2: "Plateforme"
ui_platform_tour: "Visite de la plateforme"
ui_solutions_2: "Solutions"
ui_by_team: "Par équipe"
ui_talk_to_us: "Nous parler"
ui_json_feed: "JSON Feed"
ui_built_with: "Construit avec"
ui_static_site_generator: "Static Site Generator"
ui_made_with_ssg: "Réalisé avec SSG"
ui_language: "Langue"
locale_path: "/kinetic/fr/"
base_path: "/kinetic/"
en_current: ""
fr_current: ' aria-current="true"'
translation_key: "contact"
slug_contact: "contact"
slug_platform: "plateforme"
slug_pricing: "tarifs"
slug_solutions: "solutions"
---
## Before you deploy this page

Two fields need changing, and the page does not work until they are:

`form_action` is where the submission goes. Until you set it, the form
posts to a placeholder that will not accept it.

`form_origin` must name the same endpoint, because the page ships a strict
`form-action` content security policy. If the two disagree the browser
blocks the POST — deliberately, and silently as far as the visitor is
concerned, so check both together.
