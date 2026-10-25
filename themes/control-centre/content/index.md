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
title: "Control Centre: an operations and security dashboard theme for SSG"
description: "A fictional company's MCP estate as a control-centre dashboard: status ring, flows from agents to servers, KPI tiles, severity pills and evidence tables."
keywords: "dashboard theme, security dashboard, operations theme, MCP, SSG theme"
date: "2026-10-14"
layout: "index"
translation_key: "home"
current_home: "true"
eyebrow: "Overview"
headline: "MCP Control Centre"
lead: "Which agents reach which servers, what failed, and what to fix first, on one screen."
note_label: "Share-safe"
note_text: "Hosts are example domains and every figure is demonstration data."
alert_kicker: "Critical finding:"
alert_title: "crm.example.com accepts unauthenticated tool calls."
alert_text: "desk-agent is configured to reach it. Evidence is 3 days old; it goes stale after 30."
alert_cta_primary: "Open the mitigation path"
alert_cta_secondary: "See all findings"
map_title: "Agents, servers and their status"
clients_title: "Configured agents"
servers_title: "MCP servers"
client_1_meta: "3 tool paths"
client_2_meta: "4 tool paths"
client_3_meta: "2 tool paths"
server_1_meta: "1 critical finding"
server_2_meta: "Over-privileged tools"
server_3_meta: "Stale evidence"
server_4_meta: "No failing checks"
ring_caption: "servers in the estate"
ring_legend: "Servers by status:"
ring_1_label: "critical"
ring_2_label: "high"
ring_3_label: "medium"
ring_4_label: "passing"
kpi_title: "Key figures"
kpi_1_label: "Critical findings"
kpi_1_note: "Fix before the next release"
kpi_2_label: "Write-capable tools"
kpi_2_note: "Not declared read-only"
kpi_3_label: "Servers with evidence"
kpi_3_note: "One server has none"
kpi_4_label: "Mean server score"
kpi_4_note: "Out of 100, scored servers only"
---
<section class="cc-panel cc-span-7" id="findings" aria-labelledby="findings-heading">
<div class="cc-panel-head"><h2 id="findings-heading">Findings</h2><p>4 open, newest first</p></div>
<div class="cc-table" role="region" aria-labelledby="findings-heading" tabindex="0">

| Finding | Path | Severity | Age |
| --- | --- | --- | --- |
| Unauthenticated tool calls accepted | desk-agent → crm.example.com | <span class="pill sev-critical">Critical</span> | 3 days |
| Delete tool not declared destructive | ops-agent → tickets.example.net | <span class="pill sev-high">High</span> | 9 days |
| Evidence older than 30 days | desk-agent → mail.example.org | <span class="pill sev-medium">Medium</span> | 41 days |
| Tool descriptions missing | ide-agent → files.example.com | <span class="pill sev-low">Low</span> | 12 days |

</div>
</section>

<section class="cc-panel cc-span-5" id="mitigation" aria-labelledby="mitigation-heading">
<div class="cc-panel-head"><h2 id="mitigation-heading">Mitigation path</h2><p>4 steps</p></div>
<ol class="cc-steps">
<li><strong>Review the evidence</strong> Open the request log for crm.example.com and confirm the call that succeeded without a token.</li>
<li><strong>Require authentication</strong> Turn on token checks for every tool, or remove the server from desk-agent until they are on.</li>
<li><strong>Verify the fix</strong> Run the same check again and attach the new evidence to the finding.</li>
<li><strong>Close and record</strong> Mark the finding resolved and export the report for the change log.</li>
</ol>
</section>

<section class="cc-panel cc-span-12" id="servers" aria-labelledby="servers-heading">
<div class="cc-panel-head"><h2 id="servers-heading">MCP servers</h2><p>4 configured, scored from supplied evidence</p></div>
<div class="cc-table" role="region" aria-labelledby="servers-heading" tabindex="0">

| Server | Reached by | Tools | Evidence | Status | Score |
| --- | --- | --- | --- | --- | --- |
| crm.example.com | desk-agent | 7 | 3 days | <span class="pill sev-critical">Critical</span> | 41 |
| tickets.example.net | ops-agent | 9 | 9 days | <span class="pill sev-high">High</span> | 63 |
| mail.example.org | desk-agent, ops-agent | 5 | 41 days | <span class="pill sev-medium">Stale</span> | 78 |
| files.example.com | ide-agent | 4 | 2 days | <span class="pill sev-ok">Passing</span> | 95 |

</div>
</section>
