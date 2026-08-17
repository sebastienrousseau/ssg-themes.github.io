---
name: "Kinetic"
short_name: "KN"
title: "Contact — Kinetic"
description: "A worked example of a contact page with a real form endpoint and a same-origin content security policy."
keywords: "kinetic contact page, contact form example"
author: "SSG Theme Suite"
date: "2026-08-15"
news_publication_date: "2026-08-15"
layout: "contact"
language: "en-GB"
schema: "page"
changefreq: "yearly"
copyright_year: "2026"
form_origin: "https://example.com"
form_action: "https://example.com/enquiries"
nav_contact: "true"
eyebrow: "Contact"
headline: "Tell us what you are trying to build"
lead: "The form below posts to the endpoint named in this page’s front matter. Point it at your own before deploying."
---

## Before you deploy this page

Two fields need changing, and the page does not work until they are:

`form_action` is where the submission goes. Until you set it, the form
posts to a placeholder that will not accept it.

`form_origin` must name the same endpoint, because the page ships a strict
`form-action` content security policy. If the two disagree the browser
blocks the POST — deliberately, and silently as far as the visitor is
concerned, so check both together.
