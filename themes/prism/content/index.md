---
name: "Prism"
short_name: "PR"
title: "Prism — financial-infrastructure marketing theme for SSG"
description: "A financial-infrastructure marketing theme for SSG: navy masthead with disclosure menus, a sloped hero, product grids and a developer code panel, gated at WCAG AAA."
keywords: "prism, ssg theme, fintech marketing theme, financial infrastructure, static site generator"
author: "SSG Theme Suite"
date: "2026-09-13"
news_publication_date: "2026-09-13"
layout: "index"
language: "en-GB"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_home: "true"
eyebrow: "Financial infrastructure"
headline: "Financial infrastructure for the modern enterprise"
lead: "Prism is a marketing theme for a fictional payments and treasury platform: multi-currency routing, revenue contracts and settlement rails, presented on a navy-and-luminous-blue design system that is gated at AAA and loads nothing from anyone else’s server."
cta_primary: "Book a platform consultation"
cta_secondary: "Explore the products"
label_theme: "Theme"
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
---

## What this theme is

Prism is the marketing front of a fictional financial-infrastructure
company. The products, the partners and the figures are illustrative: they
exist to exercise the components, not to describe a real business.

The category it belongs to — enterprise fintech — conventionally opens with
a dark masthead over a saturated mesh gradient, a sloped hero and a
composition of floating product mock-ups. Prism keeps all three, but the
gradient sits behind the mock-ups only, never behind text, because a
gradient cannot be contrast-checked. Every glyph on every page takes its
colour from a token gated at 7:1.

## What is different about it

The mega-menu is two controls per item rather than one. "Products" is a
link to the products page, which works without JavaScript and is what a
crawler follows; the chevron beside it is a button with `aria-expanded`
that opens the panel. Hover opens it too, for pointer users, but nothing
depends on hover.

The settlement stream at the foot of the home page was an auto-scrolling
marquee in the template this theme grew from. It is a static, wrapping list
here: a strip that scrolls forever needs a pause control under WCAG 2.2.2,
and its `max-content` track was wider than every viewport the reflow gate
measures.
