---
name: "Kinetic"
short_name: "KN"
title: "Kinetic — work-platform marketing theme for SSG"
description: "A multi-product SaaS marketing theme for Static Site Generator: hero, tabbed platform tour, feature grid and pricing table, with AAA-gated colour and nothing loaded from anyone else’s server."
keywords: "kinetic, ssg theme, saas marketing theme, work platform, static site generator"
author: "SSG Theme Suite"
date: "2026-08-15"
news_publication_date: "2026-08-15"
layout: "index"
language: "en-GB"
schema: "page"
changefreq: "weekly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_home: "true"
eyebrow: "Work platform"
headline: "Everything the team is doing, in one place"
lead: "Kinetic is a marketing theme for a multi-product SaaS: a hero, a tabbed platform tour, a feature grid and a pricing table — all of it static, all of it usable without JavaScript."
cta_primary: "Talk to us"
cta_secondary: "Tour the platform"
---

## What this theme is

Kinetic is the marketing front of a fictional work platform. The product,
the customers and the figures are illustrative: they exist to exercise the
components, not to describe a real company.

The category it belongs to — multi-product SaaS marketing — usually reaches
for saturated gradients and large type. Kinetic keeps both, but confines the
gradients to decoration. Nothing legible is ever placed on one, because a
gradient cannot be contrast-checked, and every colour that carries meaning
comes from a token gated at AAA.

## What is different about it

Two components here are progressive enhancements rather than components that
require JavaScript. The platform tour is four ordinary sections that a small
module turns into a tab strip; the pricing table is a complete monthly table
that a module teaches to show annual rates. In both cases the version
without scripting is the whole answer, not a fallback.

That constraint is also why the tab markup carries no `role="tab"` in the
HTML. ARIA tab roles promise arrow-key navigation that only the script can
deliver — announcing it statically and then not honouring it is worse than
a plain stack of sections.
