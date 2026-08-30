# Quill

An typographic blog theme for [Static Site Generator](https://github.com/sebastienrousseau/static-site-generator).

A large tight-tracked wordmark, full-bleed hero images, two-column post headers, and a deliberately monochrome palette where hierarchy is carried by size and space rather than hue.

**Best for:** Writing-led blogs, essays, changelogs

## What it ships

| | |
| --- | --- |
| Layouts | `index`, `post`, `page`, `404`, plus the header and footer partials |
| Content | A post index, three posts, an archive and an about page |
| Locales | English and French, with a `translation_key` on every page |
| Colour schemes | System, light and dark, chosen by the reader |
| JavaScript | Progressive enhancement only — nothing here is needed to read the blog |

## Accessibility

Every colour pair is verified at **WCAG AAA** before the site builds: 7:1 for
text in both schemes. Borders and focus rings are held to **4.5:1**, which is
stricter than the 3:1 that 1.4.11 asks — that criterion has no AAA level, so
the AA *text* threshold is the strictest defensible bar.

The built pages are then measured in a real browser, because a token can pass
in isolation and still be painted on a ground it was never paired with:

```bash
make check-contrast   # every token pair, light and dark
make check-aaa        # rendered contrast, target size, reflow, focus
```

That covers the computed colour of every text run against its actual
background, every target at 44 by 44 pixels, no horizontal overflow at any
width from 320px up, and no focus ring that another element covers.

## Using it

```bash
ssg build -f themes/quill/ssg.toml
```

Then copy `_layouts/styles.css`, `_layouts/main.js` and
`_layouts/theme-init.js` alongside the output — `ssg` renders templates but
does not copy the assets that sit beside them.

## Licence

MIT. See [LICENSE](../../LICENSE).
