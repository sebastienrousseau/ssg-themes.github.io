#!/usr/bin/env python3
"""Site-chrome consistency gate for the built showcase.

Within one theme and one locale, every page must carry the same header and
the same footer, and every page must load the theme's base stylesheets and
scripts. A reader moving between pages of a theme should never see the
chrome change under them.

Each of these shipped before this gate existed, and none was caught by the
others, because every page was individually valid:

  * Atlas's tag pages render through a separate MiniJinja base that the
    Skeletonic v3 migration never touched: no Skeletonic stylesheet, no
    mode toggle, a different header and a credit-only footer.
  * French inner pages of nine themes kept the English header CTA.
  * `publish_404.py public` withdrew the gallery's empty feed from every
    theme's home page, so seven home footers listed no feeds at all.
  * `404.html` skipped the heading-id pass the rest of the site gets.

Compared after normalising what legitimately varies per page: whitespace,
comments, `aria-current`, and heading ids (the id pass suffixes a footer
heading with `-2` when the page body already uses the id). Per-page extras
are allowed on top of the base asset set: a code page adds highlight.css, a
pricing page its island, a tag page taxonomy.js.

Run by `make check` after a build, and by CI.
"""
from __future__ import annotations

import collections
import re
import sys
from pathlib import Path

ROOT = Path("public")
THEMES = Path("themes")

HEADER = re.compile(r'<header class="site-header[^"]*"[^>]*>.*?</header>', re.S)
FOOTER = re.compile(r'<footer class="site-footer[^"]*"[^>]*>.*?</footer>', re.S)
STYLES = re.compile(r'<link rel="stylesheet" href="([^"]+)"')
SCRIPTS = re.compile(r'<script[^>]*\ssrc="([^"]+)"')
FINGERPRINT = re.compile(r"\.[0-9a-f]{8}\.")


def normalise(fragment: str) -> str:
    fragment = re.sub(r"<!--.*?-->", "", fragment, flags=re.S)
    fragment = re.sub(r'\s+aria-current="[^"]*"', "", fragment)
    fragment = re.sub(r'(<h[1-6][^>]*?)\s+id="[^"]*"', r"\1", fragment)
    fragment = re.sub(r"\s+", " ", fragment)
    fragment = re.sub(r">\s+<", "><", fragment)
    return re.sub(r"\s+>", ">", fragment).strip()


def assets(pattern: re.Pattern[str], html: str) -> frozenset[str]:
    # `_csp/` files are the generator's per-page extraction of inline code;
    # their names are content hashes, so they differ by design.
    return frozenset(
        FINGERPRINT.sub(".", url) for url in pattern.findall(html) if "/_csp/" not in url
    )


def main() -> int:
    themes = sorted(p.name for p in THEMES.iterdir() if p.is_dir())
    if not themes or not ROOT.is_dir():
        print("chrome: nothing to check; run `make build` first", file=sys.stderr)
        return 1

    failures: list[str] = []
    checked = 0
    for theme in themes:
        groups: dict[str, list[tuple[str, dict[str, object]]]] = collections.defaultdict(list)
        for page in sorted((ROOT / theme).rglob("*.html")):
            html = page.read_text(encoding="utf-8", errors="replace")
            if "<html" not in html or "site-header" not in html:
                continue  # redirect stubs and fragments carry no chrome
            rel = page.relative_to(ROOT / theme).as_posix()
            header, footer = HEADER.search(html), FOOTER.search(html)
            groups["fr" if rel.startswith("fr/") else "en"].append((rel, {
                "header": normalise(header.group(0)) if header else None,
                "footer": normalise(footer.group(0)) if footer else None,
                "css": assets(STYLES, html),
                "js": assets(SCRIPTS, html),
            }))
        for locale, pages in groups.items():
            checked += len(pages)
            for part in ("header", "footer"):
                seen = collections.Counter(chrome[part] for _, chrome in pages)
                if len(seen) > 1:
                    usual = seen.most_common(1)[0][0]
                    odd = [rel for rel, chrome in pages if chrome[part] != usual]
                    failures.append(f"{theme} ({locale}) {part} differs on: {', '.join(odd)}")
            for part in ("css", "js"):
                base = frozenset.intersection(*(chrome[part] for _, chrome in pages))
                usual = collections.Counter(chrome[part] for _, chrome in pages).most_common(1)[0][0]
                missing = [rel for rel, chrome in pages if not usual <= chrome[part]]
                if missing and base != usual:
                    failures.append(
                        f"{theme} ({locale}) {part}: {', '.join(missing)} lack "
                        f"{', '.join(sorted(usual - base))}")

    if failures:
        print(f"chrome: {len(failures)} inconsistenc{'y' if len(failures) == 1 else 'ies'}:", file=sys.stderr)
        for failure in failures:
            print(f"  FAIL  {failure}", file=sys.stderr)
        return 1
    print(f"chrome: {checked} pages across {len(themes)} themes share one header, "
          "footer and base asset set per locale")
    return 0


if __name__ == "__main__":
    sys.exit(main())
