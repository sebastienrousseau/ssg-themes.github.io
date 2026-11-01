---
name: "Control Centre"
author: "SSG Theme Suite"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
theme_style: "style-control-centre"
theme_colour: "#3b2fb8"
brand_mark: "CC"
brand_tagline: "Parc MCP"
footer_note: "Tableau de bord de démonstration pour Example Co., une entreprise fictive. Noms, hôtes et chiffres sont inventés."
locale_path: "/control-centre/fr/"
base_path: "/control-centre/"
en_current: ""
fr_current: ' aria-current="true"'
label_skip: "Aller au contenu principal"
label_home: "Accueil de Control Centre"
label_menu: "Menu"
label_nav: "Tableau de bord"
label_langs: "Langue"
label_theme: "Changer le thème de couleur"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
label_theme_system: "Système"
label_search: "Rechercher sur ce site"
search_placeholder: "Serveurs, constats…"
label_explore: "Explorer"
label_start: "Signaler un problème"
label_demo_content: "Contenu de démonstration."
label_made_with: "Fait avec SSG"
crumb_root: "Example Co. · parc MCP"
nav_group_estate: "Parc"
nav_group_site: "Site"
nav_overview: "Vue d’ensemble"
nav_findings: "Constats"
nav_findings_count: "4"
nav_servers: "Serveurs MCP"
nav_servers_count: "4"
nav_mitigation: "Remédiation"
nav_about: "À propos"
nav_contact: "Contact"
snapshot_title: "Instantané hors ligne"
snapshot_time: "2026-10-14 09:00 UTC"
snapshot_note: "Vue en lecture seule d’une configuration capturée. Rien n’est en direct."
slug_about: "a-propos"
slug_contact: "contact"
title: "À propos de Control Centre : un thème de tableau de bord pour SSG"
description: "À quoi sert le thème Control Centre, comment fonctionnent son anneau d’état et sa palette de sévérité, et comment remplacer les données de démonstration."
date: "2026-10-14"
layout: "page"
translation_key: "about"
current_about: "true"
eyebrow: "À propos du thème"
headline: "Un seul écran pour l’état d’un système."
lead: "Control Centre est un thème en forme de tableau de bord pour les rapports d’état, de sécurité et d’exploitation publiés en pages statiques."
---
## À quoi il sert

Control Centre présente un rapport comme une console d’exploitation : une barre latérale de destinations, une barre supérieure avec la recherche et le mode de couleur, et une colonne principale qui commence par ce qui demande de l’attention. Viennent ensuite un anneau d’état entouré des systèmes concernés, une rangée de chiffres clés, et des panneaux pour les constats, les étapes et les tableaux.

La démonstration est le parc MCP d’Example Co., une entreprise fictive : trois agents, quatre serveurs sur des domaines d’exemple et des constats inventés. Remplacez-la par vos propres données.

## D’où viennent les données

Tout ce qui figure sur la vue d’ensemble provient de l’en-tête de la page ou de son corps Markdown : une page anglaise et une page française partagent la même mise en page avec un texte différent.

- L’anneau, les listes de part et d’autre et les chiffres clés sont des champs d’en-tête comme `server_1_name`, `server_1_sev` et `kpi_1_value`.
- Chaque arc de l’anneau est une part d’un cercle de 100 unités : `ring_1_dash` est sa longueur et `ring_1_offset` son point de départ.
- Les constats, les étapes et les tableaux sont du Markdown dans le corps de la page, avec `<span class="pill sev-high">` pour une pastille de sévérité.

## La palette de sévérité

Cinq niveaux, `critical`, `high`, `medium`, `low` et `ok`, chacun avec une couleur pleine pour les points, les arcs et les flux, et un couple teinte et encre pour les pastilles. Chaque couple de texte dépasse 7:1 en clair comme en sombre, et chaque couleur pleine dépasse 3:1 sur les surfaces qui la portent ; `scripts/contrast.py` vérifie les deux à chaque commit. La sévérité est toujours écrite en toutes lettres : la couleur n’est jamais le seul signal.

## Ce qu’il ne fait pas

C’est une page statique. Rien ne s’y met à jour tout seul : reconstruisez le site quand les données changent.
