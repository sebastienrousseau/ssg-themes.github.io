---
name: "Velocity"
short_name: "VL"
title: "Tarifs — Velocity"
description: "Un exemple travaillé de page tarifaire construite avec la grille de cartes et les composants de tableau de Velocity."
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
nav_pricing: "true"
eyebrow: "Tarifs"
headline: "Une page de tarifs, à titre d'exemple"
lead: "Contenu d'exemple illustrant les composants tableau et carte. Le thème lui-même est gratuit et sous licence MIT."
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
translation_key: "pricing"
nav_about: "true"
---

## Comment cette page fonctionne

Le tableau ci-dessus est un **îlot** : du HTML statique qu'un petit module
enrichit dès qu'il entre dans le champ de vision. Sans JavaScript, vous obtenez
le tableau tarifaire mensuel complet, qui est aussi ce qu'un robot d'indexation
lit. Le sélecteur de périodicité est créé par le module, si bien que la page
n'affiche jamais un contrôle incapable de fonctionner.

`.table-wrap` donne au tableau son propre conteneur de défilement horizontal :
un tableau large ne fait donc jamais défiler le corps de la page latéralement,
l'échec WCAG 1.4.10 le plus courant sur les pages tarifaires.

## À propos du thème lui-même

Velocity est sous licence MIT et libre d'usage commercial, sans obligation
d'attribution. Cette page existe pour montrer les composants, pas pour vendre.

## Rédiger une vraie page de tarifs

Tenez-vous-en à trois offres. Placez l'offre recommandée au milieu et signalez-la
avec le composant `.badge`. Indiquez ce qui se passe à la limite plutôt que la
limite seule : « les constructions sont mises en file » se lit très différemment
de « les constructions échouent ».
