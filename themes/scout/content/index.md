---
name: "Scout"
short_name: "SC"
title: "Scout — diagnostic instrument theme for SSG"
description: "A measured theme for verification tools: severity ledgers, evidence tables and a readout hero that puts the verdict first."
keywords: "diagnostic theme, security scanner theme, developer tools theme, MCP server testing, SSG theme"
author: "SSG Theme Suite"
date: "2026-09-16"
layout: "index"
language: "en-GB"
lang_code: "EN"
lang_change: "Change language"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
theme_style: "style-scout"
theme_colour: "#0a5f68"
brand_mark: "S"
footer_note: "A verdict is worth what its evidence is worth."
eyebrow: "Protocol diagnostics · runs on your machine"
headline: "Test any server. Nothing leaves your machine."
lead: "A theme for tools that inspect, verify and grade — built around the one thing a hosted scanner cannot offer: the run happens where your credentials already live."
cta_primary: "Read the findings"
cta_secondary: "See a sample report"
readout_kicker: "Last run"
readout_target: "https://mcp.example.com/mcp"
readout_verdict: "Ready, with room to improve"
readout_score: "84"
readout_grade: "Good"
readout_note: "Nine phases · 76 checks · 50 requests · every finding tied to one of them"
metric_one_label: "Checks per run"
metric_one_value: "76"
metric_two_label: "Requests to the server"
metric_two_value: "50"
metric_three_label: "Credentials uploaded"
metric_three_value: "None"
proof_note: "Figures are illustrative theme content. Replace them with your own instrument's real numbers and state the method you measured them by."
why_eyebrow: "Why local"
why_title: "A scanner you upload to is a scanner you trust twice."
why_lead: "Handing an endpoint to a hosted tester means handing over whatever reaches it. For a server behind OAuth, that is a working credential. The alternative is not a weaker test — it is the same test, run from inside your own trust boundary."
why_one_title: "Your credentials stay put"
why_one_text: "The tool authenticates from your machine with the token you already hold. Nothing is transmitted to a third party, so nothing has to be revoked afterwards."
why_two_title: "Your network is the network"
why_two_text: "A server on a private address, behind a VPN or inside a CI runner is reachable exactly as your agents will reach it. A hosted scanner can only test what it can route to."
why_three_title: "The evidence stays with you"
why_three_text: "Wire logs, headers and timings are written beside the report. You can read them, diff them and keep them, rather than trusting a summary of a run you cannot inspect."
ledger_eyebrow: "Severity ledger"
ledger_title: "Every deduction named."
ledger_lead: "A grade with no arithmetic behind it is a brand, not a measurement. The ledger shows the categories, their weights and what each one lost."
evidence_eyebrow: "Evidence"
evidence_title: "Nothing passes without a request that showed it."
evidence_lead: "Each finding carries the numbered exchange that produced it, so a reader can follow a verdict back to the bytes on the wire instead of taking it on faith."
phases_eyebrow: "Method"
phases_title: "Nine phases, in the order an agent meets them."
phases_lead: "The sequence matters: a catalog check means nothing if the handshake never completed, and a latency figure means nothing if half the calls failed."
report_eyebrow: "The report"
report_title: "One document, two readers."
report_lead: "An executive summary sits above the fold — verdict, score, what to fix first. The full findings and their evidence follow. One document, so there are not two that drift apart, and it prints to a PDF a board can read."
locale_path: "/scout/"
base_path: "/scout/"
en_current: ' aria-current="true"'
fr_current: ""
label_home: "Scout home"
label_menu: "Menu"
label_nav: "Primary"
label_langs: "Language"
label_theme: "Change colour theme"
label_theme_light: "Light"
label_theme_dark: "Dark"
label_theme_system: "System"
label_explore: "Explore"
label_start: "Start a conversation"
label_demo_content: "Demonstration content."
label_made_with: "Made with SSG"
nav_services: "Services"
nav_work: "Work"
nav_work_long: "Selected work"
nav_about: "About"
nav_contact: "Contact"
slug_about: "about"
slug_contact: "contact"
translation_key: "home"
---

Scout is a diagnostic-instrument theme for tools that inspect and grade
something: a protocol implementation, a server, a dependency graph, an API
contract. It is built for the moment after the run finishes, when a verdict
has to be delivered to two audiences at once — somebody deciding whether to
adopt, and somebody who has to fix it.

The design puts the readout first. A verdict line, a score with its grade,
and the shortest honest description of what is wrong sit above everything
else, because that is what a reader wants before they want detail. Below it,
the method: phases in the order they ran, findings with severity encoded in
form as well as colour, and the numbered evidence that produced each one.

The palette is an instrument palette — a single probe accent against a cool
neutral, with severity colours kept separate from it so that "this is the
brand" and "this is broken" never compete for the same signal. Type is a
system stack by design: the content security policy this theme ships with
forbids third-party requests, and a web font would be one.
