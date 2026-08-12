# i18n follow-up: translated slugs and a root-hosted default locale

Multi-locale support is **not shipped**. Two independent limits in
`I18nPlugin` block it, and the second is a design limit rather than a bug.
This records both precisely so the next attempt starts from the finding.

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
