# Changelog

## 1.0.0 - 2026-10-26

- Added the theme, built from the jspassgen layouts in this repository:
  the same generator console (random passwords, Diceware passphrases,
  keys and decoys), the full EFF Diceware list packed inside `main.js` so
  a passphrase needs no network request, the entropy readout and the
  WCAG AAA colour tokens in light and dark.
- The demo is written around Cipher, a fictional offline passphrase
  generator on example domains, in English and French. The header,
  footer, skip link and the generator's own messages (strength bands,
  explanations, copy feedback) read their words from front matter, so
  each locale reads its own language.
- The header is a topbar: brand, links, language, search, colour mode and
  a download link, collapsing into a disclosure below 64em. Its component
  rules sit in `styles.css` inside Skeletonic's own cascade layer, since
  the published Skeletonic Stylus 3.0.0 core does not ship one, and the
  core file stays byte-identical to the published release.
- `theme-init.js` loads without `defer`, so the saved colour scheme and
  the removal of `no-js` apply before the first paint.
- The brand icon is inlined as SVG; `LOGO.md` records its source and
  licence.
- `wordlist/eff_large_wordlist.txt` is the source of the packed list;
  `node scripts/diceware-wordlist.mjs --write cipher` re-packs it, and
  `make check-wordlist` fails unless the page's own decoder reproduces
  that file byte for byte.
