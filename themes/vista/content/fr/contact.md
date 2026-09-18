---
name: "Vista"
short_name: "PR"
title: "Contact — Vista"
description: "Comment joindre l'équipe au sujet du thème Vista : poser une question, demander une démonstration ou signaler un problème."
keywords: "vista contact page, contact form example"
author: "SSG Theme Suite"
date: "2026-09-16"
news_publication_date: "2026-09-16"
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
headline: "Posez-nous vos questions"
lead: "L'appareil est fictif ; l'architecture de la page ne l'est pas. Dites-nous ce que vous cherchez à construire."
label_theme: "Thème"
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
ui_features: "Fonctionnalités"
ui_specifications: "Spécifications"
ui_primary: "Principale"
ui_features_2: "Fonctionnalités"
ui_specifications_2: "Spécifications"
ui_json_feed: "JSON Feed"
ui_built_with: "Construit avec"
ui_static_site_generator: "Static Site Generator"
ui_made_with_ssg: "Réalisé avec SSG"
ui_language: "Langue"
locale_path: "/vista/fr/"
base_path: "/vista/"
en_current: ""
fr_current: ' aria-current="true"'
translation_key: "contact"
slug_contact: "contact"
slug_features: "fonctionnalites"
slug_specs: "specifications"
---
## Before you deploy this page

Two fields need changing, and the page does not work until they are:

`form_action` is where the submission goes. Until you set it, the form
posts to a placeholder that will not accept it.

`form_origin` must name the same endpoint, because the page ships a strict
`form-action` content security policy. If the two disagree the browser
blocks the POST — deliberately, and silently as far as the visitor is
concerned, so check both together.
