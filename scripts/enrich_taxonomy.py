#!/usr/bin/env python3
"""Enrich taxonomy index pages emitted by the generator.

`ssg` writes tag and term listing pages itself (they carry
`<meta name="generator" content="ssg-taxonomy">`), so a theme's own
`base.html` never runs for them. That means they miss three things every
authored page in the suite has: a robots directive, structured data, and a
description long enough to survive a search result snippet.

This runs after `ssg build` and adds exactly those three, leaving the
generator's own markup untouched. It is idempotent: a page that already
carries a piece keeps the one it has.

It also swaps the generator's own language switcher for the one the rest of
the suite uses. The injected version lists two-letter codes in 19x24 links,
under the 44px target every other control on these themes clears, and it is
the only place in the suite where the switcher looks different.
"""
import html
import json
import re
import sys
from pathlib import Path

MARKER = 'content="ssg-taxonomy"'


def listed_pages(markup: str, canonical: str) -> list[dict]:
    """The entries the listing actually links to, as ItemList elements.

    Hrefs in the listing are root-relative; structured data wants absolute
    URLs, so they are resolved against the page's own canonical origin.
    """
    origin = ""
    scheme_host = re.match(r"(https?://[^/]+)", canonical)
    if scheme_host:
        origin = scheme_host.group(1)
    items = []
    # A term page lists pages; the index page lists the terms themselves.
    block = re.search(
        r'<ul class="taxonomy-(?:page|term)-list">(.*?)</ul>', markup, re.S)
    if not block:
        return items
    for n, (href, label) in enumerate(
        re.findall(r'<a href="([^"]+)"[^>]*>(.*?)</a>', block.group(1), re.S), 1
    ):
        items.append({
            "@type": "ListItem",
            "position": n,
            "url": (origin + href) if href.startswith("/") else href,
            "name": html.unescape(re.sub(r"<[^>]+>", "", label)).strip(),
        })
    return items


def canonical_csp(root: Path) -> str | None:
    """The policy this theme's own pages carry.

    The generator writes taxonomy listings with a policy of its own, which
    differs from the one the theme's `base.html` declares — `ssg audit`
    compares the strings literally and reports the difference as CSP drift.
    Reading it back from the theme's landing page keeps the two in step
    without restating the policy here, where it would go stale.
    """
    landing = root / "index.html"
    if not landing.exists():
        return None
    m = re.search(
        r'<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"',
        landing.read_text(encoding="utf-8"))
    return m.group(1) if m else None


SWITCHER = re.compile(r'<nav class="lang-switcher".*?</nav>\s*', re.S)

LANG_STRINGS = {
    "en": ("EN", "Change language", "Language"),
    "fr": ("FR", "Changer de langue", "Langue"),
}


def shared_switcher(markup: str, lang: str, base_path: str) -> str:
    """The suite's switcher, in place of the generator's own."""
    code, action, label = LANG_STRINGS.get(lang, LANG_STRINGS["en"])
    current = ' aria-current="true"'
    return SWITCHER.sub(
        '<details class="ap-lang">'
        f'<summary class="ap-lang-toggle" title="{label}">'
        '<span class="ap-lang-globe">\U0001F310</span>'
        f'<span class="ap-lang-current">{code}</span>'
        f'<span class="visually-hidden">, {action}</span></summary>'
        '<div class="ap-lang-menu"><div class="ap-lang-menu-grid">'
        f'<a class="ap-lang-item" href="{base_path}?lang=en" hreflang="en" lang="en"'
        f'{current if lang == "en" else ""}>English</a>'
        f'<a class="ap-lang-item" href="{base_path}fr/?lang=fr" hreflang="fr" lang="fr"'
        f'{current if lang == "fr" else ""}>Français</a>'
        '</div></div></details>',
        markup, count=1)


def enrich(path: Path, csp: str | None = None) -> bool:
    markup = path.read_text(encoding="utf-8")
    if MARKER not in markup:
        return False
    before = markup

    lang = re.search(r'<html[^>]+lang="([^"]+)"', markup)
    # "fr-FR" and "fr" share one set of strings.
    lang = lang.group(1).split("-")[0].lower() if lang else "en"

    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', markup)
    canonical = canonical.group(1) if canonical else ""
    title = re.search(r"<title>(.*?)</title>", markup, re.S)
    title = html.unescape(title.group(1)).strip() if title else ""
    # "Tags: method — Atlas — …" → term "method", site "Atlas".
    # The first segment carries the taxonomy label ("Tags", "Categories");
    # a snippet reads better naming the term alone, so it is split off and
    # kept separately for the prose.
    parts = [p.strip() for p in title.split("—")]
    heading = parts[0] if parts else ""
    site = parts[1] if len(parts) > 1 else ""
    label, _, term = heading.partition(":")
    term = term.strip() or heading
    # "Tags" → "tag", so the sentence reads "under the tag method".
    kind = label.strip().lower().rstrip("s") if term != heading else ""

    # The site root, not this listing: isPartOf points at the WebSite.
    site_url = canonical
    if canonical.startswith("http"):
        segments = canonical.split("/")
        # scheme, "", host, <theme>, …  → keep through the theme segment.
        site_url = "/".join(segments[:4]) + "/" if len(segments) > 4 else canonical

    items = listed_pages(markup, canonical)
    count = len(items)

    # 1. Robots. Absent means "index, follow" by default, but the suite states
    #    it explicitly everywhere else and auditors flag the inconsistency.
    if not re.search(r'<meta[^>]+name="robots"', markup, re.I):
        markup = markup.replace(
            '<link rel="canonical"',
            '<meta name="robots" content="index, follow"> <link rel="canonical"',
            1,
        )

    # 2. A description a search engine can use. The generator writes
    #    "2 page(s) under Tags: method." — accurate, but far too short to be
    #    shown, and the "(s)" reads as machine output.
    if count:
        # The body of these pages is translated, so the snippet must be too.
        # Unknown languages fall back to English rather than to no sentence.
        one = "page" if count == 1 else "pages"
        if lang == "fr":
            kind_fr = {"tag": "tag", "categorie": "catégorie"}.get(kind, kind)
            page_fr = "page" if count == 1 else "pages"
            if kind:
                desc = (
                    f"Parcourez les {count} {page_fr} d\u2019{site} classées sous "
                    f"le {kind_fr} {term}. Chaque entrée portant ce terme, avec un "
                    f"lien direct vers chacune."
                )
            else:
                desc = (
                    f"Chaque tag utilisé sur {site}, {count} au total, avec le "
                    f"nombre de pages classées sous chacun. Suivez un tag pour "
                    f"lire les pages qu\u2019il regroupe."
                )
        elif kind:
            desc = (
                f"Browse the {count} {site} {one} filed under the {kind} {term}. "
                f"Every entry carrying this term, listed with a direct link to each one."
            )
        else:
            plural = heading.lower().rstrip("s")
            desc = (
                f"Every {plural} used across {site}, {count} in total, "
                f"with the number of pages filed under each one. Follow any "
                f"{plural} to read the pages it collects."
            )
        desc = desc.strip()
        desc = html.escape(desc, quote=True)
        markup = re.sub(
            r'(<meta name="description" content=")[^"]*(")',
            lambda m: m.group(1) + desc + m.group(2), markup, count=1)
        markup = re.sub(
            r'(<meta property="og:description" content=")[^"]*(")',
            lambda m: m.group(1) + desc + m.group(2), markup, count=1)

    # 3. The theme's own policy, in place of the generator's.
    if csp:
        markup = re.sub(
            r'(<meta\s+http-equiv="Content-Security-Policy"\s+content=")[^"]+(")',
            # A lambda replacement, so nothing in `csp` is interpreted as a
            # backreference and no escaping is needed.
            lambda m: m.group(1) + csp + m.group(2),
            markup, count=1)

    # 4. Structured data. A taxonomy listing is a CollectionPage whose
    #    mainEntity is the ItemList of what it links to.
    if "application/ld+json" not in markup:
        graph = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": canonical + "#collection",
            "url": canonical,
            "name": heading or title,
            "isPartOf": {"@type": "WebSite", "name": site, "url": site_url},
            "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": count,
                "itemListOrder": "https://schema.org/ItemListUnordered",
                "itemListElement": items,
            },
        }
        block = ('<script type="application/ld+json">'
                 + json.dumps(graph, ensure_ascii=False, separators=(",", ":"))
                 + "</script> ")
        markup = markup.replace("</head>", block + "</head>", 1)

    # The theme root is the first path segment: /atlas/tags/ -> /atlas/.
    root_seg = path.as_posix().split("public/", 1)[-1].split("/", 1)[0]
    if 'class="lang-switcher"' in markup:
        markup = shared_switcher(markup, lang, f"/{root_seg}/")

    if markup == before:
        return False
    path.write_text(markup, encoding="utf-8")
    return True


def main() -> int:
    roots = [Path(a) for a in sys.argv[1:]] or [Path("public")]
    changed = 0
    for root in roots:
        if not root.exists():
            continue
        csp = canonical_csp(root)
        for page in sorted(root.rglob("index.html")):
            changed += enrich(page, csp)
    if changed:
        print(f"enrich_taxonomy: {changed} generated listing page(s) completed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
