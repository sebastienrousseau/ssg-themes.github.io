<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Development

How to build the gallery and run every gate CI runs, on your own machine.

## Toolchain

| Tool | Version | Why |
| --- | --- | --- |
| `ssg` | exactly the one in `.github/ssg-version` | builds every theme and the showcase |
| Python | 3.11 or newer (CI uses 3.12) | build passes and gates; standard library only |
| Node.js | 22 (as in CI) | the browser gates |
| Playwright Chromium | pinned by `tests/responsive/package-lock.json` | the browser gates |

```bash
mise use -g cargo:ssg@$(cat .github/ssg-version)   # or: cargo binstall ssg@<version>
npm --prefix tests/responsive ci
npx --prefix tests/responsive playwright install chromium
```

`scripts/resolve-ssg.sh` stops the build when the `ssg` on your `PATH`
differs from the pin. Set `SSG=/path/to/ssg` to use another binary, and
`ALLOW_SSG_DRIFT=1` to build with a different version anyway.

## Build and preview

```bash
make build            # every theme and the showcase into public/
make build-<theme>    # one theme, e.g. make build-quill
make preview          # serve public/ at http://127.0.0.1:8099/
```

## Gates

`make check` runs them in this order and is what CI runs (CI also runs
Lighthouse):

| Target | Checks |
| --- | --- |
| `make test` | unit tests for the HTML rewriting scripts (`tests/unit/`) |
| `make check-structure` | manifests, layouts, translations (`scripts/validate.py`) |
| `make check-contrast` | colour tokens at WCAG AAA (`scripts/contrast.py`) |
| `make check-wordlist` | the packed Diceware lists decode byte for byte |
| `make check-weight` | gzipped page weight and third-party requests |
| `make check-chrome` | one header, footer and asset set per theme and locale |
| `make check-audit` | `ssg audit` over the built output |
| `make check-responsive` | 13 viewports x 2 schemes: layout, interaction, semantics, axe |
| `make check-aaa` | painted contrast, target size, reflow, focus |
| `make check-links` | internal links (linkinator) |
| `make check-pa11y` | axe and HTML_CodeSniffer at WCAG2AAA |
| `make check-schema` | JSON-LD on every page |
| `make check-lighthouse` | mobile and desktop Lighthouse (not in `make check`) |

Each gate prints how much it measured, so a gate that stopped testing
anything shows as a dropped count.

## Tests for the build scripts

Unit tests live in `tests/unit/` and use `unittest`, so they need nothing
installed. Any fix to a script that rewrites HTML gets a test that fails
without it.

## Releases

See [AGENTS.md](AGENTS.md) section 3: the next release is built on
`feat/v<next>`, `VERSION` holds its number, and its notes go in
`releases/v<next>.md` and `CHANGELOG.md`. Tags and GitHub releases are
created by the maintainer.
