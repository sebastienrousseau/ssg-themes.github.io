# Kaishi

An Apple-inspired starter theme for Static Site Generator: a translucent
sticky header, pill controls, soft cards and generous type — on a colour
system gated at **WCAG AAA**, not AA.

![Kaishi screenshot](images/screenshot.png)

- **Demo:** <https://themes.static-site-generator.com/kaishi/>
- **Licence:** MIT
- **Requires:** ssg 0.0.50+

## Install

Copy `themes/kaishi/` into your project, point the generator at its
configuration, and build:

```sh
ssg build -f themes/kaishi/ssg.toml
```

There is no package to install and no build step of its own.

## What you get

| Page | Layout |
| --- | --- |
| Home | `index.html` |
| About | `about.html` |
| Features | `features.html` |
| Contact | `contact.html` |
| Not found | `404.html` |
| Anything else | `page.html` |

## Design

Three details carry the look, all of them tokens rather than markup:

- **Translucent header** — the masthead blurs the page behind it, but only
  behind `@supports (backdrop-filter: ...)`. Without support it stays
  opaque, so the contrast pair the gate verifies is the pair that ships.
- **Pill controls** — a 980px radius rather than `50%`, so a wide button
  keeps semicircular ends instead of becoming an ellipse.
- **Soft cards** — a 24px corner and a light shadow instead of a hard border.

## Accessibility

Every colour pair is verified at **AAA (7:1)** for text by
`scripts/contrast.py` in CI, in light *and* dark mode. Dark mode is checked
as its own palette, which is where themes usually fail: a muted grey that
reads well on white is often unreadable on black.

Nothing is loaded from another origin — no CDN, no webfont host, no
analytics.

## Licence

MIT or Apache-2.0, at your option.
