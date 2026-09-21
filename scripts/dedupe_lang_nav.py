#!/usr/bin/env python3
"""Keep one language switcher per page.

The generator's i18n plugin injects its own `<nav class="lang-switcher">`
into some layouts and not others, depending on where it finds an anchor in
the navigation. A theme that also ships its own switcher therefore ends up
with two <nav> landmarks both labelled "Language" on some pages and one on
others — an ambiguous accessibility tree, and an inconsistent interface.

The theme's own switcher wins: it is present on every page, carries full
language names rather than two-letter codes, and is the one control the
whole suite now shares. The injected one is removed wherever both appear.
"""
import re
import sys
from pathlib import Path

INJECTED = re.compile(r'\s*<nav class="lang-switcher".*?</nav>', re.S)


def main() -> int:
    roots = [Path(a) for a in sys.argv[1:]] or [Path("public")]
    changed = 0
    for root in roots:
        for page in root.rglob("*.html"):
            text = page.read_text(encoding="utf-8")
            if 'class="ap-lang"' not in text or 'class="lang-switcher"' not in text:
                continue
            cleaned = INJECTED.sub("", text, count=1)
            if cleaned != text:
                page.write_text(cleaned, encoding="utf-8")
                changed += 1
    if changed:
        print(f"lang-nav: removed {changed} duplicate injected switcher(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
