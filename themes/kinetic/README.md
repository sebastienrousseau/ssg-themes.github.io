# Kinetic

A work-platform marketing theme for [Static Site Generator][ssg]: the
front-of-house pages a multi-product SaaS needs, with none of the weight
that category usually carries.

- **Five pages** — home, platform, solutions, pricing, contact, plus a 404.
- **No build step.** No `package.json`, no bundler. Hand-authored CSS using
  cascade layers and custom properties.
- **No third-party requests.** No fonts, analytics or CDNs. Everything is
  same-origin, enforced by a strict content security policy.
- **AAA colour.** Every token pair is checked by `scripts/contrast.py` at
  7:1 for text and 3:1 for non-text, in light and dark.

## Requirements

SSG **0.0.50** or newer. Below that the layout named in front matter is
ignored, the bundled content schema aborts the compile, and extracted CSS
404s under a sub-path.

## Usage

```sh
ssg build -f themes/kinetic/ssg.toml
```

Change `base_url` in `ssg.toml` to your own origin before deploying.

## Islands

Two components are progressive enhancements. The version without JavaScript
is the complete answer, not a fallback:

| Island | Static HTML | What the module adds |
|---|---|---|
| `feature-tabs` | Four sections, each with a heading, in reading order | A tab strip showing one at a time, with arrow-key navigation |
| `pricing-toggle` | The full monthly pricing table | A control switching to annual rates |

The tab markup carries no `role="tab"` in the HTML. Those roles promise
arrow-key navigation that only the script can deliver; announcing the
promise statically and then not keeping it is worse than a plain stack of
sections. The roles are added by the module, at the moment they become true.

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
