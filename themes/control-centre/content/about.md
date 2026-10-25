---
name: "Control Centre"
author: "SSG Theme Suite"
language: "en-GB"
lang_code: "EN"
lang_change: "Change language"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
theme_style: "style-control-centre"
theme_colour: "#3b2fb8"
brand_mark: "CC"
brand_tagline: "MCP estate"
footer_note: "Demonstration dashboard for Example Co., a fictional company. Every name, host and figure is invented."
locale_path: "/control-centre/"
base_path: "/control-centre/"
en_current: ' aria-current="true"'
fr_current: ""
label_skip: "Skip to main content"
label_home: "Control Centre home"
label_menu: "Menu"
label_nav: "Dashboard"
label_langs: "Language"
label_theme: "Change colour theme"
label_theme_light: "Light"
label_theme_dark: "Dark"
label_theme_system: "System"
label_search: "Search this site"
search_placeholder: "Search servers, findings…"
label_explore: "Explore"
label_start: "Report an issue"
label_demo_content: "Demonstration content."
label_made_with: "Made with SSG"
crumb_root: "Example Co. · MCP estate"
nav_group_estate: "Estate"
nav_group_site: "Site"
nav_overview: "Overview"
nav_findings: "Findings"
nav_findings_count: "4"
nav_servers: "MCP servers"
nav_servers_count: "4"
nav_mitigation: "Mitigation"
nav_about: "About"
nav_contact: "Contact"
snapshot_title: "Offline snapshot"
snapshot_time: "2026-10-14 09:00 UTC"
snapshot_note: "Read-only view of captured configuration. Nothing here is live."
slug_about: "about"
slug_contact: "contact"
title: "About Control Centre: an operations dashboard theme for SSG"
description: "What the Control Centre theme is for, how its status ring and severity palette work, and how to replace the demonstration data."
date: "2026-10-14"
layout: "page"
translation_key: "about"
current_about: "true"
eyebrow: "About the theme"
headline: "One screen for the state of a system."
lead: "Control Centre is a dashboard-shaped theme for status, security and operations reports that publish as static pages."
---
## What it is for

Control Centre lays out a report the way an operations console does: a sidebar of places to go, a top bar with search and the colour mode, and a main column that starts with the one thing that needs attention. Below that sit a status ring with the systems on either side, a row of key figures, and panels for findings, steps and tables.

The demonstration is the MCP estate of Example Co., a fictional company: three agents, four servers on example domains, and invented findings. Replace it with your own data.

## How the data gets in

Everything on the overview comes from the page's front matter or its Markdown body, so an English and a French page are the same layout with different text.

- The ring, the lists either side and the key figures are front-matter fields such as `server_1_name`, `server_1_sev` and `kpi_1_value`.
- Each arc of the ring is a share of a 100-unit circle: `ring_1_dash` is its length and `ring_1_offset` where it starts.
- Findings, steps and tables are Markdown in the page body, with `<span class="pill sev-high">` for a severity pill.

## The severity palette

Five levels, `critical`, `high`, `medium`, `low` and `ok`, each with a solid colour for dots, arcs and flows and a tint-and-ink pair for pills. Every text pair clears 7:1 in light and dark, and every solid colour clears 3:1 against the surfaces it sits on; `scripts/contrast.py` checks both on every commit. Severity is always written as a word as well, so colour is never the only signal.

## What it does not do

It is a static page. Nothing on it updates by itself: rebuild the site when the data changes.
