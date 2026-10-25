#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2007-2026 Sebastien Rousseau
# SPDX-License-Identifier: MIT
"""Import sebastienrousseau.com's generated layouts as a StaticWeaver theme.

The site keeps twelve flat layouts in ``_layouts/``, each 213 KB because
the whole stylesheet is inlined in every one of them. They share one
shell; what differs per layout is exactly four regions:

  head_extra  an optional ``<meta name="banner-src">`` before the canonical
  styles      CSS appended at the end of the shared ``<style>`` block
  main        everything between ``</header>`` and ``<footer class="ap-foot">``
  schema      the per-layout JSON-LD block before ``main.js``

plus one slot, ``font_preload``. The site used to preload the Newsreader
font in every layout but ``playlist.html``; since the theme paints its
first view in system faces, no layout preloads it and the slot is empty.

This tool cuts the shell once into ``base.html`` + ``header.html`` +
``footer.html`` + ``styles.css`` and writes one small layout per kind that
``{{#extends "base"}}`` and fills those blocks. ``flatten.py`` performs the
inverse; ``extract → flatten`` must reproduce the site's files byte for
byte, which is the theme's fidelity proof.

Usage: extract_from_site.py <site _layouts dir> <theme dir>
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

LAYOUTS = (
    "index",
    "about",
    "articles",
    "contact",
    "link",
    "page",
    "papers",
    "playlist",
    "project",
    "report",
    "story",
    "thank-you",
)

ALIASES = {"404": "link"}

HEADER_START = '    <header class="ap-nav"'
HEADER_END = "    </header>\n"
FOOTER_START = '    <footer class="ap-foot">'
FOOTER_END = "    </footer>\n"
STYLE_OPEN = "    <style>\n"
STYLE_CLOSE = "    </style>\n"
CANONICAL = '    <link rel="canonical"'
BANNER_META = '    <meta name="banner-src" content="{{banner}}" />\n'
FONT_PRELOAD = (
    '    <link rel="preload" as="font" type="font/woff2" '
    'href="/fonts/newsreader-latin.woff2" crossorigin />\n'
)
FONTS_CSS = '    <link rel="stylesheet" href="/fonts/fonts.css" />\n'
MAIN_SCRIPT = '<script src="/main.js" defer></script>\n'
SCHEMA_MARK = "    <!-- Schema.org structured data -->\n"


def normalise_head(head: str) -> str:
    """Byte-level normalisations applied to every layout's head on import.

    One: the JSON-LD graph hard-codes ``"inLanguage": "en-GB"`` and the site's
    postbuild rewrites it per locale afterwards; the theme uses
    ``{{language}}``, which every page already supplies for ``<html lang>``.
    English pages render identically; locale pages render the right value at
    compile time and the postbuild rewrite becomes a no-op.

    Two: the head comment that documents the CSP quoted a literal
    ``<script type="application/ld+json">``. Three scanners that are not
    comment-aware (the site's language-leakage gate, the gallery's
    structured-data check and ``ssg audit``) read that quoted tag as a real
    block; the site's own postbuild had to strip comments to work around it.
    The reworded comment says the same thing without the tag. It is delivered
    in every page, so this is the one normalisation that changes output
    bytes: an HTML comment, measured against the baseline build as the only
    difference on every page.
    """
    return head.replace(
        'Strict CSP. Inline <script type="application/ld+json"> JSON-LD blocks',
        "Strict CSP. Inline JSON-LD script blocks",
        1,
    )


def cut(text: str, start: str, end: str) -> tuple[str, str, str]:
    """Return (before, middle, after) where middle spans start..end inclusive."""
    a = text.index(start)
    b = text.index(end, a) + len(end)
    return text[:a], text[a:b], text[b:]


@dataclass(frozen=True)
class Shell:
    """The regions of ``index.html`` that every layout shares."""

    head: str
    css: str
    before_header: str
    header: str
    main_region: str
    footer: str
    schema_region: str
    tail: str


def localise(schema: str) -> str:
    """Use ``{{language}}`` for the JSON-LD graph's hard-coded en-GB."""
    return schema.replace('"inLanguage": "en-GB"', '"inLanguage": "{{language}}"').replace(
        '"inLanguage":"en-GB"', '"inLanguage":"{{language}}"'
    )


def split_shell(index: str) -> Shell:
    head, style_block, after_style = cut(index, STYLE_OPEN, STYLE_CLOSE)
    before_header, header, after_header = cut(after_style, HEADER_START, HEADER_END)
    main_region, footer, after_footer = cut(after_header, FOOTER_START, FOOTER_END)
    # after_footer = blank line + schema block + main.js + </body></html>
    schema_region, tail = after_footer.split(MAIN_SCRIPT, 1)
    assert schema_region.startswith("\n" + SCHEMA_MARK), schema_region[:80]
    css = style_block[len(STYLE_OPEN) : -len(STYLE_CLOSE)]
    return Shell(normalise_head(head), css, before_header, header, main_region, footer, schema_region, tail)


def font_preload_slot(head: str) -> str:
    """Put the ``font_preload`` block where the font preload is, or was.

    The theme paints its first view in system faces, so the shell may
    preload no font; the empty block then sits where the preload stood,
    just before the font stylesheet, so a layout can still fill it.
    """
    if FONT_PRELOAD in head:
        return head.replace(FONT_PRELOAD, '{{#block "font_preload"}}' + FONT_PRELOAD + "{{/block}}", 1)
    assert head.count(FONTS_CSS) == 1, "font stylesheet line moved; update extractor"
    return head.replace(FONTS_CSS, '{{#block "font_preload"}}{{/block}}' + FONTS_CSS, 1)


def build_base(shell: Shell) -> str:
    # The one normalisation applied on import is `{{!content}}` for
    # `{{content}}`, the raw form the gallery mandates; it never reaches the
    # output. Nothing else changes a byte.
    assert shell.head.count(CANONICAL) == 1
    return (
        font_preload_slot(shell.head).replace(CANONICAL, '{{#block "head_extra"}}{{/block}}' + CANONICAL, 1)
        + STYLE_OPEN
        + "{{> partials/styles}}"
        + '{{#block "styles"}}{{/block}}'
        + STYLE_CLOSE
        + shell.before_header
        + "{{> header}}"
        + '{{#block "main"}}'
        + shell.main_region.replace("{{content}}", "{{!content}}")
        + "{{/block}}"
        + "{{> footer}}"
        + '{{#block "schema"}}'
        + localise(shell.schema_region)
        + "{{/block}}"
        + MAIN_SCRIPT
        + shell.tail
    )


def write_shell(layouts_dir: Path, base: str, shell: Shell) -> None:
    layouts_dir.mkdir(parents=True, exist_ok=True)
    (layouts_dir / "base.html").write_text(base, encoding="utf-8")
    (layouts_dir / "header.html").write_text(shell.header, encoding="utf-8")
    (layouts_dir / "footer.html").write_text(shell.footer, encoding="utf-8")
    # `styles.css` is the stylesheet's source of truth (the gallery contract
    # wants that file). StaticWeaver resolves `{{> partials/styles}}` to
    # `partials/styles.html` only, so that path is a symlink to the same
    # bytes; it sits in a subdirectory so the gallery validator does not
    # take it for a layout.
    (layouts_dir / "styles.css").write_text(shell.css, encoding="utf-8")
    partials = layouts_dir / "partials"
    partials.mkdir(exist_ok=True)
    link = partials / "styles.html"
    if link.is_symlink() or link.exists():
        link.unlink()
    link.symlink_to("../styles.css")


def split_layout(name: str, text: str, shell: Shell) -> tuple[str, str, str, str]:
    """Return one site layout's (head, extra CSS, main, schema) regions."""
    l_head, l_style, l_after = cut(text, STYLE_OPEN, STYLE_CLOSE)
    l_css = l_style[len(STYLE_OPEN) : -len(STYLE_CLOSE)]
    assert l_css.startswith(shell.css), f"{name}: shared CSS diverged from index"
    _, _, l_after_header = cut(l_after, HEADER_START, HEADER_END)
    l_main, _, l_after_footer = cut(l_after_header, FOOTER_START, FOOTER_END)
    l_schema, l_tail = l_after_footer.split(MAIN_SCRIPT, 1)
    assert l_tail == shell.tail, f"{name}: tail differs"
    return normalise_head(l_head), l_css[len(shell.css) :], l_main, l_schema


def layout_override(name: str, text: str, shell: Shell) -> str:
    """Return the small ``{{#extends "base"}}`` layout for one site layout."""
    l_head, extra_css, l_main, l_schema = split_layout(name, text, shell)
    head_extra = BANNER_META if BANNER_META in l_head else ""
    drop_preload = FONT_PRELOAD in shell.head and FONT_PRELOAD not in l_head
    # Everything else in the head must match the shell exactly.
    expected = shell.head.replace(FONT_PRELOAD, "", 1) if drop_preload else shell.head
    assert expected == l_head.replace(BANNER_META, "", 1), f"{name}: head differs from the shell beyond the known slots"

    l_schema = localise(l_schema)
    parts = ['{{#extends "base"}}\n']
    if drop_preload:
        parts.append('{{#block "font_preload"}}{{/block}}\n')
    if head_extra:
        parts.append('{{#block "head_extra"}}' + head_extra + "{{/block}}\n")
    if extra_css:
        parts.append('{{#block "styles"}}' + extra_css + "{{/block}}\n")
    parts.append('{{#block "main"}}' + l_main.replace("{{content}}", "{{!content}}") + "{{/block}}\n")
    if l_schema != localise(shell.schema_region):
        parts.append('{{#block "schema"}}' + l_schema + "{{/block}}\n")
    return "".join(parts)


def main(src: Path, dst: Path) -> None:
    shell = split_shell((src / "index.html").read_text(encoding="utf-8"))
    base = build_base(shell)
    layouts_dir = dst / "_layouts"
    write_shell(layouts_dir, base, shell)

    # --- per-layout overrides --------------------------------------------
    for name in LAYOUTS:
        text = (src / f"{name}.html").read_text(encoding="utf-8")
        (layouts_dir / f"{name}.html").write_text(layout_override(name, text, shell), encoding="utf-8")

    # --- alias layouts the gallery contract requires -----------------------
    # The site renders 404.md through `link`; the gallery wants a `404.html`
    # layout. It is the same template under the name the contract expects.
    # `flatten.py --site` leaves aliases out so the site's set stays twelve.
    for alias, source in ALIASES.items():
        (layouts_dir / f"{alias}.html").write_bytes((layouts_dir / f"{source}.html").read_bytes())

    # --- verbatim assets --------------------------------------------------
    for asset in ("main.js", "theme-init.js", "search.js", "search.css", "sw.js"):
        (layouts_dir / asset).write_bytes((src / asset).read_bytes())
    (layouts_dir / "skeletonic.min.css").write_bytes((src / "_skeletonic.min.css").read_bytes())
    print(f"theme written to {dst}: {len(LAYOUTS)} layouts, shell {len(base):,} B, css {len(shell.css):,} B")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
