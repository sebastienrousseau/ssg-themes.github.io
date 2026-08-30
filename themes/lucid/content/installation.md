---
author: "SSG Theme Suite"
date: "2026-08-30"
language: "en"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
locale_path: "/lucid/"
base_path: "/lucid/"
en_current: " aria-current=\"true\""
fr_current: ""
slug_install: "installation"
slug_config: "configuration"
slug_a11y: "accessibility"
label_skip: "Skip to main content"
label_menu: "Menu"
label_nav: "Main"
label_langs: "Language"
label_theme: "Theme"
label_theme_system: "System"
label_docs: "Documentation"
label_footer_nav: "Documentation"
label_docs_nav: "Documentation sections"
label_crumbs: "Breadcrumb"
label_pager: "Page"
label_prev: "Previous"
label_next: "Next"
label_toc: "On this page"
nav_home: "Home"
nav_install: "Installation"
nav_config: "Configuration"
nav_a11y: "Accessibility"
name: "Lucid"
short_name: "LU"
footer_note: "A documentation theme for Static Site Generator, published under MIT or Apache-2.0."
copyright: "© 2026 SSG Theme Suite. Licensed under MIT or Apache-2.0."
screenshot_alt: "The Lucid documentation theme, showing side navigation, a reading column and an in-page contents list."
translation_key: "install"
title: "Installation — Lucid"
description: "Install the Lucid documentation theme for Static Site Generator and build the site in one command."
keywords: "install lucid theme, ssg documentation theme setup"
eyebrow: "Getting started"
headline: "Installation"
lead: "Copy the theme into your site, point the generator at its configuration, and build. There is no package to install and no build step of its own."
toc_1: "Requirements"
toc_1_id: "requirements"
toc_2: "Add the theme"
toc_2_id: "add-the-theme"
toc_3: "Build the site"
toc_3_id: "build-the-site"
cur_install: " aria-current=\"page\""
cur_config: ""
cur_a11y: ""
prev_href: "/lucid/"
prev_label: "Home"
next_href: "/lucid/configuration/"
next_label: "Configuration"
layout: "doc"
---

## Requirements

Lucid needs the `ssg` binary, version 0.0.56 or newer, and nothing else. There is no Node toolchain, no bundler and no package manager step — the theme is Markdown, HTML templates and one stylesheet.

Check what you have:

```bash
ssg --version
```

## Add the theme

Copy the `lucid` directory into your site's `themes/` directory:

```bash
cp -r themes/lucid /path/to/your-site/themes/
```

The theme brings its own `ssg.toml`. Point it at where your content and output should live by editing three keys:

| Key | What it does |
| --- | --- |
| `content_dir` | Where your Markdown lives |
| `template_dir` | The theme's `_layouts` directory |
| `output_dir` | Where the built site is written |

## Build the site

Run the generator against the theme's configuration:

```bash
ssg --config themes/lucid/ssg.toml
```

The output is a complete static site: no runtime, no server requirements, and no JavaScript needed to read it. Continue to [Configuration](/lucid/configuration/) to set your own navigation labels and locales.
