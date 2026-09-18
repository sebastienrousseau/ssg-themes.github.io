---
name: "Vista"
short_name: "PR"
title: "Contact — Vista"
description: "A worked example of a contact page with a real form endpoint and a same-origin content security policy."
keywords: "vista contact page, contact form example"
author: "SSG Theme Suite"
date: "2026-09-16"
news_publication_date: "2026-09-16"
layout: "contact"
language: "en-GB"
lang_code: "EN"
lang_change: "Change language"
schema: "page"
changefreq: "yearly"
copyright_year: "2026"
form_origin: "https://example.com"
form_action: "https://example.com/enquiries"
nav_contact: "true"
eyebrow: "Advisory"
headline: "Tell us what you are building"
lead: "The form below posts to the endpoint named in this page’s front matter. Point it at your own before deploying."
label_theme: "Theme"
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
ui_features: "Features"
ui_specifications: "Specifications"
ui_primary: "Primary"
ui_features_2: "Features"
ui_specifications_2: "Specifications"
ui_json_feed: "JSON Feed"
ui_built_with: "Built with"
ui_static_site_generator: "Static Site Generator"
ui_made_with_ssg: "Made with SSG"
ui_language: "Language"
locale_path: "/vista/"
base_path: "/vista/"
en_current: ' aria-current="true"'
fr_current: ""
translation_key: "contact"
slug_contact: "contact"
slug_features: "features"
slug_specs: "specs"
---

## Before you deploy this page

Two fields need changing, and the page does not work until they are:

`form_action` is where the submission goes. Until you set it, the form
posts to a placeholder that will not accept it.

`form_origin` must name the same endpoint, because the page ships a strict
`form-action` content security policy. If the two disagree the browser
blocks the POST — deliberately, and silently as far as the visitor is
concerned, so check both together.
