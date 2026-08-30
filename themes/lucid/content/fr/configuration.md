---
author: "SSG Theme Suite"
date: "2026-08-30"
language: "fr"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
locale_path: "/lucid/fr/"
base_path: "/lucid/"
en_current: ""
fr_current: " aria-current=\"true\""
slug_install: "installation"
slug_config: "configuration"
slug_a11y: "accessibilite"
label_skip: "Aller au contenu principal"
label_menu: "Menu"
label_nav: "Principal"
label_langs: "Langue"
label_theme: "Thème"
label_theme_system: "Système"
label_docs: "Documentation"
label_footer_nav: "Documentation"
label_docs_nav: "Sections de la documentation"
label_crumbs: "Fil d'Ariane"
label_pager: "Page"
label_prev: "Précédent"
label_next: "Suivant"
label_toc: "Sur cette page"
nav_home: "Accueil"
nav_install: "Installation"
nav_config: "Configuration"
nav_a11y: "Accessibilité"
name: "Lucid"
short_name: "LU"
footer_note: "Un thème de documentation pour Static Site Generator, publié sous licence MIT ou Apache-2.0."
copyright: "© 2026 SSG Theme Suite. Sous licence MIT ou Apache-2.0."
screenshot_alt: "Le thème de documentation Lucid : navigation latérale, colonne de lecture et sommaire de la page."
translation_key: "config"
title: "Configuration — Lucid"
description: "Configurez la navigation, les langues et les jetons de couleur du thème de documentation Lucid."
keywords: "configurer thème lucid, i18n ssg, navigation documentation"
eyebrow: "Référence"
headline: "Configuration"
lead: "Chaque chaîne visible de Lucid provient du front matter et non du balisage : c'est ce qui fait d'une nouvelle langue un répertoire plutôt qu'un fork."
toc_1: "Front matter"
toc_1_id: "front-matter"
toc_2: "Ajouter une langue"
toc_2_id: "ajouter-une-langue"
toc_3: "Jetons de couleur"
toc_3_id: "jetons-de-couleur"
cur_install: ""
cur_config: " aria-current=\"page\""
cur_a11y: ""
prev_href: "/lucid/fr/installation/"
prev_label: "Installation"
next_href: "/lucid/fr/accessibilite/"
next_label: "Accessibilité"
layout: "doc"
---

## Front matter

Aucun gabarit de Lucid ne contient de phrase en dur. Les libellés de navigation, le texte des boutons, le nom du fil d'Ariane et jusqu'au mot « Menu » sont des clés de front matter : traduire le thème n'implique jamais de modifier du HTML.

```yaml
nav_install: "Installation"
label_toc: "Sur cette page"
label_prev: "Précédent"
```

Une page qui omet une clé l'affiche vide plutôt que de revenir à l'anglais : une traduction manquante devient visible au lieu de rester silencieusement monolingue.

## Ajouter une langue

Déclarez la langue dans `ssg.toml` :

```toml
[i18n]
default_locale = "en"
locales = ["en", "fr", "de"]
url_prefix = "sub_path"
```

Ajoutez ensuite `content/de/`, un fichier par page. Chaque page porte une `translation_key` ; les pages qui partagent une clé sont considérées comme des traductions l'une de l'autre, ce qui produit les alternates `hreflang`. La validation du dépôt échoue si une clé ne se résout pas dans chaque langue déclarée : un site à moitié traduit est une erreur de construction, pas une surprise pour le lecteur.

## Jetons de couleur

La couleur est déclarée une seule fois, en propriétés personnalisées :

```css
--ink: #0d1117;
--ink-soft: #232a35;
--accent: #08417f;
--surface: #f4f6f9;
```

Chaque paire étant vérifiée en intégration continue, modifier un jeton vers une valeur au contraste insuffisant fait échouer la construction. Voir [Accessibilité](/lucid/fr/accessibilite/).
