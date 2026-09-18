---
name: "Velocity"
short_name: "VL"
title: "Velocity — thème produit et starter pour SSG"
description: "Un starter léger de page produit et de documentation pour Static Site Generator. Sans bundler, sans requête tierce, avec un système de couleurs validé AAA pour le texte."
keywords: "velocity, ssg theme, starter theme, landing page, static site generator"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "index"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_home: "true"
eyebrow: "Thème starter"
headline: "Publiez un site produit cet après-midi"
lead: "Velocity est le plus petit thème Static Site Generator réellement utile : cinq pages, une feuille de style, aucune étape de build et rien chargé depuis le serveur d'un tiers."
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
translation_key: "home"
---

## À qui cela s'adresse

Velocity convient à une page produit, à un petit site marketing SaaS ou à la
vitrine publique d'un projet libre. Il est volontairement plus réduit
qu'Apex : pas d'index d'études de cas, pas d'en-tête de portfolio, pas de
tableau de bord d'indicateurs.

Pour un portfolio, utilisez Apex. Pour publier des textes longs ou de la
recherche, utilisez Atlas. Pour une page qui explique un produit et recueille
des demandes, c'est celui-ci.

## Ce que « sans étape de build » signifie

Il n'y a pas de `package.json`. La feuille de style est écrite à la main, en
CSS, avec des couches de cascade et des propriétés personnalisées que tous les
navigateurs visés prennent en charge nativement. Les deux fichiers JavaScript
totalisent moins de 4 Ko en ES5 : pas de transpileur, pas de polyfill, pas de
graphe de modules.

Pour travailler sur le thème, vous lancez le générateur et vous rafraîchissez.
C'est toute la boucle.

## L'étendre

Ajouter une page, c'est deux fichiers : un fichier Markdown dans `content/` et
une mise en page dans `_layouts/` qui commence par `{{#extends "base"}}`.
L'en-tête, le pied de page et la coque du document suivent automatiquement, si
bien qu'une nouvelle page démarre à environ huit lignes.
