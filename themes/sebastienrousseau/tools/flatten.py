#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2007-2026 Sebastien Rousseau
# SPDX-License-Identifier: MIT
"""Flatten the sebastienrousseau theme into sebastienrousseau.com's layouts.

The site compiles with the legacy ``ssg -c -t -o`` form against flat
layouts and its postbuild reads those files directly (CSP meta, theme-init,
design-token freeze), so it consumes the theme in flattened form: every
``{{#extends "base"}}`` resolved, every ``{{> partial}}`` inlined, the
stylesheet inlined into the shell's ``<style>`` block. The one token that
differs from the layouts the site committed before the theme existed is
``{{!content}}`` (raw) for ``{{content}}``: staticdatagen 0.0.21 and later
render both without escaping, so the compiled pages are identical.

This is a deliberately literal resolver for the four constructs the theme
uses, so that the output is byte-for-byte what the site had before the
theme existed:

  {{#extends "base"}}                child declares its parent
  {{#block "name"}}…{{/block}}       override (child) or default (base)
  {{> name}}                         partial include, verbatim (name.html;
                                     partials/styles.html links to styles.css)

Usage: flatten.py [--site] <theme dir> <site _layouts dir>

``--site`` leaves out the alias layouts the gallery contract requires (``404``,
which the site renders through ``link``), so the site keeps exactly its set.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

BLOCK_RE = re.compile(r'\{\{#block "([a-z_]+)"\}\}(.*?)\{\{/block\}\}', re.S)
EXTENDS_RE = re.compile(r'^\{\{#extends "([a-z]+)"\}\}\n')
PARTIAL_RE = re.compile(r"\{\{> ([a-z/]+)\}\}")
PARTIALS = ("base", "header", "footer")
ALIASES = ("404",)
ASSETS = {
    "main.js": "main.js",
    "theme-init.js": "theme-init.js",
    "search.js": "search.js",
    "search.css": "search.css",
    "sw.js": "sw.js",
    "skeletonic.min.css": "_skeletonic.min.css",
}


def flatten_one(theme: Path, child: str) -> str:
    text = child
    m = EXTENDS_RE.match(text)
    if not m:
        return text
    base = (theme / f"{m.group(1)}.html").read_text(encoding="utf-8")
    overrides = {k: v for k, v in BLOCK_RE.findall(text[m.end() :])}

    def fill(match: re.Match[str]) -> str:
        name, default = match.group(1), match.group(2)
        return overrides.get(name, default)

    out = BLOCK_RE.sub(fill, base)
    out = PARTIAL_RE.sub(lambda p: (theme / f"{p.group(1)}.html").read_text(encoding="utf-8"), out)
    return out


def main(theme: Path, dst: Path, site: bool = False) -> None:
    dst.mkdir(parents=True, exist_ok=True)
    skip = set(PARTIALS) | (set(ALIASES) if site else set())
    layouts = sorted(p for p in theme.glob("*.html") if p.stem not in skip and not p.is_symlink())
    for p in layouts:
        (dst / p.name).write_text(flatten_one(theme, p.read_text(encoding="utf-8")), encoding="utf-8")
    for src, name in ASSETS.items():
        (dst / name).write_bytes((theme / src).read_bytes())
    print(f"flattened {len(layouts)} layouts + {len(ASSETS)} assets into {dst}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--site"]
    main(Path(args[0]), Path(args[1]), site="--site" in sys.argv[1:])
