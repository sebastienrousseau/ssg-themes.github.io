# Logo

The brand icon is `lock-keyhole` from Lucide (<https://lucide.dev/icons/lock-keyhole>),
taken from the npm package `lucide-static` 1.55.0, file `icons/lock-keyhole.svg`.

- Tarball: <https://registry.npmjs.org/lucide-static/-/lucide-static-1.55.0.tgz>
- Integrity (npm registry `dist.integrity`, checked against the downloaded
  tarball): `sha512-h18lunTFsIJWnY0FMRPjXeO9KcAtNi7fDqtqgWHOFbssfgUWsctn/pA7bpiyrd4g1DuBOJ24CsRnPfkYblwm/A==`
- Licence: ISC, copyright Lucide Icons and Contributors. The licence text is
  in [LICENSES/lucide-ISC.txt](LICENSES/lucide-ISC.txt). `lock-keyhole` is not
  among the icons the package lists as derived from Feather, so the ISC
  licence is the only one that applies to it.

The icon is inlined in `_layouts/header.html` (30 px) and
`_layouts/footer.html` (28 px). The path data is unchanged; the markup drops
the file's `class`, `xmlns` and licence comment, keeps Lucide's stroke
attributes (`stroke="currentColor"`, width 2, round caps and joins), and adds
`aria-hidden` and `focusable="false"` because the brand name is printed
beside it. The colour is the theme's accent, set on `.brand-logo`.
