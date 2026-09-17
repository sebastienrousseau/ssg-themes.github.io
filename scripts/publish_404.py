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
    )
    return removed


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
