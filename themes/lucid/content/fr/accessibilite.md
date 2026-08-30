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
translation_key: "a11y"
title: "Accessibilité — Lucid"
description: "Ce que Lucid garantit, comment chaque garantie est mesurée, et quels critères WCAG AAA un thème ne peut pas décider seul."
keywords: "thème wcag aaa, documentation accessible, contraste amélioré"
eyebrow: "Référence"
headline: "Accessibilité"
lead: "Lucid respecte tous les critères AAA des WCAG 2.2 qu'un thème peut déterminer lui-même. Chaque affirmation ci-dessous est vérifiée par un contrôle automatisé du dépôt, et lorsqu'un critère dépend de vos mots plutôt que du gabarit, cette page le dit au lieu de le revendiquer."
toc_1: "Conformité"
toc_1_id: "ce-qui-est-verifie"
toc_2: "Comment c'est mesuré"
toc_2_id: "comment-c-est-mesure"
toc_3: "Ce que le thème ne décide pas"
toc_3_id: "ce-que-le-theme-ne-decide-pas"
cur_install: ""
cur_config: ""
cur_a11y: " aria-current=\"page\""
prev_href: "/lucid/fr/configuration/"
prev_label: "Configuration"
next_href: "/lucid/fr/"
next_label: "Accueil"
layout: "doc"
---

## Conformité

Lucid vise le **niveau AAA des WCAG 2.2**. Tous les critères AAA qu'un thème
peut déterminer sont respectés et contrôlés automatiquement.

Sept des critères qu'un thème de documentation doit satisfaire — redistribution,
espacement du texte, visibilité du focus, langue des parties — **n'ont pas de
niveau AAA**. AA, ou A, *est* le sommet de l'échelle pour ceux-là. Ils sont donc
listés à part, afin qu'un niveau « AA » ne soit pas pris pour une lacune, et
lorsqu'il était possible de dépasser le seuil exigé, Lucid le dépasse.

### Respectés au niveau AAA

| Critère | Mise en œuvre |
| --- | --- |
| 1.4.6 Contraste (amélioré) | Chaque paire de jetons de texte atteint au moins 7:1 dans les deux thèmes |
| 1.4.8 Présentation visuelle | Colonne de lecture proche de 66 caractères, interligne 1,6, espacement des paragraphes supérieur à 1,5 fois cet interligne, texte jamais justifié, thème choisi par le lecteur |
| 1.4.9 Texte sous forme d'image (sans exception) | Il n'y en a aucune. Titres, libellés et contrôles sont du vrai texte |
| 2.1.3 Clavier (sans exception) | Chaque contrôle est un lien ou un bouton natif ; rien n'exige un pointeur |
| 2.2.3 Aucune limite de temps | Rien n'expire, ne défile ni ne se recharge |
| 2.3.2 Trois flashs | Rien ne clignote |
| 2.3.3 Animation à l'interaction | Toute animation est désactivée sous `prefers-reduced-motion` |
| 2.4.8 Localisation | Fil d'Ariane sur chaque page, et `aria-current` sur l'élément courant |
| 2.4.10 En-têtes de section | Chaque section est introduite par un vrai titre, dans l'ordre, sans niveau sauté |
| 2.4.12 Focus non masqué (amélioré) | Aucune partie d'un anneau de focus n'est jamais couverte — vérifié sur 1 066 arrêts de tabulation |
| 2.4.13 Apparence du focus | Anneau de 3 px décalé de 2 px, au-dessus de 4,5:1 face au composant et à son fond |
| 2.5.5 Taille de la cible (amélioré) | Chaque lien, bouton et contrôle mesure au moins 44 sur 44 pixels |
| 2.5.6 Mécanismes de saisie simultanés | Clavier, pointeur et tactile fonctionnent ensemble ; aucun n'est désactivé |
| 3.2.5 Changement à la demande | Rien ne navigue, ne s'ouvre ni ne se recharge tout seul |

### Critères sans niveau AAA, respectés au plus haut niveau défini

| Critère | Niveau le plus élevé | Mise en œuvre |
| --- | --- | --- |
| 1.4.10 Redistribution | AA | Une seule colonne à 320 px et à 400 % de zoom, sans défilement horizontal |
| 1.4.11 Contraste des éléments non textuels | AA | **4,5:1** pour les anneaux de focus et les bordures, là où le critère demande 3:1 |
| 1.4.12 Espacement du texte | AA | Résiste à la redéfinition par le lecteur de l'interligne et des espacements |
| 2.4.7 Visibilité du focus | AA | Le focus est restylé, jamais supprimé |
| 2.4.11 Focus non masqué (minimum) | AA | Couvert par le niveau amélioré ci-dessus |
| 2.4.1 Contournement de blocs | A | Un lien d'évitement, et des repères sur chaque région |
| 3.1.2 Langue d'une partie | AA | Chaque lien de langue porte ses propres `lang` et `hreflang` |

L'élément courant d'une navigation est signalé par `aria-current`, et non par la
seule couleur, ce qui satisfait 1.4.1 Utilisation de la couleur.

## Comment c'est mesuré

Le contraste n'est pas jugé à l'œil, et rien d'autre ici non plus. Trois suites
s'exécutent sur le site construit, dans un vrai navigateur, dans les deux
thèmes :

```bash
make check-contrast   # chaque paire de jetons, clair et sombre
make check-aaa        # contraste rendu, taille des cibles, redistribution, focus
```

`check-contrast` analyse la feuille de style et calcule le rapport de chaque
paire rendue. `check-aaa` va plus loin, car un jeton peut réussir isolément puis
être peint sur un fond avec lequel il n'a jamais été associé : elle lit la
couleur *calculée* de chaque passage de texte tel que le navigateur l'a dessiné,
mesure chaque cible, redimensionne 8 pages sur 11 fenêtres en vérifiant
l'absence de défilement latéral, et parcourt chaque page au clavier sur 7
largeurs en testant chaque anneau de focus.

Le focus est vérifié par ordre de peinture plutôt que par chevauchement de
rectangles, car les deux se contredisent : le lien d'évitement chevauche
volontairement l'en-tête tout en restant parfaitement visible au-dessus. Seule
la question « que recevrait un clic à cet endroit ? » permet de trancher.

Tout échec renvoie un code de sortie non nul en nommant la page, la fenêtre,
l'élément et la mesure manquée.

## Ce que le thème ne peut pas décider

Un thème peut garantir la présentation. Il ne peut pas garantir ce que les WCAG
demandent aux mots qu'il contient, et prétendre le contraire serait exactement
le genre d'affirmation que cette page cherche à éviter.

- **3.1.5 Niveau de lecture (AAA)** dépend de votre prose, pas du gabarit.
- **2.4.9 Fonction du lien (lien seul, AAA)** dépend de vos intitulés. Lucid
  nomme la destination dans sa propre navigation — « Configuration » plutôt que
  « en savoir plus » — mais votre contenu vous appartient.
- **3.1.3 Mots inhabituels** et **3.1.4 Abréviations (AAA)** demandent des
  glossaires et des développements que seul un auteur peut fournir.
- **1.2.x Alternatives aux médias** ne s'appliquent que si vous ajoutez de
  l'audio ou de la vidéo ; le thème n'en livre aucun.
- **Le texte alternatif des images** vous revient. Le logo décoratif du thème
  porte `alt=""` afin qu'un lecteur d'écran le passe.

Si un critère n'apparaît nulle part sur cette page, considérez-le comme non
vérifié plutôt que comme respecté.
