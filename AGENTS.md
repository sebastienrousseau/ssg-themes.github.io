<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# AGENTS.md: Repository Standards for SSG Themes

Invariants for AI agents and human contributors working on
`ssg-themes.github.io`, the gallery of themes for the Rust static site
generator [`ssg`](https://static-site-generator.com/), published at
<https://themes.static-site-generator.com>. Read this, then
[DEVELOPMENT.md](DEVELOPMENT.md), before changing anything.

## 0. About This Repository

- `themes/<slug>/`: one theme each (`theme.toml`, `ssg.toml`, Tera
  `_layouts/`, `content/` in English and French). `themes/sebastienrousseau`
  is a site-tier theme extracted from sebastienrousseau.com by its
  `tools/extract_from_site.py`.
- `showcase/`: the gallery site that links every theme.
- `scripts/`: the build (`build.sh`) and the post-processing and gate scripts.
- `tests/responsive/`, `tests/aaa/`: Playwright browser gates; `tests/unit/`:
  unit tests for the HTML rewriting scripts.
- `public/`: build output. Never edit it; fix the theme or the script.

## 1. Hygiene First

Before feature work: `main` CI is green, `gh pr list --author app/dependabot`
is empty or funnelled (section 3), there are no open Dependabot or
code-scanning alerts, and `make check` passes locally.

## 2. Core Invariants

1. **Never edit generated output** (`public/`). Fix the source.
2. **Single source of truth**: the theme set is `themes/*/theme.toml`; the
   generator version is `.github/ssg-version`. Derive, do not copy.
3. **Preserve comments, docstrings and SPDX headers.**
4. **Never invent facts**: accessibility, weight and score claims must be
   backed by a gate in `make check`.
5. **Never silence a gate**: no new exemptions, hidden selectors or
   skipped pages to make a check pass. Fix the cause.
6. **Fix forward in the same session.**
7. **Humans attest, agents do not**: agents never add `Signed-off-by:`,
   publish releases or push tags. Agent commits carry
   `Assisted-by: <agent>:<model> [<tools>]`.
8. **No em dashes** in commits, PRs, docs or release notes.

## 3. Versions and Branches

- Versions step by 0.0.1 (`VERSION`, tags `v0.0.N`, notes in
  `releases/v0.0.N.md`, summary in `CHANGELOG.md`).
- Work for the next release happens on `feat/v<next>`; it is the only open
  PR into `main`.
- Dependabot and other PRs are cherry-picked into `feat/v<next>` and their
  standalone PRs closed with a link to the release PR.

## 4. Commits

`<type>: <subject>` (50 characters max, imperative; types `feat`, `fix`,
`docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`). The
body explains what and why, wrapped at 72. Commits are SSH-signed. Never
merge into `main` without the maintainer's explicit instruction.

## 5. Validation Gate

```bash
make test     # unit tests for the HTML rewriters (seconds)
make check    # every gate: what CI runs, minus Lighthouse
actionlint    # after any change under .github/workflows/
shellcheck -x scripts/*.sh tests/*/*.sh
ruff check --no-cache scripts tests/unit
```

The local `ssg` must match `.github/ssg-version`; `scripts/resolve-ssg.sh`
refuses to build otherwise.
