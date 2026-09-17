<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

<p align="center">
  <img src="https://cloudcdn.pro/cmn/v1/logos/cmn.svg" alt="SSG Themes logo" width="128" />
</p>

<h1 align="center">SSG Themes</h1>

<p align="center">
  Official theme repository and starter templates for the Static Site Generator (SSG) ecosystem.
</p>

<p align="center">
  <a href="https://github.com/sebastienrousseau/ssg-themes.github.io/actions"><img src="https://img.shields.io/github/actions/workflow/status/sebastienrousseau/ssg-themes.github.io/ci.yml?style=for-the-badge&logo=github" alt="Build" /></a>
  <a href="https://github.com/sebastienrousseau/ssg-themes.github.io/releases"><img src="https://img.shields.io/github/v/release/sebastienrousseau/ssg-themes.github.io?style=for-the-badge&color=fc8d62&logo=git" alt="Release" /></a>
  <a href="https://static-site-generator.com/"><img src="https://img.shields.io/badge/SSG-0.0.56-66c2a5?style=for-the-badge&labelColor=555555&logo=rust" alt="Built with SSG" /></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/sebastienrousseau/ssg-themes.github.io"><img src="https://img.shields.io/ossf-scorecard/github.com/sebastienrousseau/ssg-themes.github.io?style=for-the-badge&label=OpenSSF%20Scorecard&logo=openssf" alt="OpenSSF Scorecard" /></a>
</p>

---

## Contents

**Getting started**

- [Overview](#overview) — architecture and design principles
- [Quick Start](#quick-start) — build and serve locally in minutes

**Ecosystem & Architecture**

- [Features](#features) — core capabilities and performance highlights
- [Technology Stack](#technology-stack) — SSG, Rust, and modern web standards
- [Accessibility & Compliance](#accessibility--compliance) — 100% WCAG 2.2 AAA and Lighthouse scores

**Operational**

- [Development](#development) — make targets, quality gates, and automated testing
- [Security](#security) — Subresource Integrity (SRI) and Content Security Policy (CSP)
- [License](#license) — dual Apache-2.0 and MIT licensing

---

## Themes

Twenty-two themes ship in this repository. Every one is held to the same
gates: WCAG AAA colour, a page-weight budget, and no third-party
requests.

| Theme | Category | Description |
| --- | --- | --- |
| [Apex](themes/apex/) | Portfolio | Executive portfolio theme: template inheritance, AAA-gated colour tokens, zero third-party requests. |
| [Atlas](themes/atlas/) | Publication | Editorial and knowledge-hub theme: serif reading column, citation-friendly structure, AAA-gated tokens. |
| [Cadence](themes/cadence/) | Marketing | Performance-cycling theme: cinematic dark stage, rider abstraction and evidence-led specifications. |
| [Covenant](themes/covenant/) | Marketing | Private-capital theme: black, ivory and red geometry with rigorous portfolio narratives. |
| [Hearth](themes/hearth/) | Marketing | Furniture-catalogue theme: airy product staging, warm materials and practical ownership content. |
| [Intent](themes/intent/) | Portfolio | Editorial design portfolio: expressive serif type, monochrome fields and a studio-ribbon motif. |
| [Kairo](themes/kairo/) | Portfolio | Creative-direction portfolio: cinematic type, energetic orange geometry and substantial case studies. |
| [Kaishi](themes/kaishi/) | Portfolio | Apple-inspired starter theme: translucent sticky header, pill controls and a soft card geometry, on a colour system gated at WCAG AAA. |
| [Kinetic](themes/kinetic/) | Marketing | Work-platform marketing theme: hero, tabbed platform tour, feature grid and island-enhanced pricing, AAA-gated tokens. |
| [Lucid](themes/lucid/) | Documentation | Documentation theme in the U.S. Web Design System documentation-page pattern: side navigation, in-page contents, prev/next pagination, AAA-gated tokens, multilingual. |
| [Noir](themes/noir/) | Marketing | Streetwear-commerce theme: near-black product staging, hard rules and transparent catalogue information. |
| [Prism](themes/prism/) | Marketing | Financial-infrastructure marketing theme: navy masthead with disclosure menus, sloped hero with product mock-ups, product and solution grids, developer code panel and governance metrics, AAA-gated tokens. |
| [Quill](themes/quill/) | Blog | Typographic blog theme: a large tight-tracked wordmark, full-bleed hero, two-column post headers and a monochrome palette. AAA-gated tokens, English and French. |
| [Curio](themes/curio/) | Marketing | AI-shopping theme: bold commerce type, modular product cards and transparent recommendations. |
| [Scout](themes/scout/) | Developer Tools | Diagnostic-instrument theme: verdict-first readouts, severity ledgers and request-level evidence. |
| [Signal](themes/signal/) | Marketing | Revenue-intelligence theme: luminous dashboard surfaces and grounded, explainable AI copy. |
| [Stablo](themes/stablo/) | Blog | Editorial blog theme: centred wordmark, large featured cards, category labels and author bylines. AAA-gated tokens, English and French. |
| [Steward](themes/steward/) | Marketing | Institutional-finance theme: editorial serif type, a ledger grid and trust-led service narratives. |
| [Velocity](themes/velocity/) | Marketing | Product and starter theme: smallest useful layout set, no build toolchain, AAA-gated tokens. |
| [Visage](themes/visage/) | Marketing | Aesthetic-health theme: clinical whitespace, consent-led copy and a private consultation journey. |
| [Vista](themes/vista/) | Marketing | Spatial-computing product theme: full-bleed dark stage, snap-scrolling feature rail, immersive environment band and silicon spec panel, AAA-gated tokens. |
| [Voxt](themes/voxt/) | Marketing | Developer tools and AI environment showcase theme: high-contrast terminal IDE dock preview, AAA colour tokens, zero third-party requests. |

Each links to its own README for installation and layout details.

---
## Overview

`ssg-themes.github.io` is engineered for speed, privacy, and accessibility. Built with **Static Site Generator (SSG)** and the **Skeletonic Design System**, it delivers lightning-fast static page generation, zero third-party tracking cookies, and responsive Apple Human Interface Guidelines (HIG) navigation.

---

## Quick Start

### Prerequisites

Ensure you have `ssg` installed via Cargo:

```bash
cargo install ssg
```

### Local Build & Development

Clone the repository and compile the static assets:

```bash
git clone https://github.com/sebastienrousseau/ssg-themes.github.io.git
cd ssg-themes.github.io

# Compile with Static Site Generator (SSG)
ssg build --content _posts --template _layouts --output docs

# Or serve locally using Makefile
make serve
```

---

## Features

- **Static Site Generator (SSG) Compilation**: High-throughput Markdown and Tera template processing with pre-rendered HTML.
- **Apple HIG Responsive Navigation**: Sticky blur glass header with horizontal/vertical element alignment, squarcle buttons, and mobile hamburger drawer.
- **Subresource Integrity (SRI)**: SHA-384 cryptographic hashing on all external and internal stylesheets and scripts.
- **Content Security Policy (CSP)**: Hardened security headers restricting unvetted origins while permitting high-performance execution.
- **Full Client Search Engine**: Instant multi-term indexing and live modal search via `search-index.json`.
- **System Theme Auto-Detection**: Instant switching between Light, Dark, and System modes with zero visual flash.
- **100% WCAG AAA Compliance**: High contrast ratios, full keyboard navigation, ARIA landmarks, and semantic heading hierarchies.

---

## Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Static Engine** | [Static Site Generator (SSG)](https://static-site-generator.com/) | High-speed Rust static site generator |
| **Design Framework** | [Skeletonic CSS](https://skeletonic.io) | Minimalist, zero-dependency layout engine |
| **Icons & Assets** | [CloudCDN](https://cloudcdn.pro) | Distributed edge CDN for SVG vector assets |
| **Runtime** | Vanilla ECMAScript | Zero runtime framework overhead |

---

## Development

Build every theme, then run the gates. `make check` is the whole suite and is
what CI runs; the individual targets are there for a faster loop while you
work on one thing.

```bash
make build              # build all themes into public/
make check              # every gate: structure, contrast, weight, audit,
                        # responsive, AAA, links, pa11y, schema
make check-lighthouse   # Lighthouse over the gallery and all themes
make screenshots        # recapture the gallery screenshots from the build
```

Each gate reports what it measured, not just a pass: `make check` prints the
number of pages audited, token pairs compared and renders checked, so a gate
that silently stopped testing anything is visible as a dropped count.

---

## Security

Every deployment adheres to strict security and integrity standards:

- **Zero Inline Code Execution**: All scripts are isolated and digest-verified.
- **Cryptographic Asset Integrity**: Guaranteed Subresource Integrity via SHA-384 digests.
- **Privacy by Default**: No user tracking, analytics cookies, or third-party fingerprinting.

---

## License

Copyright © 2024 - 2026 Sebastien Rousseau. All rights reserved.

Licensed under the Apache License, Version 2.0 or the MIT license at your option.
