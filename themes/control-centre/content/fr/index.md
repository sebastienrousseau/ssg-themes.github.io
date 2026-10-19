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
ring_value: "4"
ring_1_sev: "critical"
ring_1_count: "1"
ring_1_dash: "21"
ring_1_offset: "2"
ring_2_sev: "high"
ring_2_count: "1"
ring_2_dash: "21"
ring_2_offset: "27"
ring_3_sev: "medium"
ring_3_count: "1"
ring_3_dash: "21"
ring_3_offset: "52"
ring_4_sev: "ok"
ring_4_count: "1"
ring_4_dash: "21"
ring_4_offset: "77"
client_1_mark: "DA"
client_1_name: "desk-agent"
client_1_sev: "critical"
client_2_mark: "OA"
client_2_name: "ops-agent"
client_2_sev: "high"
client_3_mark: "IA"
client_3_name: "ide-agent"
client_3_sev: "ok"
server_1_mark: "CR"
server_1_name: "crm.example.com"
server_1_sev: "critical"
server_1_score: "41"
server_2_mark: "TK"
server_2_name: "tickets.example.net"
server_2_sev: "high"
server_2_score: "63"
server_3_mark: "ML"
server_3_name: "mail.example.org"
server_3_sev: "medium"
server_3_score: "78"
server_4_mark: "FS"
server_4_name: "files.example.com"
server_4_sev: "ok"
server_4_score: "95"
kpi_1_sev: "critical"
kpi_1_value: "1"
kpi_2_sev: "high"
kpi_2_value: "6"
kpi_3_sev: "low"
kpi_3_value: "3/4"
kpi_4_sev: "ok"
kpi_4_value: "69"
title: "Control Centre : un thème de tableau de bord d’exploitation et de sécurité pour SSG"
description: "Le parc MCP d’une entreprise fictive en tableau de bord : anneau d’état, flux des agents vers les serveurs, indicateurs, pastilles de sévérité et tableaux de preuves."
keywords: "thème tableau de bord, sécurité, exploitation, MCP, thème SSG"
date: "2026-10-14"
layout: "index"
translation_key: "home"
current_home: "true"
eyebrow: "Vue d’ensemble"
headline: "Centre de contrôle MCP"
lead: "Quels agents atteignent quels serveurs, ce qui a échoué et quoi corriger en premier, sur un seul écran."
note_label: "Partageable"
note_text: "Les hôtes sont des domaines d’exemple et chaque chiffre est une donnée de démonstration."
alert_kicker: "Constat critique :"
alert_title: "crm.example.com accepte des appels d’outils non authentifiés."
alert_text: "desk-agent est configuré pour l’atteindre. La preuve date de 3 jours ; elle expire après 30."
alert_cta_primary: "Ouvrir le plan de remédiation"
alert_cta_secondary: "Voir tous les constats"
map_title: "Agents, serveurs et leur état"
clients_title: "Agents configurés"
servers_title: "Serveurs MCP"
client_1_meta: "3 chemins d’outils"
client_2_meta: "4 chemins d’outils"
client_3_meta: "2 chemins d’outils"
server_1_meta: "1 constat critique"
server_2_meta: "Outils trop privilégiés"
server_3_meta: "Preuve périmée"
server_4_meta: "Aucun contrôle en échec"
ring_caption: "serveurs dans le parc"
ring_legend: "Serveurs par état :"
ring_1_label: "critique"
ring_2_label: "élevé"
ring_3_label: "moyen"
ring_4_label: "conforme"
kpi_title: "Chiffres clés"
kpi_1_label: "Constats critiques"
kpi_1_note: "À corriger avant la prochaine version"
kpi_2_label: "Outils en écriture"
kpi_2_note: "Non déclarés en lecture seule"
kpi_3_label: "Serveurs avec preuve"
kpi_3_note: "Un serveur n’en a aucune"
kpi_4_label: "Score moyen"
kpi_4_note: "Sur 100, serveurs notés uniquement"
---
<section class="cc-panel cc-span-7" id="findings" aria-labelledby="findings-heading">
<div class="cc-panel-head"><h2 id="findings-heading">Constats</h2><p>4 ouverts, du plus récent au plus ancien</p></div>
<div class="cc-table" role="region" aria-labelledby="findings-heading" tabindex="0">

| Constat | Chemin | Sévérité | Âge |
| --- | --- | --- | --- |
| Appels d’outils non authentifiés acceptés | desk-agent → crm.example.com | <span class="pill sev-critical">Critique</span> | 3 jours |
| Outil de suppression non déclaré destructif | ops-agent → tickets.example.net | <span class="pill sev-high">Élevée</span> | 9 jours |
| Preuve de plus de 30 jours | desk-agent → mail.example.org | <span class="pill sev-medium">Moyenne</span> | 41 jours |
| Descriptions d’outils absentes | ide-agent → files.example.com | <span class="pill sev-low">Faible</span> | 12 jours |

</div>
</section>

<section class="cc-panel cc-span-5" id="mitigation" aria-labelledby="mitigation-heading">
<div class="cc-panel-head"><h2 id="mitigation-heading">Plan de remédiation</h2><p>4 étapes</p></div>
<ol class="cc-steps">
<li><strong>Examiner la preuve</strong> Ouvrez le journal des requêtes de crm.example.com et confirmez l’appel réussi sans jeton.</li>
<li><strong>Exiger l’authentification</strong> Activez la vérification des jetons pour chaque outil, ou retirez le serveur de desk-agent en attendant.</li>
<li><strong>Vérifier la correction</strong> Relancez le même contrôle et joignez la nouvelle preuve au constat.</li>
<li><strong>Clore et consigner</strong> Marquez le constat comme résolu et exportez le rapport pour le journal des changements.</li>
</ol>
</section>

<section class="cc-panel cc-span-12" id="servers" aria-labelledby="servers-heading">
<div class="cc-panel-head"><h2 id="servers-heading">Serveurs MCP</h2><p>4 configurés, notés à partir des preuves fournies</p></div>
<div class="cc-table" role="region" aria-labelledby="servers-heading" tabindex="0">

| Serveur | Atteint par | Outils | Preuve | État | Score |
| --- | --- | --- | --- | --- | --- |
| crm.example.com | desk-agent | 7 | 3 jours | <span class="pill sev-critical">Critique</span> | 41 |
| tickets.example.net | ops-agent | 9 | 9 jours | <span class="pill sev-high">Élevée</span> | 63 |
| mail.example.org | desk-agent, ops-agent | 5 | 41 jours | <span class="pill sev-medium">Périmée</span> | 78 |
| files.example.com | ide-agent | 4 | 2 jours | <span class="pill sev-ok">Conforme</span> | 95 |

</div>
</section>
