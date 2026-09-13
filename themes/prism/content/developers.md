---
name: "Prism"
short_name: "PR"
title: "Developers — Prism"
description: "API documentation, SDKs, webhooks and a local sandbox, as a worked example of Prism’s prose and fenced code-block styling."
keywords: "prism developers page, api documentation example, ssg theme code block"
author: "SSG Theme Suite"
date: "2026-09-13"
news_publication_date: "2026-09-13"
layout: "page"
language: "en-GB"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_developers: "true"
eyebrow: "Developers"
headline: "Integrate financial primitives in minutes, not months"
lead: "Type-safe SDKs, an OpenAPI specification and a local sandbox. The code below is illustrative and calls no real service; it is here to show how the theme renders a fenced code block."
label_theme: "Theme"
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
---

## API Documentation

Every endpoint is described in an OpenAPI 3.1 document, from which the
reference pages, the SDK types and the request validator are all generated.
There is one source, so the documentation cannot describe a field the API
no longer accepts.

## SDKs & CLI

Client libraries for TypeScript, Python, Rust and Go, each generated from
the same specification and each shipped with its types. A settlement in the
TypeScript client looks like this:

```ts
import { PrismClient } from "@prism/sdk";

const prism = new PrismClient({
  apiKey: process.env.PRISM_SECRET_KEY,
  environment: "sandbox",
});

const settlement = await prism.treasury.settlements.create({
  sourceAccount: "acct_prime_9421",
  destinationAccount: "acct_meridian_0814",
  amount: { value: 45_000_000, currency: "EUR" },
  compliance: { esgTracking: true, auditTag: "Q3_CAPITAL" },
});

console.log(settlement.referenceId);
```

## Real-time Webhooks

Event streams are signed with a per-endpoint key and delivered with an
idempotency header, so a retry can be recognised rather than processed
twice. Delivery is retried on an exponential schedule for 72 hours and
every attempt is visible in the dashboard.

## Static Architecture

The customer-facing surfaces are compiled ahead of time and served as
static files with subresource integrity. The theme you are reading is built
the same way, by the same generator, and passes the same gates.

## Local Sandbox

A single binary runs the whole platform locally with deterministic test
data: fixed exchange rates, a clock you can set, and every failure mode
reachable by a documented account number.
