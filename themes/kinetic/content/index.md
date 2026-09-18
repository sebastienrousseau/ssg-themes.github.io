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
lang_code: "EN"
lang_change: "Change language"
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
label_theme: "Theme"
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
ui_platform: "Platform"
ui_solutions: "Solutions"
ui_primary: "Primary"
ui_platform_2: "Platform"
ui_platform_tour: "Platform tour"
ui_solutions_2: "Solutions"
ui_by_team: "By team"
ui_talk_to_us: "Talk to us"
ui_json_feed: "JSON Feed"
ui_built_with: "Built with"
ui_static_site_generator: "Static Site Generator"
ui_made_with_ssg: "Made with SSG"
ui_language: "Language"
locale_path: "/kinetic/"
base_path: "/kinetic/"
en_current: ' aria-current="true"'
fr_current: ""
kin_by_the_numbers: "By the numbers"
kin_teams_onboarded: "Teams onboarded"
kin_median_setup_time: "Median setup time"
kin_18_min: "18 min"
kin_integrations: "Integrations"
kin_uptime_trailing_year: "Uptime, trailing year"
kin_one_workspace_four_surfaces: "One workspace, four surfaces"
kin_each_surface_is_a: "Each surface is a full page of content on its own. The tab strip is an
      enhancement, not the structure."
kin_break_an_objective_into: "Break an objective into work that fits in a week. Dependencies
            are declared once and drawn everywhere, so a slipped date shows
            up on the plan it affects rather than in someone's inbox."
kin_boards_lists_and_a: "Boards, lists and a calendar over the same records. Changing the
            view never changes the data, so two teams can look at one
            backlog through the lens each prefers."
kin_comments_resolve_against_a: "Comments resolve against a revision rather than floating free,
            and an approval records who approved what, not merely that
            somebody did."
kin_dashboards_read_from_the: "Dashboards read from the same records the work lives in. There
            is no export step, so a number on a dashboard is never a
            fortnight behind the thing it describes."
kin_what_you_get_on: "What you get on day one"
kin_structured_work: "Structured work"
kin_tasks_docs_and_decisions: "Tasks, docs and decisions in one record type, so a search returns
          the decision as readily as the ticket that prompted it."
kin_views_that_compose: "Views that compose"
kin_filter_group_and_sort: "Filter, group and sort are independent. Any combination is a URL,
          which means a view is something you can send to a colleague."
kin_automation_you_can_read: "Automation you can read"
kin_rules_are_stated_as: "Rules are stated as sentences and shown in full before they run.
          An automation nobody can read is an outage waiting for a quiet
          afternoon."
kin_history_that_survives: "History that survives"
kin_every_field_keeps_its: "Every field keeps its previous values. Reverting is reading the
          record, not restoring a backup."
kin_permissions_by_default: "Permissions by default"
kin_a_workspace_starts_closed: "A workspace starts closed. Sharing is a deliberate act with an
          audit line attached to it."
kin_exports_that_round_trip: "Exports that round-trip"
kin_what_you_export_imports: "What you export imports again. Leaving is supported rather than
          merely permitted."
kin_built_for_the_way: "Built for the way teams actually split up"
kin_roadmaps_that_survive_contact: "Roadmaps that survive contact with a shipping date."
kin_marketing: "Marketing"
kin_campaign_calendars_with_the: "Campaign calendars with the assets attached to the dates."
kin_operations: "Operations"
kin_recurring_work_that_does: "Recurring work that does not depend on anyone remembering it."
kin_see_all_team_templates: "See all team templates"
kin_see_pricing: "See pricing"
translation_key: "home"
slug_contact: "contact"
slug_platform: "platform"
slug_pricing: "pricing"
slug_solutions: "solutions"
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
