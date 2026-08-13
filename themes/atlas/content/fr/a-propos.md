---
name: "Atlas"
short_name: "AT"
title: "À propos — Atlas"
description: "Règles éditoriales, politique de correction et fabrication du thème Atlas."
keywords: "atlas à propos, règles éditoriales, politique de correction"
author: "SSG Theme Suite"
date: "2026-08-11"
news_publication_date: "2026-08-11"
layout: "about"
language: "fr"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_about: "true"
eyebrow: "À propos"
headline: "Exigences et structure"
lead: "Ce que ce thème présume de votre façon de publier, et comment il est fabriqué."
translation_key: "about"
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

## Des règles éditoriales, en modèle

Remplacez cette section par les vôtres. Elle existe parce qu'un pôle de
connaissances qui n'énonce pas ses règles demande à ses lecteurs de lui faire
confiance sur rien.

- **Sourçage.** Toute affirmation factuelle renvoie à une source primaire.
- **Corrections.** Une erreur substantielle donne lieu à une note datée en
  tête de page.
- **Mises à jour.** Les modifications mineures sont silencieuses ; tout ce qui
  change une conclusion fait l'objet d'une note.
- **Déclaration d'intérêts.** Les relations commerciales pertinentes pour un
  texte y sont mentionnées.

## Comment le thème est construit

`base.html` porte la coquille du document et déclare un bloc `main`. Chaque
gabarit de page s'ouvre par `{{#extends "base"}}` et remplit ce bloc ;
l'en-tête et le pied de page sont des fragments. Le texte des pages est du
Markdown injecté par `{{!content}}`.

Les versions antérieures de ce thème incorporaient une feuille de styles de
183 Ko dans chacun de ses huit gabarits — 1,9 Mo de CSS dupliqué qui avait
déjà divergé en cinq versions différentes. Il n'y a désormais qu'une seule
feuille de styles.

## Vérifier une modification

`make check` analyse les blocs de jetons de `_layouts/styles.css` et contrôle
chaque paire déclarée par rapport à sa cible WCAG, en thème clair comme en
thème sombre : 7:1 pour le texte, 3:1 pour les bordures et l'anneau de focus.
Un jeton non conforme fait échouer la compilation.
