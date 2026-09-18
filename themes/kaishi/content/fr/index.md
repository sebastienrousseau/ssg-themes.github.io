---
name: "Kaishi"
short_name: "KA"
title: "Kaishi — thème starter d'inspiration Apple pour SSG"
description: "Thème starter d'inspiration Apple : en-tête translucide fixe, contrôles en pastille et cartes aux angles doux, sur un système de couleurs validé WCAG AAA."
keywords: "kaishi, ssg theme, starter theme, apple design, accessible theme"
author: "SSG Theme Suite"
date: "2026-09-01"
news_publication_date: "2026-09-01"
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
headline: "Un départ net, accessible dès le premier commit"
lead: "Kaishi est un thème starter qui emprunte la retenue d'Apple — en-tête translucide fixe, contrôles en pastille, typographie généreuse — et tient chaque paire de couleurs au niveau WCAG AAA plutôt qu'AA."
label_theme: "Thème"
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
ui_features: "Fonctionnalités"
ui_primary: "Principale"
ui_features_2: "Fonctionnalités"
ui_json_feed: "JSON Feed"
ui_built_with: "Construit avec"
ui_static_site_generator: "Static Site Generator"
ui_built_with_2: "Construit avec"
ui_made_with_ssg: "Réalisé avec SSG"
ui_wcag_2_2_aa: ". Conformité WCAG 2.2 AA vérifiée en intégration continue."
ui_language: "Langue"
locale_path: "/kaishi/fr/"
base_path: "/kaishi/"
en_current: ""
fr_current: ' aria-current="true"'
kai_see_what_is_included: "Voir ce qui est inclus"
kai_download_zip: "Télécharger le .zip"
kai_download_tar_gz: "Télécharger le .tar.gz"
kai_built_for_shipping_quickly: "Fait pour publier vite"
kai_no_build_toolchain: "Aucune chaîne de construction"
kai_no_npm_install_no: "Pas de npm install, pas de bundler, pas de fichier de verrouillage. Vous éditez du Markdown, lancez un binaire et déployez le dossier."
kai_nothing_phones_home: "Rien ne téléphone à la maison"
kai_no_cdn_webfont_host: "Aucun CDN, hébergeur de polices, mesure d'audience ou gestionnaire de balises. Il n'y a rien à déclarer dans un bandeau de consentement."
kai_accessible_by_default: "Accessible par défaut"
kai_colour_tokens_are_gated: "Les jetons de couleur sont validés au niveau AAA pour le texte ; les parcours clavier et les états de focus sont vérifiés en intégration continue."
kai_search_included: "Recherche incluse"
kai_the_generator_injects_an: "Le générateur injecte une boîte de dialogue de recherche accessible, avec un compte de résultats en région live. Le thème se contente de l'habiller."
kai_feeds_included: "Flux inclus"
kai_rss_atom_and_json: "RSS, Atom et JSON Feed sont générés depuis le même contenu et référencés dans l'en-tête du document."
kai_one_file_to_re: "Un seul fichier à redécliner"
kai_the_whole_palette_is: "Toute la palette tient dans un bloc de jetons en tête de"
translation_key: "home"
slug_about: "a-propos"
slug_contact: "contact"
slug_features: "fonctionnalites"
---

## À qui cela s'adresse

Kaishi convient à un premier site : une page personnelle, un petit produit ou
la vitrine publique d'un projet libre. Il vous donne la retenue visuelle
d'Apple sans le travail de recherche, et un plancher d'accessibilité sous
lequel vous ne pouvez pas tomber par accident.

Pour un portfolio d'études de cas, utilisez Apex. Pour des textes longs ou de
la recherche, utilisez Atlas. Pour de la documentation, utilisez Lucid.

## Ce qui fait Kaishi

L'allure repose sur trois détails, tous portés par des jetons plutôt que par
le balisage :

- **Un en-tête translucide.** Le bandeau floute la page derrière lui, mais
  seulement là où `backdrop-filter` est pris en charge. Partout ailleurs il
  reste opaque, de sorte que la paire de contraste vérifiée par la porte de
  qualité est bien celle qui est livrée.
- **Des contrôles en pastille.** Les boutons utilisent un rayon de 980 px
  plutôt que `50%` : un bouton large garde donc des extrémités en demi-cercle
  au lieu de se déformer en ellipse.
- **Des cartes douces.** Un angle de 24 px et une ombre à peine perceptible,
  plutôt qu'une bordure qui ferait tout le travail.

## Accessibilité

Chaque paire de couleurs de ce thème est vérifiée au niveau **AAA (7:1)** pour
le texte par `scripts/contrast.py` en intégration continue — pas AA, et pas à
l'œil. Le mode sombre est vérifié comme une palette à part entière, et c'est
précisément là que les thèmes échouent d'ordinaire : un gris atténué qui se
lit bien sur blanc devient souvent invisible sur noir.

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
