---
name: "jspassgen"
title: "À propos de jspassgen - générateur cryptographique pour SSG"
description: "Comment jspassgen offre une génération cryptographique locale sans confiance préalable."
author: "SSG Theme Suite"
date: "2026-10-10"
layout: "page"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
schema: "page"
copyright_year: "2026"
form_origin: "https://example.com"
theme_style: "style-jspassgen"
theme_colour: "#055e43"
brand_mark: "J"
footer_note: "Entropie cryptographique générée entièrement sur votre machine."
cta_primary: "Explorer le générateur"
eyebrow: "À propos du thème"
headline: "Intégrité cryptographique par défaut."
lead: "jspassgen fournit aux équipes de sécurité et aux développeurs une plateforme auditable et sans dépendance."
locale_path: "/jspassgen/fr/"
base_path: "/jspassgen/"
en_current: ""
fr_current: ' aria-current="true"'
label_home: "Accueil jspassgen"
label_menu: "Menu"
label_nav: "Principale"
label_langs: "Langue"
label_theme: "Changer le thème de couleur"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
label_theme_system: "Système"
label_explore: "Explorer"
label_start: "Contacter l'équipe de sécurité"
label_demo_content: "Contenu de démonstration."
label_made_with: "Réalisé avec SSG"
nav_generator: "Générateur"
nav_diceware: "Diceware"
nav_entropy: "Entropie"
nav_audit: "Audit"
nav_about: "À propos"
nav_contact: "Contact"
slug_about: "a-propos"
slug_contact: "contact"
translation_key: "about"
---

Le thème jspassgen est conçu pour les organisations exigeant une transparence totale
sur la génération de clés cryptographiques et les outils d'hygiène des mots de passe.

Contrairement aux générateurs monolithiques en mode SaaS, jspassgen s'exécute entièrement
côté client à l'aide des primitives natives du navigateur (`window.crypto.getRandomValues`)
et d'algorithmes mathématiques rigoureusement audités.

### Piliers essentiels

1. **Isolation locale absolue**: La Content Security Policy interdit explicitement les connexions réseau sortantes et les scripts distants.
2. **Tables Diceware standardisées**: Utilise la liste officielle de l'EFF comptant 7 776 mots anglais distincts phonétiquement.
3. **Sécurité au sens de Shannon**: Les calculs d'entropie garantissent des métriques de force reproductibles et scientifiquement validées.
4. **Accessibilité universelle**: Conforme aux critères de contraste WCAG 2.2 AAA sur l'ensemble des contrôles d'interface.
