# Lucid

A documentation theme for [Static Site Generator](https://github.com/sebastienrousseau/static-site-generator), built on the layout the U.S. Web Design System recommends for a [documentation page](https://designsystem.digital.gov/templates/documentation-page/): persistent side navigation, in-page contents, and a reading column that does not sprawl.

## What it is for

Handbooks, API references, runbooks — anything read once in order and then returned to by search. The layout answers the two questions a reader arrives with: *where am I in this document*, and *what else is in this section*.

## Layout

| Region | Purpose |
| --- | --- |
| Side navigation | The pages in the section. The current page is marked with `aria-current`, not colour alone. |
| Reading column | Capped near 66 characters, the measure at which continuous prose stays readable. |
| On this page | The headings of the current page, so a long reference is navigable without scrolling to learn its shape. |
| Prev / next | Named, not arrowed. A reader should know where a link goes before following it. |

## Accessibility

Colour is declared once as custom properties and used nowhere else. Every pair the theme renders is asserted at **WCAG AAA (7:1)** for text in *both* colour schemes by `scripts/contrast.py`, so a token changed to something that fails contrast fails the build.

Non-text contrast is held to **4.5:1**, not the 3:1 the criterion asks for. WCAG 1.4.11 has no AAA level — 3:1 is the whole criterion — so the strictest defensible bar is the AA *text* threshold applied to borders and focus rings. Lucid opts into that tier via `STRICT_NONTEXT` in the contrast gate.

Two suites measure what a browser actually paints, because a declared token can pass in isolation and still be rendered on a ground it was never paired with:

```bash
make check-aaa
```

| Suite | What it measures |
| --- | --- |
| `tests/aaa/a11y.mjs` | Every rendered text run against its **computed** background, every non-inline target at 44x44, heading order, landmarks, accessible names, and 1.4.8 paragraph spacing — 8 pages x 2 colour schemes |
| `tests/aaa/reflow.mjs` | 8 pages x 11 viewports x 2 schemes: no horizontal scrolling, no element wider than the viewport |

That distinction caught two real defects during development. A `.prose > * + *` rule that looked correct in the stylesheet matched nothing on the page, because the generator wraps rendered Markdown in its own element — every paragraph sat at 0px spacing where 1.4.8 needs 40.8px. And the French criteria table pushed a 320px viewport to 337px until cell content was allowed to break.

Also enforced or implemented:

- **2.5.5 Target Size (AAA)** — every link, button and control is at least 44 by 44 pixels.
- **1.4.10 Reflow** — one column at 320px and at 200% zoom, with no horizontal scrolling.
- **2.4.7 Focus Visible** — a 3px ring at 2px offset. Focus is restyled, never removed.
- **2.3.3 Animation from Interactions (AAA)** — all motion is disabled under `prefers-reduced-motion`.
- **2.4.1 Bypass Blocks** — a skip link, and a landmark on every region.
- **3.1.2 Language of Parts** — each language link carries its own `lang` and `hreflang`.

The theme's own [Accessibility page](https://themes.static-site-generator.com/lucid/accessibility/) lists what is **not** claimed — reading level, link purpose in your own prose, and media alternatives are properties of your content, not of a template.

## Multilingual

Every visible string is front matter rather than markup, so a new language is a directory and a list entry, never a fork of the templates:

```toml
[i18n]
default_locale = "en"
locales = ["en", "fr"]
url_prefix = "sub_path"
```

Each page carries a `translation_key`; pages sharing a key are treated as translations of one another, which is how `hreflang` alternates are emitted. The repository's validation fails the build when a key does not resolve in every declared locale, so a half-translated site is a build error rather than a surprise for a reader.

The theme ships English and French so the wiring is exercised rather than merely claimed.

## Weight

No client-side framework, no web fonts, no third-party requests. The stylesheet is about 3.6 KB gzipped and every page stays well inside the repository's 20 KB gzipped budget. JavaScript adds the colour-scheme control and the mobile menu; with it disabled the documentation is fully readable and the theme follows the operating system's colour preference.

## Build

```bash
ssg --config themes/lucid/ssg.toml
```

Or, from this repository:

```bash
make build-lucid
make check          # structure, contrast, weight, audit, responsive
```

## Licence

MIT. See [LICENSE](../../LICENSE).
