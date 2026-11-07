<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Contributing

Thanks for helping. This repository holds the SSG theme gallery; every
theme is held to the same accessibility, weight and privacy gates.

## Before you start

- Read [DEVELOPMENT.md](DEVELOPMENT.md) to set up the toolchain.
- Bugs and ideas: open an issue. Security problems: follow
  [SECURITY.md](SECURITY.md), not a public issue.
- By contributing you agree to follow the
  [Code of Conduct](CODE_OF_CONDUCT.md).

## Making a change

1. Branch from the open `feat/v<next>` release branch, not `main`.
2. Change the theme or script, not `public/` (build output).
3. If you fix a script that rewrites HTML, add a test under `tests/unit/`
   that fails without your fix.
4. Run `make check`. All gates must pass; adding an exemption to make one
   pass is not accepted.
5. Commit with a signed commit and a message in the form
   `<type>: <subject>` (50 characters max), with a body explaining what
   changed and why.
6. Open the pull request against the release branch.

## Adding a theme

A theme is a directory under `themes/` with a `theme.toml`, an `ssg.toml`,
`_layouts/` and English and French `content/`. Copy the structure of a
theme close to yours, then register it where `make check-structure` tells
you to.

## Licence

Contributions are dual-licensed under Apache-2.0 and MIT, as the
repository is.
