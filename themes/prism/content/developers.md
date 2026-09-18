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
lang_code: "EN"
lang_change: "Change language"
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
ui_products: "Products"
ui_products_menu: "Products menu"
ui_core_ledger_engine: "Core Ledger Engine"
ui_multi_asset_settlement_with: "Multi-asset settlement with strict double-entry consistency."
ui_global_treasury: "Global Treasury"
ui_multi_currency_accounts_with: "Multi-currency accounts with automated liquidity balancing."
ui_subscription_billing: "Subscription Billing"
ui_usage_based_contracts_recurring: "Usage-based contracts, recurring invoicing and dunning."
ui_marketplace_settlements: "Marketplace Settlements"
ui_split_disbursements_fee_deductions: "Split disbursements, fee deductions and local rails."
ui_solutions: "Solutions"
ui_solutions_menu: "Solutions menu"
ui_software_platforms: "Software Platforms"
ui_embedded_banking_for_multi: "Embedded banking for multi-tenant software."
ui_sustainable_finance: "Sustainable Finance"
ui_carbon_audited_rails_and: "Carbon-audited rails and governance reporting."
ui_private_wealth: "Private Wealth"
ui_digital_custody_with_multi: "Digital custody with multi-signatory controls."
ui_global_commerce: "Global Commerce"
ui_localised_checkout_in_140: "Localised checkout in 140 markets."
ui_developers: "Developers"
ui_developers_menu: "Developers menu"
ui_api_documentation: "API Documentation"
ui_openapi_schemas_references_and: "OpenAPI schemas, references and quickstarts."
ui_sdks_amp_cli: "SDKs &amp; CLI"
ui_typescript_python_rust_and: "TypeScript, Python, Rust and Go clients."
ui_real_time_webhooks: "Real-time Webhooks"
ui_signed_event_streams_with: "Signed event streams with automatic retries."
ui_local_sandbox: "Local Sandbox"
ui_the_whole_platform_in: "The whole platform in one binary, with test data."
ui_governance: "Governance"
ui_book_a_platform_consultation: "Book a platform consultation"
ui_primary: "Primary"
ui_products_2: "Products"
ui_core_ledger_engine_2: "Core Ledger Engine"
ui_global_treasury_2: "Global Treasury"
ui_subscription_billing_2: "Subscription Billing"
ui_marketplace_settlements_2: "Marketplace Settlements"
ui_risk_amp_heuristic_guard: "Risk &amp; Heuristic Guard"
ui_solutions_2: "Solutions"
ui_software_platforms_2: "Software Platforms"
ui_sustainable_finance_2: "Sustainable Finance"
ui_private_wealth_2: "Private Wealth"
ui_global_commerce_2: "Global Commerce"
ui_developers_2: "Developers"
ui_api_documentation_2: "API Documentation"
ui_sdks_amp_cli_2: "SDKs &amp; CLI"
ui_webhooks: "Webhooks"
ui_local_sandbox_2: "Local Sandbox"
ui_governance_2: "Governance"
ui_security: "Security"
ui_accessibility: "Accessibility"
ui_static_site_generator: "Static Site Generator"
ui_systems_operational_99_999: "Systems operational — 99.999% availability, trailing year. Illustrative."
ui_made_with_ssg: "Made with SSG"
ui_language: "Language"
locale_path: "/prism/"
base_path: "/prism/"
en_current: ' aria-current="true"'
fr_current: ""
translation_key: "developers"
slug_contact: "contact"
slug_developers: "developers"
slug_governance: "governance"
slug_products: "products"
slug_solutions: "solutions"
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
