#!/usr/bin/env python3
"""Publish a site's not-found page and keep it out of the feeds.

The generator renders `content/404.md` to `404/index.html`. Three things
have to happen after that:

1. Static hosts (GitHub Pages, Netlify, Cloudflare Pages) serve `404.html`
   beside the site root for an unmatched path, not `404/index.html`. Both are
   kept: the directory form stays reachable as a demo of the layout.
2. An error page should not be indexed. The `robots` front-matter key is not
   honoured by the generator, so the directive is set here.
3. The page leaks into `sitemap.xml`, `news-sitemap.xml` and `rss.xml`.
   Listing an error page as content is the reason a 404 ends up in search
   results, so each entry is removed.

Usage:  publish_404.py public/<theme> [public/<theme> ...]
"""
import re
import sys
from pathlib import Path


def strip_entry(path: Path, wrapper: str) -> int:
    """Drop every <wrapper> block whose URL points at the 404 page."""
    if not path.exists():
        return 0
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(
        rf"\s*<{wrapper}>(?:(?!</{wrapper}>).)*?/404/?<.*?</{wrapper}>",
        re.S | re.I,
    )
    cleaned, n = pattern.subn("", text)
    if n:
        path.write_text(cleaned, encoding="utf-8")
    return n


def publish(root: Path) -> int:
    source = root / "404" / "index.html"
    if not source.exists():
        return -1

    page = source.read_text(encoding="utf-8")
    page, n = re.subn(
        r'<meta name="robots" content="[^"]*"',
        '<meta name="robots" content="noindex, follow"',
        page,
        count=1,
    )
    if n == 0:
        page = page.replace(
            "</head>", '<meta name="robots" content="noindex, follow"></head>', 1
        )
    source.write_text(page, encoding="utf-8")
    (root / "404.html").write_text(page, encoding="utf-8")

    removed = (
        strip_entry(root / "sitemap.xml", "url")
        + strip_entry(root / "news-sitemap.xml", "url")
        + strip_entry(root / "rss.xml", "item")
        + strip_entry(root / "atom.xml", "entry")
        + strip_json_feed(root / "feed.json")
    )
    drop_empty_feeds(root)
    return removed


def strip_json_feed(path: Path) -> int:
    """Remove the not-found item from a JSON Feed."""
    if not path.exists():
        return 0
    import json
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except ValueError:
        return 0
    items = data.get("items") or []
    kept = [i for i in items if not str(i.get("url", "")).rstrip("/").endswith("/404")]
    if len(kept) == len(items):
        return 0
    data["items"] = kept
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return len(items) - len(kept)


def drop_empty_feeds(root: Path) -> None:
    """Withdraw a feed that has nothing left to syndicate.

    A site whose only non-home page is the error page ends up with an empty
    <channel> once that entry is removed. Advertising a feed with no items
    is worse than having none: readers subscribe and get nothing, and the
    audit flags it. So the file is deleted and the <link> withdrawn from
    every page in this root.
    """
    rss = root / "rss.xml"
    if not rss.exists() or "<item>" in rss.read_text(encoding="utf-8"):
        return
    for name in ("rss.xml", "atom.xml", "feed.json"):
        target = root / name
        if target.exists():
            target.unlink()
    # Withdraw every reference: the <link> elements in the head and the
    # visible list items in the footer. A link to a file that is no longer
    # published is a broken link, which is worse than the empty feed was.
    #
    # Every pattern is scoped to *this root's* feed URLs. The sweep used to
    # strip any feed link from `*/index.html` regardless of whose feed it
    # was, and the gallery's own run (`publish_404.py public`) withdraws the
    # gallery's empty feed - so it reached into every theme's home page and
    # deleted that theme's live feeds from the footer and the <head>. The
    # same happened to a theme's French home when its /fr/ feed was empty.
    #
    # `here` is the root's URL path, taken from its path under `public/`:
    # `public` is `/`, `public/prism/fr` is `/prism/fr/`. Pages link a feed
    # either root-relative or by absolute URL, so an origin is optional.
    parts = root.parts[root.parts.index("public") + 1:] if "public" in root.parts else (root.name,)
    here = "/" + "".join(f"{part}/" for part in parts)
    feed = (r'(?:https?://[^"/]+)?' + re.escape(here)
            + r'(?:rss\.xml|atom\.xml|feed\.json)')
    pattern_item = re.compile(
        r'\s*<li>\s*<a[^>]+href="' + feed + r'"[^>]*>.*?</a>\s*</li>', re.S)
    pattern_link = re.compile(r'\s*<link[^>]+href="' + feed + r'"[^>]*>')
    pattern_anchor = re.compile(r'\s*<a[^>]+href="' + feed + r'"[^>]*>.*?</a>', re.S)
    # Pages one level down link the withdrawn feed by its absolute URL: the
    # gallery's French error page advertised `/rss.xml` after the root feed
    # had been deleted for being empty, because the sweep below only looked
    # at this directory and the index of each child. `rglob` reaches those,
    # and matching the exact href keeps a locale's own feed — `/fr/rss.xml`,
    # which does have an item — untouched.
    for page in root.rglob("*.html"):
        text = page.read_text(encoding="utf-8")
        cleaned = pattern_anchor.sub(
            "", pattern_link.sub("", pattern_item.sub("", text)))
        if cleaned != text:
            page.write_text(cleaned, encoding="utf-8")


def main() -> int:
    roots = [Path(a) for a in sys.argv[1:]]
    if not roots:
        print("usage: publish_404.py public/<theme> [...]", file=sys.stderr)
        return 2
    done = 0
    for root in roots:
        # The site root, plus any locale directory beneath it: a French
        # visitor who mistypes a URL under /fr/ should get the French page,
        # and each locale root needs its own `404.html` for the host to find.
        targets = [root] + sorted(
            # .parent is the "404" directory; its parent is the locale root.
            d.parent.parent for d in root.glob("*/404/index.html")
        )
        for target in targets:
            if publish(target) >= 0:
                done += 1
    if done:
        print(f"404: published for {done} site(s), excluded from the feeds")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
