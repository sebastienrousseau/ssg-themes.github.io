# i18n follow-up: translated slugs and a root-hosted default locale

> **Status: shipped.** All three blockers below are resolved and Atlas
> serves `/atlas/` + `/atlas/fr/` with translated slugs. See
> [Resolution](#resolution) at the foot of this file for what each fix
> turned out to be — the analysis above it is kept as written, because
> it is what made the fixes tractable.

Multi-locale support was **not shipped**. Two independent limits in
`I18nPlugin` blocked it, and the second was a design limit rather than a
bug. This records both precisely so the next attempt starts from the
finding.

## Requirement

Slugs must be translated. The target is:

| Page | English | French |
| --- | --- | --- |
| Home | `/atlas/` | `/atlas/fr/` |
| About | `/atlas/about/` | `/atlas/fr/a-propos/` |
| Articles | `/atlas/articles/` | `/atlas/fr/articles/` |
| Papers | `/atlas/papers/` | `/atlas/fr/publications/` |
| Contact | `/atlas/contact/` | `/atlas/fr/nous-contacter/` |

`/fr/about/` is not acceptable: it is an English token in a French URL,
it is indexed as such, and it signals to a reader that the localisation is
superficial.

---

## Blocker 1 — pages are matched across locales by identical path

This is the hard one. `collect_html_files_recursive` builds the locale
matrix as `rel_path -> set-of-locales`:

```rust
let rel = path.strip_prefix(root)…;
let _ = map.entry(rel).or_default().insert(locale.to_string());
```

and `inject_hreflang_all` only emits links for a page present in at least
two locales.

With translated slugs, `about/index.html` and `a-propos/index.html` are two
distinct keys, each with a single locale. **Neither page receives any
hreflang, and the language switcher renders nothing** — with no warning,
because from the plugin's point of view these are simply two untranslated
pages.

There is no `translation_key` concept anywhere in the plugin. Path identity
*is* the translation relationship.

### Required change: an explicit translation key

Adopt the same mechanism Hugo uses (`translationKey`). Every page declares a
stable key in front matter; pages sharing a key are translations of one
another regardless of their paths.

```yaml
# themes/atlas/content/about.md
translation_key: "about"

# themes/atlas/content/fr/a-propos.md
translation_key: "about"
```

The matrix type inverts:

```rust
// before: which locales serve this exact path
HashMap<String, HashSet<String>>          // rel_path -> {locale}

// after: where each locale serves this logical page
HashMap<String, BTreeMap<String, String>> // key -> {locale -> rel_path}
```

Keys come from the front-matter sidecars, not from the file tree, so
`collect_locale_pages` has to read `.meta/*.meta.json` rather than only walk
HTML. Those sidecars live beside the compiled HTML in `site_dir` after the
build directory is promoted — see `resolve_sidecar_dir` in
`template_plugin.rs`, which solves the same lookup.

Pages with no key keep the current path-matching behaviour, so existing
single- and multi-locale sites are unaffected.

Everything downstream then needs the *target* locale's own path instead of
one shared `rel_path`:

- `build_hreflang_links` — currently takes a single `rel_path` and varies
  only the locale segment. It needs `{locale -> rel_path}`.
- `generate_locale_sitemaps` — same, for `<xhtml:link>` alternates.
- `generate_lang_switcher_html_with_self_lang` — the switcher must link to
  the translated path, not the current path under a different prefix.
- `build_url` — takes the target locale's path.

---

## Blocker 2 — the default locale must have its own directory

`detect_locale_dirs` only counts a locale that has a directory:

```rust
locales.iter().filter(|l| site_dir.join(l).is_dir()).cloned().collect()
```

and `after_compile` returns early when fewer than two are present. With
English at the site root only `fr` is detected, so the plugin does nothing
at all — this is what the first attempt hit.

Hosting the default locale at the root is the prevailing convention (Hugo's
`defaultContentLanguageInSubdir = false`, Astro's `prefixDefaultLocale:
false`, Next.js's default), and it keeps clean URLs for what is usually most
of the traffic.

### Required change

Separate the locale identifier from the URL segment; the code already
separates a page's locale *directory* from its language *label*
(`build_hreflang_links` takes both `self_locale` and `self_lang`), so the
shape exists. Represent the root-hosted locale with an empty segment:

1. `detect_locale_dirs` — report the default locale as present when the site
   root holds HTML outside the other locale directories.
2. `collect_locale_pages` — for a default locale with no directory, walk the
   root while excluding the other locale directories.
3. `resolve_locale_and_rel` — a path whose first component is not a locale
   directory belongs to the default locale. It currently returns `None`,
   which is what drops every root page.
4. `build_url` — emit `{base}/{rel_path}` when the segment is empty rather
   than `{base}//{rel_path}`.

`build_url` has eight production call sites plus three in tests.

---

## Blocker 3 — nested `index.md` gains a directory level

`content/fr/index.md` compiles to `fr/index/index.html`, not
`fr/index.html`. A root `content/index.md` correctly becomes `index.html`,
so only the nested case is wrong. Every locale home page is affected.

Independent of the two above, and fixed in the compiler's output-path
mapping rather than in `I18nPlugin`.

---

## Suggested order

1. Blocker 3 — smallest, and locale home pages are wrong without it.
2. Blocker 2 — unblocks the plugin running at all; testable on its own with
   untranslated slugs.
3. Blocker 1 — the feature proper. Land `translation_key` behind
   path-matching fallback so it is additive.

Each step is independently verifiable: after step 2 the `hreflang` gate in
`ssg audit` should report reciprocal links for identical slugs; after step 3
it should still pass with the slugs above.

## What the themes need afterwards

Nothing is left half-wired — the first attempt was reverted cleanly.

- `[i18n]` in `themes/atlas/ssg.toml` (`default_locale = "en"`,
  `locales = ["en", "fr"]`, `url_prefix = "sub_path"`)
- `translation_key` on every English page and its French counterpart
- `content/fr/{index,a-propos,articles,publications,nous-contacter}.md`,
  with `language: "fr-FR"`, `base_path: "/atlas/fr/"`, matching `site_url`,
  and `permalink` using the translated slug
- replace the two hand-written `<link rel="alternate" hreflang=…>` tags in
  `themes/atlas/_layouts/base.html` with a comment — the injector is
  idempotent and skips any page that already carries them
- `<!-- ssg:lang-switcher -->` in `themes/atlas/_layouts/header.html`
- a `.lang-switcher` block in the components layer of `styles.css`
- extend `scripts/validate.py` to assert that every `translation_key`
  resolves in all configured locales, so a missing translation fails the
  build instead of silently dropping the alternates

---

## Resolution

### Blocker 3 — fixed by a workaround; the bug is upstream

The output-path mapping is **not** in this repo. It is
`staticdatagen::utilities::write::write_files_to_build_directory`
(`staticdatagen 0.0.11`), which compares the whole processed file name
against `"index"`, so only a content-root `index.md` reaches the
root-index branch. `staticdatagen` is a published external dependency and
was not vendored.

The side-step lives in `content_stager::flatten_nested_index_pages`: the
compiler writes `foo.md` to `foo/index.html`, so a nested `fr/index.md`
is *staged* under the name `fr.md` and lands at `fr/index.html`. This
restores the mapping `urls::derive_output_rel_path` already documented
and asserted (`about/index.md → about/index.html`). A collision — both
`fr.md` and `fr/index.md` authored — leaves the nested file alone rather
than dropping a page.

### Blocker 2 — fixed

`detect_locale_dirs` became `detect_locales`, returning
`(present_locales, root_locale)`. The default locale counts as present
without a directory when the site root holds HTML outside the other
locale directories, and is reported as the `root_locale`; `build_url`
then omits its segment entirely under either URL strategy. The
locale-redirect `index.html` is no longer written when a locale is
root-hosted — the site root already *is* that locale's home page.

### Blocker 1 — fixed

The matrix inverted exactly as sketched: `key -> {locale -> rel_path}`,
with a `(locale, rel_path) -> key` reverse index. Keys come from the
`translation_key` front-matter field read out of the `.meta/*.meta.json`
sidecars, and fall back to the locale-relative path when a page declares
none — so single- and multi-locale sites with no `translation_key`
behave exactly as before.

One thing the analysis did not anticipate: **alternate `hreflang` labels
had to become per-target as well.** Each alternate names a *different*
document, so it now carries that document's resolved language rather
than its bare locale directory name. Without it `/atlas/` labels itself
`en-GB` while `/atlas/fr/` calls it `en`, the two sides disagree, and the
`hreflang` audit gate reports `HREFLANG-NO-RECIPROCAL` for every pair.

### What the themes needed beyond the original list

- `asset_path` / `asset_url` front matter. Feeds, manifest, icon,
  stylesheet and scripts are published once per *site*; under
  `base_path` a French page asked for `/atlas/fr/styles.css`, which is
  never written.
- Localised navigation slugs and labels in front matter
  (`slug_papers: "publications/"`, `label_papers: "Publications"`, …).
  A layout cannot hard-code `papers/` once the French slug is
  `publications/`.
- A caution learned the hard way: the comment that replaced the
  hand-written `<link rel="alternate" hreflang=…>` tags in `base.html`
  originally *quoted* them, which contains the injector's idempotency
  marker verbatim and silently disabled every alternate on every page.
  The marker check does not care that the match sits inside a comment.
