---
name: "Prism"
short_name: "PR"
title: "Développeurs — Prism"
description: "Spécifications OpenAPI, SDK typés et bac à sable local : ce dont une équipe a besoin pour intégrer la plateforme."
keywords: "prism developers page, api documentation example, ssg theme code block"
author: "SSG Theme Suite"
date: "2026-09-13"
news_publication_date: "2026-09-13"
layout: "page"
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
schema: "page"
changefreq: "monthly"
copyright_year: "2026"
form_origin: "https://example.com"
nav_developers: "true"
eyebrow: "Développeurs"
headline: "Intégrer en quelques minutes"
lead: "Des spécifications propres, des SDK typés et un bac à sable qui tient dans un binaire."
label_theme: "Thème"
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
ui_products: "Produits"
ui_products_menu: "Menu Produits"
ui_core_ledger_engine: "Moteur de registre central"
ui_multi_asset_settlement_with: "Règlement multi-actifs avec une stricte cohérence en partie double."
ui_global_treasury: "Trésorerie mondiale"
ui_multi_currency_accounts_with: "Comptes multidevises avec équilibrage automatique de la liquidité."
ui_subscription_billing: "Facturation par abonnement"
ui_usage_based_contracts_recurring: "Contrats à l'usage, facturation récurrente et relances."
ui_marketplace_settlements: "Règlements de place de marché"
ui_split_disbursements_fee_deductions: "Versements fractionnés, déduction des frais et rails locaux."
ui_solutions: "Solutions"
ui_solutions_menu: "Menu Solutions"
ui_software_platforms: "Plateformes logicielles"
ui_embedded_banking_for_multi: "Banque intégrée pour les logiciels multilocataires."
ui_sustainable_finance: "Finance durable"
ui_carbon_audited_rails_and: "Rails audités carbone et reporting de gouvernance."
ui_private_wealth: "Gestion privée"
ui_digital_custody_with_multi: "Conservation numérique avec contrôles multisignataires."
ui_global_commerce: "Commerce mondial"
ui_localised_checkout_in_140: "Paiement localisé sur 140 marchés."
ui_developers: "Développeurs"
ui_developers_menu: "Menu Développeurs"
ui_api_documentation: "Documentation de l'API"
ui_openapi_schemas_references_and: "Schémas OpenAPI, références et démarrages rapides."
ui_sdks_amp_cli: "SDK &amp; CLI"
ui_typescript_python_rust_and: "Clients TypeScript, Python, Rust et Go."
ui_real_time_webhooks: "Webhooks en temps réel"
ui_signed_event_streams_with: "Flux d'événements signés, avec relances automatiques."
ui_local_sandbox: "Bac à sable local"
ui_the_whole_platform_in: "Toute la plateforme dans un binaire, avec des données de test."
ui_governance: "Gouvernance"
ui_book_a_platform_consultation: "Demander une présentation"
ui_primary: "Principale"
ui_products_2: "Produits"
ui_core_ledger_engine_2: "Moteur de registre central"
ui_global_treasury_2: "Trésorerie mondiale"
ui_subscription_billing_2: "Facturation par abonnement"
ui_marketplace_settlements_2: "Règlements de place de marché"
ui_risk_amp_heuristic_guard: "Risque &amp; garde heuristique"
ui_solutions_2: "Solutions"
ui_software_platforms_2: "Plateformes logicielles"
ui_sustainable_finance_2: "Finance durable"
ui_private_wealth_2: "Gestion privée"
ui_global_commerce_2: "Commerce mondial"
ui_developers_2: "Développeurs"
ui_api_documentation_2: "Documentation de l'API"
ui_sdks_amp_cli_2: "SDK &amp; CLI"
ui_webhooks: "Webhooks"
ui_local_sandbox_2: "Bac à sable local"
ui_governance_2: "Gouvernance"
ui_security: "Sécurité"
ui_accessibility: "Accessibilité"
ui_static_site_generator: "Static Site Generator"
ui_systems_operational_99_999: "Systèmes opérationnels — 99,999 % de disponibilité sur douze mois. Chiffre illustratif."
ui_made_with_ssg: "Réalisé avec SSG"
ui_language: "Langue"
locale_path: "/prism/fr/"
base_path: "/prism/"
en_current: ""
fr_current: ' aria-current="true"'
translation_key: "developers"
slug_contact: "contact"
slug_developers: "developpeurs"
slug_governance: "gouvernance"
slug_products: "produits"
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
