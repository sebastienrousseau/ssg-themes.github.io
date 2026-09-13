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
- [Accessibility & Compliance](#accessibility--compliance) — 100% WCAG 2.1 AAA and Lighthouse scores

**Operational**

- [Development](#development) — make targets, quality gates, and automated testing
- [Security](#security) — Subresource Integrity (SRI) and Content Security Policy (CSP)
- [License](#license) — dual Apache-2.0 and MIT licensing

---

## Themes

Nine themes ship in this repository. Every one is held to the same
gates: WCAG AAA colour, a page-weight budget, and no third-party
requests.

| Theme | Category | Description |
| --- | --- | --- |
| [Apex](themes/apex/) | Portfolio | Executive portfolio theme: template inheritance, AAA-gated colour tokens, zero third-party requests. |
| [Atlas](themes/atlas/) | Publication | Editorial and knowledge-hub theme: serif reading column, citation-friendly structure, AAA-gated tokens. |
| [Kaishi](themes/kaishi/) | Portfolio | Apple-inspired starter theme: translucent sticky header, pill controls and a soft card geometry, on a colour system gated at WCAG AAA. |
| [Kinetic](themes/kinetic/) | Marketing | Work-platform marketing theme: hero, tabbed platform tour, feature grid and island-enhanced pricing, AAA-gated tokens. |
| [Lucid](themes/lucid/) | Documentation | Documentation theme in the U.S. Web Design System documentation-page pattern: side navigation, in-page contents, prev/next pagination, AAA-gated tokens, multilingual. |
| [Quill](themes/quill/) | Blog | Typographic blog theme: a large tight-tracked wordmark, full-bleed hero, two-column post headers and a monochrome palette. AAA-gated tokens, English and French. |
| [Stablo](themes/stablo/) | Blog | Editorial blog theme: centred wordmark, large featured cards, category labels and author bylines. AAA-gated tokens, English and French. |
| [Velocity](themes/velocity/) | Marketing | Product and starter theme: smallest useful layout set, no build toolchain, AAA-gated tokens. |
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

Run automated regression tests and the 10-pillar quality audit:

```bash
# Run repository regression test
python3 scripts/regression-test.py

# Run portfolio master quality gate
make test
```

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
