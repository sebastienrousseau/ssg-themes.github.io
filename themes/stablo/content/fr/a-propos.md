---
author: "SSG Theme Suite"
date: "2026-08-30"
language: "fr-FR"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
locale_path: "/stablo/fr/"
base_path: "/stablo/"
en_current: ""
fr_current: ' aria-current="true"'
name: "Stablo"
short_name: "ST"
tagline: "Notes sur la fabrication du web, lentement et volontairement."
slug_archive: "archives"
slug_about: "a-propos"
nav_home: "Accueil"
nav_archive: "Archives"
nav_about: "À propos"
cur_home: ""
cur_archive: ""
cur_about: ' aria-current="page"'
label_skip: "Aller au contenu principal"
label_menu: "Menu"
label_nav: "Principal"
label_langs: "Langue"
label_theme: "Thème"
label_theme_system: "Système"
label_light: "Clair"
label_dark: "Sombre"
label_crumbs: "Fil d'Ariane"
label_pager: "Article"
label_prev: "Précédent"
label_next: "Suivant"
label_footer_nav: "Pied de page"
label_sections: "Sections"
nf_eyebrow: "404"
nf_h: "Cette page n'est pas ici"
nf_lead: "Le lien est peut-être ancien, ou l'article a été renommé. Les archives listent tout ce qui existe."
nf_cta: "Retour au blog"
footer_note: "Un thème de blog pour Static Site Generator, publié sous licence MIT."
copyright: "© 2026 SSG Theme Suite. Sous licence MIT."
screenshot_alt: "La page d'accueil du blog : articles en vedette avec catégories, auteurs et dates."
translation_key: "about"
title: "À propos — Stablo"
description: "À propos de ce site de démonstration et de ce que le thème vérifie."
keywords: "about, colophon"
eyebrow: "À propos"
headline: "À propos"
lead: "Un site de démonstration pour le thème, et une note sur ce qui est réellement vérifié."
layout: "page"
---

Ceci est un site de démonstration pour le thème **Stablo**. Les
articles sont de vrais textes plutôt que du remplissage : un thème testé
uniquement contre du *lorem ipsum* n'a pas été testé contre ce à quoi il
sert.

## Ce que le thème fournit

- Un index d'articles, des archives et une page à propos
- L'anglais et le français, avec un `translation_key` sur chaque page et les
  alternatives `hreflang` qui en découlent
- Un thème de couleurs choisi par le lecteur : système, clair ou sombre
- Aucun cadriciel côté client, et rien qui exige JavaScript pour lire

## Ce qui est vérifié

Chaque paire de couleurs est contrôlée au niveau WCAG AAA — 7:1 pour le texte
— dans les deux thèmes avant la construction du site. Les bordures et les
anneaux de focus sont tenus à 4,5:1, plus strict que le 3:1 demandé, ce
critère n'ayant pas de niveau AAA.

Au-delà des jetons, les pages construites sont mesurées dans un vrai
navigateur : la couleur calculée de chaque passage de texte face au fond sur
lequel il est réellement peint, chaque cible à 44 sur 44 pixels, aucun
débordement horizontal à quelque largeur que ce soit.
