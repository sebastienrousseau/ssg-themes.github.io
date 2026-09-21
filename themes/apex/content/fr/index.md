---
name: "Apex"
short_name: "AX"
title: "Apex — thème portfolio pour dirigeants, pour SSG"
description: "Un thème de portfolio prêt pour la production : conformité WCAG 2.2 AA vérifiée en intégration continue, aucune requête tierce et un système de jetons que l'on peut redécliner sans toucher à une mise en page."
keywords: "apex, ssg theme, static site generator, portfolio theme, accessible theme"
author: "SSG Theme Suite"
date: "2026-08-11"
layout: "index"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
label_nav: "Principale"
label_menu: "Menu"
label_theme: "Thème sombre"
nav_label_home: "Accueil"
nav_label_projects: "Études de cas"
nav_label_frameworks: "Référentiels"
nav_label_about: "À propos"
nav_label_contact: "Contact"
slug_projects: "etudes-de-cas"
slug_frameworks: "referentiels"
slug_about: "a-propos"
slug_contact: "contact"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
news_publication_date: "2026-08-11"
nav_home: "true"
hero_alt: "Un ordinateur portable posé sur un bureau en bois affiche un rapport, les mains sur le clavier."
eyebrow: "Portfolio de direction"
headline: "Un thème de portfolio qui mérite ses affirmations d'accessibilité"
lead: "Apex s'adresse aux consultants, dirigeants et conseils qui veulent un site rapide et crédible sans chaîne de construction. Chaque promesse d'accessibilité et de performance est vérifiée par une porte de qualité en intégration continue."
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
ui_case_studies: "Études de cas"
ui_frameworks: "Référentiels"
ui_specifications: "Spécifications"
ui_json_feed: "JSON Feed"
ui_built_with: "Construit avec"
ui_static_site_generator: "Static Site Generator"
ui_built_with_2: "Construit avec"
ui_made_with_ssg: "Réalisé avec SSG"
ui_wcag_2_2_aa: ". Conformité WCAG 2.2 AA vérifiée en intégration continue."
ui_language: "Langue"
locale_path: "/apex/fr/"
base_path: "/apex/"
en_current: ""
fr_current: ' aria-current="true"'
ape_view_case_studies: "Voir les études de cas"
ape_download_zip: "Télécharger le .zip"
ape_download_tar_gz: "Télécharger le .tar.gz"
ape_measured_not_asserted: "Mesuré, et non affirmé"
ape_every_figure_below_is: "Chaque chiffre ci-dessous est produit par une porte de qualité à chaque commit. Rien ici n'est un badge figé."
ape_wcag_2_2_conformance: "Conformité WCAG 2.2"
ape_verified_by_axe_core: "Vérifié par axe-core et"
ape_third_party_requests: "Requêtes tierces"
ape_no_cdn_no_webfont: "Aucun CDN, aucun hébergeur de polices, aucune mesure d'audience. Tout est servi depuis votre propre origine."
ape_lt_7_nbsp_kb: "&lt;7&nbsp;Ko"
ape_heaviest_page_compressed: "Page la plus lourde, compressée"
ape_html_plus_the_fingerprinted: "Le HTML, plus le CSS et le JS empreintés qu'il référence. Plafonné à 20&nbsp;Ko par"
ape_cumulative_layout_shift: "Décalage cumulé de mise en page"
ape_every_image_carries_intrinsic: "Chaque image porte ses dimensions intrinsèques ; aucune police web tardive ne recompose la page."
ape_about_this_theme: "À propos de ce thème"
translation_key: "home"
---

## Ce que vous obtenez

Apex propose cinq types de pages — accueil, études de cas, référentiels, à
propos et contact — qui partagent un même `base.html` par héritage de
gabarit. L'en-tête, le pied de page et la navigation vivent dans des
partiels : changer une entrée de menu se fait sur une ligne, dans un seul
fichier, plutôt que par un rechercher-remplacer sur toutes les mises en page.

Le système de couleurs est défini une fois sous forme de propriétés
personnalisées et revérifié à chaque commit par `scripts/contrast.py`. Les
paires de texte franchissent le critère WCAG 1.4.6 à 7:1 — le seuil AAA — et
les bordures comme l'anneau de focus franchissent 1.4.11 à 3:1. Changez un
jeton et la porte de qualité vous dira si vous avez cassé quelque chose.

## Ce qu'il ne fait délibérément pas

Il n'y a ni CDN, ni hébergeur de polices, ni script de mesure d'audience, ni
bandeau de consentement, parce qu'il n'y a rien à consentir. La pile
typographique se résout sur des polices déjà présentes sur l'appareil : c'est
pourquoi aucune recomposition n'intervient à l'arrivée d'une police web —
aucune n'arrive.

La recherche est fournie par SSG lui-même. Le générateur injecte un widget de
recherche accessible, avec un rôle de dialogue correct, des annonces de
résultats en région live et un hachage d'intégrité de sous-ressource sur son
script ; le thème se contente de l'habiller à votre palette.

## Vous l'appropriez

Commencez par `_layouts/styles.css`. Le bloc `@layer tokens` en tête contient
tout le système de design : changez `--accent`, lancez `make check`, et la
porte de contraste confirme que la nouvelle valeur passe encore avant la mise
en ligne.
