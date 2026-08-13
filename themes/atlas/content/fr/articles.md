---
name: "Atlas"
short_name: "AT"
title: "Articles — Atlas"
description: "Index d'articles de démonstration montrant comment Atlas présente un corpus d'écrits."
keywords: "atlas articles, index d'articles, démonstration de thème éditorial"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "articles"
language: "fr"
schema: "page"
tags: ["method", "editorial"]
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_articles: "true"
eyebrow: "Articles"
headline: "Écrits"
lead: "Des entrées de démonstration illustrant la forme de l'index. Remplacez-les par les vôtres."
translation_key: "articles"
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

## Structurer un pôle de connaissances

La plupart des pôles commencent comme des blogues et le restent, ce qui
explique pourquoi tant d'entre eux deviennent inutilisables passé la deuxième
année. Un flux est ordonné par la date d'écriture ; un pôle est ordonné par
ce dont le lecteur a besoin. Ces deux ordres divergent vite.

Le remède pratique consiste à séparer tôt les pages durables des pages datées,
à donner aux premières des adresses stables, et à laisser les secondes y
renvoyer.

## Écrire pour être cité

Une page que l'on cite est une page que l'on peut citer avec précision. Cela
suppose des intertitres stables, une date de publication visible doublée d'un
élément `<time>` lisible par machine, et une note de correction lorsque
quelque chose de substantiel change — plutôt qu'une retouche silencieuse.

Le gabarit `article` d'Atlas produit les deux formes de date et ménage, au
dessus de la prose, la place d'un chapeau énonçant la thèse.

## Mettre à jour plutôt que réécrire

Une mise à jour ajoute ; une réécriture remplace. Si un lecteur qui avait mis
la page en signet il y a deux ans était dérouté par ce qu'il y trouve
aujourd'hui, c'était une réécriture : elle mérite une nouvelle adresse et un
renvoi depuis l'ancienne.

## Ajouter les vôtres

Créez un fichier Markdown dans `content/` avec `layout: "article"` et les
champs d'en-tête listés dans `content.schema.toml`. La compilation valide ces
champs : une date mal saisie fait échouer la construction plutôt que la page.
