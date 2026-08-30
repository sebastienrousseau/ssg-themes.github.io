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
translation_key: "post-3"
title: "Écrire pour deux langues dès le départ — Stablo"
description: "Ajouter une seconde langue après coup révèle chaque hypothèse."
keywords: "blog, écriture"
post_title: "Écrire pour deux langues dès le départ"
post_cat: "Écriture"
post_author: "Inès Moreau"
post_date: "3 août 2026"
post_iso: "2026-08-03"
post_read: "7 min de lecture"
prev_href: "/stablo/fr/posts/le-cout-d-un-en-tete-fixe/"
prev_label: "Le coût réel d'un en-tête fixe"
next_href: "/stablo/fr/archives/"
next_label: "Archives"
layout: "post"
---

Ajouter une seconde langue à un site terminé est un audit que vous n'avez
pas demandé. Chaque hypothèse sur la longueur d'un mot et sur les caractères
qu'un identifiant peut contenir est testée d'un coup.

## La longueur, l'évidence

Une barre de navigation dimensionnée pour *Home, Archive, About* n'a pas la
place d'*Accueil, Archives, À propos*. Elle passe à la ligne, l'en-tête
grandit, et tout décalage mesuré à partir de lui devient faux.

```js
root.style.setProperty("--masthead-h", head.getBoundingClientRect().height + "px");
```

## Les identifiants, le piège

Une façon courante de construire l'identifiant d'un titre est de le mettre en
minuscules et de remplacer tout ce qui n'est ni lettre ni chiffre :

```js
text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
```

Cela va jusqu'à ce qu'un titre soit *Conformité*, qui devient `conformit`.
Chaque caractère accentué est traité comme un séparateur.

> Un schéma d'identifiants qui ne survit qu'en ASCII est un piège pour la
> personne qui ajoutera la langue suivante.

## Publier la seconde langue tôt

L'intérêt n'est pas seulement le second public : c'est que toutes ces
hypothèses sont détectées tant que le code est encore petit.
