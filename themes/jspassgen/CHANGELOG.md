# Changelog

## 1.0.0 - 2026-10-10

- Initial release of the jspassgen theme.
- Added cryptographic entropy gauges, password generators, and Diceware models.
- Added responsive layouts, dark/light theme switching, and WCAG AAA compliance.
- Fixed the command-line panel's backdrop picture overflowing the panel's
  clipped edge at 200% text size and with WCAG text spacing: the picture is
  now a block box, so it has no inline line box to hang below the image.
- Fixed light-mode accent text and buttons at 5.2-5.9:1: `--accent-primary`
  now follows the AAA-gated `--accent` (#1e40af, 7.7:1 or better on every
  ground it sits on). Terminal comments rise to 8.2:1, and the footer
  credit links are underlined so colour is not their only marker.
- Fixed the navigation labels wrapping onto several lines between 768px
  and 990px: the menu now collapses into its disclosure below 62rem.
- Fixed the colour-mode control to use the canonical Voxt rules every theme
  shares: it had restyled them with its own border and background tokens,
  so it no longer matched the control on every other theme.
- Fixed the remaining AAA findings: comparison-table marks get their own
  7:1 colours (`--mark-yes`, `--mark-no`, `--mark-warn`), dark accent text on
  the accent tint rises from 6.86:1 to 7.39:1, the CLI and FAQ links, the
  copy button, the 404 and contact buttons and the contact inputs reach
  44px, and consecutive paragraphs on text pages are spaced for WCAG 1.4.8.
- Made every text colour measurable by the contrast tools: the header is
  opaque, the table marks and pipeline arrows are generated content, the
  command-line panel's text sits on opaque grounds over its backdrop
  photograph, and the two labelled displays carry `role="group"`.
- In-page links clear the sticky header (`scroll-padding-top`).
- Packed the Diceware list: the full 7,776-word EFF list still ships
  inside `main.js`, so a passphrase needs no network request, but as a
  13 KB arithmetic-coded string instead of 62 KB of plain words. The page
  decodes it on first use. `wordlist/eff_large_wordlist.txt` is the
  source, `node scripts/jspassgen-wordlist.mjs --write` re-packs it, and
  `make check-wordlist` fails unless the page's own decoder reproduces that
  file byte for byte, in the same order, so dice index N is still word N.
  `main.js` transfer falls from 31.3 KB to 19.7 KB.
- The manifesto photograph is shown below 48rem only, with AVIF rungs
  (1.3 and 2.8 KB against 3.6 and 10.3 KB of WebP) and WebP kept as the
  fallback. From 48rem a drawn panel takes its place at the same
  proportion: a glass grid over the accent-to-scene gradient, built from
  the theme's tokens, so wide screens fetch no photograph at all. The
  unused 1200 px WebP rung is removed.
- Removed the comparison section (the competitor table, its mobile
  selector, the "Benchmark" link in the header and the section's front
  matter) to keep the page inside the 50 KB transfer budget with the full
  wordlist on board.
