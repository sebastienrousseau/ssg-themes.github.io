# Prism

A financial-infrastructure marketing theme for [Static Site Generator][ssg]:
the front-of-house pages a payments, treasury or banking-rails product needs,
with none of the weight that category usually carries.

- **Six pages** — home, products, solutions, developers, governance,
  contact, plus a 404.
- **No build step.** No `package.json`, no bundler. Hand-authored CSS using
  cascade layers and custom properties.
- **No third-party requests.** No fonts, analytics or CDNs. Everything is
  same-origin, enforced by a strict content security policy.
- **AAA colour.** Every token pair is checked by `scripts/contrast.py` at
  7:1 for text and 3:1 for non-text, in light and dark — including the
  navy masthead, the hero and the developer code panel, which carry their
  own tokens.

## Requirements

SSG **0.0.50** or newer. Below that the layout named in front matter is
ignored, the bundled content schema aborts the compile, and extracted CSS
404s under a sub-path.

## Usage

```sh
ssg build -f themes/prism/ssg.toml
```

Change `base_url` in `ssg.toml` to your own origin before deploying.

## Navigation

The masthead carries a disclosure mega-menu. Each top-level item is two
controls, deliberately:

| Control | What it is | Why |
|---|---|---|
| "Products" | An ordinary link to `/products/` | Navigates without JavaScript, and is what a crawler follows |
| The chevron beside it | A `<button aria-expanded aria-controls>` | Opens the panel of product links for keyboard and pointer users alike |

Pointer users also get the panel on hover. Escape closes it and returns
focus to the button; clicking or tabbing elsewhere closes it too. Below
64rem the whole menu collapses behind the `#navToggle` disclosure and the
panels become an accordion. With scripting unavailable the chevrons are
withdrawn and the menu is shown expanded.

## Design

The palette is a navy base with a luminous blue accent, warm off-white
grounds, and four semantic tints — green for governance, clay for
commerce, gold for wealth and burgundy for risk. Each tint has a text
token and a soft ground, and every pair is gated.

Gradients appear only behind icons and behind the hero mock-ups, never
behind text. The hero copy sits on solid navy.

## Before you deploy

`content/contact.md` has two fields that must be changed together:
`form_action` (where the submission goes) and `form_origin` (which the
`form-action` content security policy allows). If they disagree the browser
blocks the POST, silently as far as the visitor can tell.

## Content

The product, the customers and the figures throughout are illustrative.
They exist to exercise the components and describe no real company.

## Security

Every page carries one Content Security Policy, declared in
`_layouts/base.html` and identical across all themes in this suite:

```
default-src 'self'; base-uri 'none'; object-src 'none';
script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'self'; manifest-src 'self';
form-action 'self' {form_origin}
```

No inline script or inline style is permitted, so the generator extracts
both to external files covered by Subresource Integrity. Nothing loads from
a third-party origin.

`form_origin` is the one value you are expected to change. It is set in each
page's front matter and defaults to the placeholder `https://example.com`.
Point it at your own form endpoint before you deploy, or the browser blocks
the POST. If the theme has no form, set it to your own origin and the
directive becomes inert.

## Licence

MIT. See [LICENSE](../../LICENSE).

[ssg]: https://github.com/sebastienrousseau/static-site-generator
