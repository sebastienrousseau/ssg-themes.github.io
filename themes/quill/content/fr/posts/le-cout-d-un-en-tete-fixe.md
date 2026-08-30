---
author: "SSG Theme Suite"
date: "2026-08-30"
language: "fr-FR"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
locale_path: "/quill/fr/"
base_path: "/quill/"
en_current: ""
fr_current: ' aria-current="true"'
name: "Quill"
short_name: "QU"
tagline: "Notes sur la fabrication du web, lentement et volontairement."
slug_archive: "archives"
slug_about: "a-propos"
nav_home: "Accueil"
nav_archive: "Archives"
nav_about: "À propos"
cur_home: ""
cur_archive: ""
cur_about: ""
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
translation_key: "post-2"
title: "Le coût réel d'un en-tête fixe — Quill"
description: "Cela ressemble à une petite commodité jusqu'à ce qu'on le mesure."
keywords: "blog, design"
post_title: "Le coût réel d'un en-tête fixe"
post_cat: "Design"
post_author: "Ada Whitfield"
post_date: "12 août 2026"
post_iso: "2026-08-12"
post_read: "5 min de lecture"
prev_href: "/quill/fr/posts/mesurer-plutot-que-declarer/"
prev_label: "Mesurer plutôt que déclarer"
next_href: "/quill/fr/posts/ecrire-pour-deux-langues/"
next_label: "Écrire pour deux langues dès le départ"
layout: "post"
---

Un en-tête qui vous suit au fil de la page est une décision qui semble
gratuite. Elle coûte une bande fixe de l'écran, et la taille de cette bande
est rarement celle de la maquette.

## Mesurer à la largeur réellement utilisée

L'en-tête de ce thème tient sur une ligne au bureau. Rétrécissez la fenêtre :
la navigation passe à la ligne, le sélecteur de langue aussi.

| Fenêtre | Hauteur | Part d'un écran de 700 px |
| --- | --- | --- |
| 1280 px | 69 px | 10 % |
| 480 px | 128 px | 18 % |
| 320 px | 181 px | 26 % |

Un quart d'un petit écran, en permanence.

## Ce qui n'est pas une question de goût

Un en-tête collant casse aussi deux critères d'accessibilité. Un lien d'ancre
amène sa cible en haut de la fenêtre, c'est-à-dire sous l'en-tête. Le
déplacement du focus également.

```css
html { scroll-padding-top: calc(var(--masthead-h) + 1rem); }
```

Cela ne fonctionne que si le décalage est la hauteur *mesurée*.

## Un réglage raisonnable

Fixer l'en-tête tant qu'il tient sur une ligne, et le laisser défiler dès
qu'il occupe une part trop grande de la fenêtre.
