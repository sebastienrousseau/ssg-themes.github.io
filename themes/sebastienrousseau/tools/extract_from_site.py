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

plus one quirk: ``playlist.html`` drops the Newsreader font preload.

This tool cuts the shell once into ``base.html`` + ``header.html`` +
``footer.html`` + ``styles.css`` and writes one small layout per kind that
``{{#extends "base"}}`` and fills those blocks. ``flatten.py`` performs the
inverse; ``extract → flatten`` must reproduce the site's files byte for
byte, which is the theme's fidelity proof.

Usage: extract_from_site.py <site _layouts dir> <theme dir>
"""

from __future__ import annotations

import sys
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


def main(src: Path, dst: Path) -> None:
    index = (src / "index.html").read_text(encoding="utf-8")

    # --- shared shell from index.html ------------------------------------
    head, style_block, after_style = cut(index, STYLE_OPEN, STYLE_CLOSE)
    css = style_block[len(STYLE_OPEN) : -len(STYLE_CLOSE)]
    before_header, header, after_header = cut(after_style, HEADER_START, HEADER_END)
    mid_and_rest = after_header
    main_region, footer, after_footer = cut(mid_and_rest, FOOTER_START, FOOTER_END)
    # after_footer = blank line + schema block + main.js + </body></html>
    schema_region, tail = after_footer.split(MAIN_SCRIPT, 1)
    assert schema_region.startswith("\n" + SCHEMA_MARK), schema_region[:80]

    # The one normalisation applied on import is `{{!content}}` for
    # `{{content}}`, the raw form the gallery mandates; it never reaches the
    # output. Nothing else changes a byte.
    head = normalise_head(head)
    assert FONT_PRELOAD in head, "font preload line moved; update extractor"
    assert head.count(CANONICAL) == 1

    base = (
        head.replace(FONT_PRELOAD, '{{#block "font_preload"}}' + FONT_PRELOAD + "{{/block}}", 1)
        .replace(CANONICAL, '{{#block "head_extra"}}{{/block}}' + CANONICAL, 1)
        + STYLE_OPEN
        + "{{> partials/styles}}"
        + '{{#block "styles"}}{{/block}}'
        + STYLE_CLOSE
        + before_header
        + "{{> header}}"
        + '{{#block "main"}}'
        + main_region.replace("{{content}}", "{{!content}}")
        + "{{/block}}"
        + "{{> footer}}"
        + '{{#block "schema"}}'
        + schema_region.replace('"inLanguage": "en-GB"', '"inLanguage": "{{language}}"').replace('"inLanguage":"en-GB"', '"inLanguage":"{{language}}"')
        + "{{/block}}"
        + MAIN_SCRIPT
        + tail
    )

    layouts_dir = dst / "_layouts"
    layouts_dir.mkdir(parents=True, exist_ok=True)
    (layouts_dir / "base.html").write_text(base, encoding="utf-8")
    (layouts_dir / "header.html").write_text(header, encoding="utf-8")
    (layouts_dir / "footer.html").write_text(footer, encoding="utf-8")
    # `styles.css` is the stylesheet's source of truth (the gallery contract
    # wants that file). StaticWeaver resolves `{{> partials/styles}}` to
    # `partials/styles.html` only, so that path is a symlink to the same
    # bytes; it sits in a subdirectory so the gallery validator does not
    # take it for a layout.
    (layouts_dir / "styles.css").write_text(css, encoding="utf-8")
    partials = layouts_dir / "partials"
    partials.mkdir(exist_ok=True)
    link = partials / "styles.html"
    if link.is_symlink() or link.exists():
        link.unlink()
    link.symlink_to("../styles.css")

    # --- per-layout overrides --------------------------------------------
    for name in LAYOUTS:
        text = (src / f"{name}.html").read_text(encoding="utf-8")
        l_head, l_style, l_after = cut(text, STYLE_OPEN, STYLE_CLOSE)
        l_head = normalise_head(l_head)
        l_css = l_style[len(STYLE_OPEN) : -len(STYLE_CLOSE)]
        assert l_css.startswith(css), f"{name}: shared CSS diverged from index"
        extra_css = l_css[len(css) :]
        _, _, l_after_header = cut(l_after, HEADER_START, HEADER_END)
        l_main, _, l_after_footer = cut(l_after_header, FOOTER_START, FOOTER_END)
        l_schema, l_tail = l_after_footer.split(MAIN_SCRIPT, 1)
        assert l_tail == tail, f"{name}: tail differs"
        head_extra = BANNER_META if BANNER_META in l_head else ""
        drop_preload = FONT_PRELOAD not in l_head
        # Everything else in the head must match the shell exactly.
        probe = l_head.replace(BANNER_META, "", 1)
        if drop_preload:
            probe = head.replace(FONT_PRELOAD, "", 1) == probe
        else:
            probe = head == probe
        assert probe, f"{name}: head differs from the shell beyond the known slots"

        l_schema = l_schema.replace('"inLanguage": "en-GB"', '"inLanguage": "{{language}}"').replace('"inLanguage":"en-GB"', '"inLanguage":"{{language}}"')
        parts = [f'{{{{#extends "base"}}}}\n']
        if drop_preload:
            parts.append('{{#block "font_preload"}}{{/block}}\n')
        if head_extra:
            parts.append('{{#block "head_extra"}}' + head_extra + "{{/block}}\n")
        if extra_css:
            parts.append('{{#block "styles"}}' + extra_css + "{{/block}}\n")
        parts.append('{{#block "main"}}' + l_main.replace("{{content}}", "{{!content}}") + "{{/block}}\n")
        if l_schema != schema_region.replace('"inLanguage": "en-GB"', '"inLanguage": "{{language}}"').replace('"inLanguage":"en-GB"', '"inLanguage":"{{language}}"'):
            parts.append('{{#block "schema"}}' + l_schema + "{{/block}}\n")
        (layouts_dir / f"{name}.html").write_text("".join(parts), encoding="utf-8")

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
    print(f"theme written to {dst}: {len(LAYOUTS)} layouts, shell {len(base):,} B, css {len(css):,} B")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
