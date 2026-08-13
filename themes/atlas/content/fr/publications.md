---
name: "Atlas"
short_name: "AT"
title: "Publications — Atlas"
description: "Index de démonstration pour les textes au long cours et les documents de référence."
keywords: "atlas publications, index de recherche, écriture technique"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "papers"
language: "fr"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_papers: "true"
eyebrow: "Publications"
headline: "Textes au long cours et références"
lead: "L'endroit où vivent les travaux trop longs pour un article. Des entrées de démonstration suivent."
translation_key: "papers"
slug_articles: "articles/"
slug_papers: "publications/"
slug_about: "a-propos/"
slug_contact: "nous-contacter/"
label_skip: "Aller au contenu principal"
label_home: "Accueil"
label_articles: "Articles"
label_papers: "Publications"
label_about: "À propos"
label_contact: "Nous contacter"
footer_writing: "Écrits"
footer_hub: "Le site"
footer_feeds: "Flux"
footer_built: "Réalisé avec"
footer_sitemap: "Plan du site"
footer_licence: "Publié sous licence MIT."
footer_colophon: "Réalisé avec Static Site Generator (SSG). Conformité WCAG 2.2 AA vérifiée en intégration continue."
---

## Ce qui a sa place ici

Tout ce qu'un lecteur imprimerait, citerait, ou consulterait de nouveau avec
une question précise : spécifications, notes de méthode, rapports de mesure,
prises de position.

Le critère distinctif n'est pas la longueur mais le retour. Si quelqu'un
arrive en cherchant une section plutôt qu'en lisant du début à la fin, le
texte a sa place ici et lui faut un sommaire.

## Conventions de référence

| Élément | Convention |
| --- | --- |
| Intertitres | Casse de phrase, formulation stable |
| Dates | ISO 8601 dans `datetime`, forme longue visible |
| Figures | Numérotées, légendées, décrites en texte alternatif |
| Tableaux | Ligne d'en-tête marquée par `<th scope="col">` |
| Corrections | Note datée en tête, texte d'origine barré |

## Accessibilité des documents longs

Les tableaux larges sont placés dans le `.table-wrap` du thème, qui leur donne
leur propre conteneur de défilement : le corps de la page ne défile jamais
horizontalement à 320 px — l'échec WCAG 1.4.10 le plus courant dans l'écriture
technique.

Les niveaux de titre progressent un à un. Sauter de `h2` à `h4` casse le plan
du document sur lequel s'appuient les utilisateurs de lecteurs d'écran.
