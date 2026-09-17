---
name: "Velocity"
short_name: "VL"
title: "Fonctionnalités — Velocity"
description: "Tout ce que contient le thème Velocity, et ce qu'il laisse délibérément de côté."
keywords: "velocity about, theme architecture, customisation"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "about"
language: "fr-FR"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_features: "true"
eyebrow: "Fonctionnalités"
headline: "Ce qu'il y a dans la boîte"
lead: "Une liste courte, décrite honnêtement. Quand une capacité vient du générateur plutôt que du thème, c'est précisé."
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
translation_key: "features"
nav_about: "true"
---

## Apporté par le thème

- Cinq mises en page partageant un même `base.html` par héritage de gabarit
- En-tête, pied de page et navigation en partiels : un fichier à modifier, pas cinq
- Un système de couleurs à jetons, palettes claire et sombre, toutes deux validées
- Un menu déroulant utilisable au clavier comme au pointeur
- Un formulaire de contact qui poste vers le point d'accès que vous configurez
- Des anneaux `:focus-visible` et un bloc global `prefers-reduced-motion`

## Apporté par le générateur

Ces éléments arrivent parce que vous utilisez Static Site Generator, et non
grâce au thème. Le rôle du thème est de les relier et de les mettre en forme.

- Une recherche côté client, injectée comme boîte de dialogue accessible avec SRI
- RSS, Atom et JSON Feed, générés depuis le même contenu
- `sitemap.xml`, `robots.txt` et un manifeste d'application web
- Une nomenclature logicielle CycloneDX pour la construction
- `llms.txt` pour la découverte par les agents, alimenté depuis `ssg.toml`
- Empreintes CSS et JS avec hachages d'intégrité de sous-ressource

## Délibérément absents

- Aucune police web. La pile typographique se résout sur des polices déjà
  présentes sur l'appareil : rien ne se recompose tardivement et aucun tiers ne
  voit l'adresse IP de vos visiteurs.
- Aucune police d'icônes ni bibliothèque d'icônes. Les quelques icônes sont en SVG intégré.
- Aucun carrousel, aucun système de fenêtre modale, aucune bibliothèque d'animation.
- Aucune mesure d'audience. Ajoutez la vôtre si nécessaire, et déclarez-la.
