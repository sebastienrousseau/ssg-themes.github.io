---
name: "Velocity"
short_name: "VL"
title: "À propos — Velocity"
description: "Comment Velocity est structuré, ce qu'il vise et comment le personnaliser."
keywords: "velocity about, theme architecture, customisation"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "about"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_about: "true"
eyebrow: "À propos"
headline: "Comment Velocity est construit"
lead: "L'architecture en bref, et les deux fichiers que vous modifierez réellement."
label_theme: "Changer le thème de couleur"
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
locale_path: "/velocity/fr/"
base_path: "/velocity/"
en_current: ""
fr_current: ' aria-current="true"'
label_nav: "Principale"
label_menu: "Menu"
label_langs: "Langue"
label_product: "Produit"
label_company: "Société"
label_feeds: "Flux"
label_built_with: "Construit avec"
label_sitemap: "Plan du site"
label_licence: "Publié sous licence MIT."
label_built_prefix: "Construit avec"
label_wcag: "Conformité WCAG 2.2 AA vérifiée en intégration continue."
nav_label_home: "Accueil"
nav_label_features: "Fonctionnalités"
nav_label_pricing: "Tarifs"
nav_label_about: "À propos"
nav_label_contact: "Contact"
slug_features: "fonctionnalites"
slug_pricing: "tarifs"
slug_about: "a-propos"
slug_contact: "contact"
translation_key: "about"
---

## Structure

```
themes/velocity/
├── ssg.toml            nom du site, description, URL de base
├── content/            le texte des pages, en Markdown
└── _layouts/
    ├── base.html       coque du document, déclare le bloc `main`
    ├── header.html     partiel de navigation
    ├── footer.html     partiel de pied de page
    ├── index.html      chaque mise en page étend base
    └── styles.css      tout le système de design
```

## Les deux fichiers que vous modifierez

`ssg.toml` porte le nom du site, sa description et son URL de base. Se tromper
ici, c'est publier un `llms.txt` qui annonce « MySsgSite » et des données
structurées pointant vers `127.0.0.1`.

`_layouts/styles.css` s'ouvre sur un bloc `@layer tokens` qui contient chaque
couleur, chaque pas typographique et chaque valeur d'espacement. Changez
`--accent` à cet endroit et tout le thème suit.

## Vérifier une modification

Lancez `make check` depuis la racine du dépôt. La commande analyse les blocs de
jetons et confronte chaque paire déclarée à sa cible WCAG — 7:1 pour le texte,
3:1 pour les bordures et l'anneau de focus — en clair comme en sombre. Un jeton
en échec fait échouer la construction ; ce n'est pas un avertissement.

## Navigateurs visés

Couches de cascade, requêtes de conteneur et `:focus-visible` : Chrome 111+,
Firefox 128+, Safari 16.4+. Les navigateurs plus anciens reçoivent un contenu
lisible sans mise en forme plutôt qu'une mise en page cassée.
