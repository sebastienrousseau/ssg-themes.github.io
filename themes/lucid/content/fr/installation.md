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
translation_key: "install"
title: "Installation — Lucid"
description: "Installez le thème de documentation Lucid pour Static Site Generator et construisez le site en une commande."
keywords: "installer thème lucid, configuration thème documentation ssg"
eyebrow: "Démarrage"
headline: "Installation"
lead: "Copiez le thème dans votre site, indiquez sa configuration au générateur, puis construisez. Aucun paquet à installer, aucune étape de compilation propre au thème."
toc_1: "Prérequis"
toc_1_id: "prerequis"
toc_2: "Ajouter le thème"
toc_2_id: "ajouter-le-theme"
toc_3: "Construire le site"
toc_3_id: "construire-le-site"
cur_install: " aria-current=\"page\""
cur_config: ""
cur_a11y: ""
prev_href: "/lucid/fr/"
prev_label: "Accueil"
next_href: "/lucid/fr/configuration/"
next_label: "Configuration"
layout: "doc"
---

## Prérequis

Lucid nécessite le binaire `ssg`, version 0.0.56 ou plus récente, et rien d'autre. Aucune chaîne d'outils Node, aucun bundler, aucune étape de gestionnaire de paquets : le thème se compose de Markdown, de gabarits HTML et d'une feuille de style.

```bash
ssg --version
```

## Ajouter le thème

Copiez le répertoire `lucid` dans le répertoire `themes/` de votre site :

```bash
cp -r themes/lucid /chemin/vers/votre-site/themes/
```

Le thème apporte son propre `ssg.toml`. Trois clés suffisent à l'adapter :

| Clé | Rôle |
| --- | --- |
| `content_dir` | L'emplacement de votre Markdown |
| `template_dir` | Le répertoire `_layouts` du thème |
| `output_dir` | L'emplacement du site construit |

## Construire le site

```bash
ssg --config themes/lucid/ssg.toml
```

Le résultat est un site statique complet : aucun runtime, aucune exigence de serveur, et aucun JavaScript nécessaire à la lecture. Poursuivez avec [Configuration](/lucid/fr/configuration/).
