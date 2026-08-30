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
translation_key: "post-1"
title: "Mesurer plutôt que déclarer — Quill"
description: "Une feuille de style peut déclarer une règle qui ne correspond à rien."
keywords: "blog, artisanat"
post_title: "Mesurer plutôt que déclarer"
post_cat: "Artisanat"
post_author: "Ada Whitfield"
post_date: "21 août 2026"
post_iso: "2026-08-21"
post_read: "6 min de lecture"
prev_href: "/quill/fr/"
prev_label: "Accueil"
next_href: "/quill/fr/posts/le-cout-d-un-en-tete-fixe/"
next_label: "Le coût réel d'un en-tête fixe"
layout: "post"
---

Une feuille de style est un ensemble d'affirmations. Chaque règle dit que
lorsque ce motif apparaît, ces propriétés s'appliquent. L'ennui est qu'une
affirmation peut être fausse tout en paraissant parfaitement raisonnable.

## Une règle qui ne correspondait à rien

Prenons une règle censée espacer les paragraphes :

```css
.prose > * + * { margin-top: 2.5em; }
```

Elle se lit correctement. Elle est aussi inerte lorsque le générateur
enveloppe le Markdown rendu dans son propre élément : les paragraphes ne sont
alors plus des enfants de `.prose`, et le combinateur enfant ne les atteint
pas.

Rien ne proteste. La feuille se charge, la page s'affiche, et l'espacement est
simplement absent.

## Pourquoi la relecture ne suffit pas

Lire une différence vous dit ce qu'une règle affirme, pas si elle s'applique.
Les deux exigent de connaître la forme du DOM que la règle rencontrera, et
cette forme est décidée ailleurs.

> Une règle que vous avez lue n'est pas une règle que vous avez vérifiée.

## Mesurer la sortie, pas la source

Les contrôles utiles ont tous la même forme : charger la page construite dans
un vrai navigateur, lui demander ce qu'elle a peint, et comparer.

| Affirmation | Ce qu'il faut mesurer |
| --- | --- |
| Le texte atteint un rapport de contraste | La couleur calculée face à son fond réel |
| Rien ne déborde sur un téléphone | L'étendue horizontale de chaque élément |
| Le focus n'est jamais masqué | Quel élément recevrait un clic à cet endroit |
