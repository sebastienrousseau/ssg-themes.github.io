#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0 OR MIT
"""Inject the floating "back to the gallery" pill into a built theme demo.

This runs on `public/<theme>` during `scripts/build.sh`, so every published
demo page carries a one-click way back to the gallery (`/` or `/fr/`),
while the downloadable theme sources under `themes/<theme>` stay pure
standalone templates.

The pill's label names the number of themes, counted from
`themes/*/theme.toml` (the theme set's single source of truth), never typed
in. Its CSS ships as a stylesheet of its own, `_gallery/return-pill.<hash>.css`,
linked with its own `integrity` from each page it is added to. The
generator's fingerprinted bundles are never modified: appending to them made
their names stop matching their bytes, and any page this pass skipped kept a
stale integrity hash and lost its stylesheet. The pass is idempotent: a page
that already carries the pill is not changed again.
"""

from __future__ import annotations

import base64
import hashlib
import sys
from pathlib import Path

MARKER = "ssg-return-pill"
REPO_ROOT = Path(__file__).resolve().parents[1]

PILL_CSS = (
    # The fixed box is the rectangular nav, not the rounded pill: hit
    # testing follows border-radius, so a fixed pill's corners belonged to
    # whatever lay underneath and the focus gate read it as covered.
    "\n.ssg-return-nav{position:fixed;inset-block-end:0.875rem;"
    "inset-inline-start:0.875rem;z-index:9999;}"
    ".ssg-return-pill{display:inline-flex;"
    "align-items:center;justify-content:center;gap:0.35rem;"
    "min-height:2.75rem;min-width:2.75rem;padding:0.5rem 1rem;"
    # Fixed colours, not the theme's tokens: `--bg` and `--ink` mean
    # different things from theme to theme (voxt's dark scheme left the
    # label at 1.05:1). Near-black with white text is 18:1, the white ring
    # keeps it visible on a dark page, and the focus ring is two-tone so it
    # shows on any background.
    "border-radius:980px;background-color:#111111;color:#ffffff;"
    "border:2px solid #ffffff;"
    "box-shadow:0 0 0 2px #111111,0 8px 24px rgb(0 0 0 / 28%);"
    "font-family:system-ui,-apple-system,sans-serif;"
    "font-size:0.875rem;font-weight:600;line-height:1.2;"
    "letter-spacing:-0.01em;text-decoration:none;white-space:nowrap;"
    "cursor:pointer;}"
    ".ssg-return-pill:hover{background-color:#333333;color:#ffffff;"
    "text-decoration:underline;}"
    ".ssg-return-pill:focus,.ssg-return-pill:focus-visible{"
    "outline:3px solid #ffffff;outline-offset:2px;"
    "box-shadow:0 0 0 7px #111111;}"
    # The pill is fixed to a corner, so it could sit over whatever the
    # keyboard focuses next (WCAG 2.4.11, focus not obscured). It steps
    # aside while keyboard focus is anywhere else. This is CSS, not script:
    # appended JS would push the site theme's pages past their JS budget.
    "body:has(:focus-visible:not(.ssg-return-pill)) .ssg-return-nav{"
    "opacity:0!important;pointer-events:none!important;}"
    "@media (forced-colors:active){.ssg-return-pill{"
    "border:2px solid ButtonText;background:ButtonFace;color:ButtonText;}}"
    "@media print{.ssg-return-nav,.ssg-return-pill{display:none!important;}}\n"
)


def theme_count(themes_dir: Path = REPO_ROOT / "themes") -> int:
    """Number of themes in the set: one per `themes/<slug>/theme.toml`."""
    count = len(list(themes_dir.glob("*/theme.toml")))
    if count == 0:
        raise SystemExit(f"no themes found under {themes_dir}")
    return count


def nav_markup(count: int, french: bool) -> str:
    if french:
        return (
            '<nav class="ssg-return-nav" aria-label="Galerie de thèmes SSG">'
            f'<a class="{MARKER}" href="/fr/">← Les {count} thèmes</a></nav>'
        )
    return (
        '<nav class="ssg-return-nav" aria-label="SSG theme gallery">'
        f'<a class="{MARKER}" href="/">← All {count} themes</a></nav>'
    )


def sri_sha384(data: bytes) -> str:
    return "sha384-" + base64.b64encode(hashlib.sha384(data).digest()).decode("ascii")


def atomic_write(path: Path, text: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)


def write_stylesheet(root: Path) -> str:
    """Write the pill CSS as its own fingerprinted file; return its `<link>`.

    The file lives under the theme's `_gallery/` and is named for its
    content, so a changed pill gets a new URL and a cached copy can never
    be served against a new integrity hash. `style-src 'self'` covers it.
    """
    data = PILL_CSS.encode("utf-8")
    name = f"return-pill.{hashlib.sha384(data).hexdigest()[:8]}.css"
    target = root / "_gallery" / name
    target.parent.mkdir(exist_ok=True)
    if not target.is_file() or target.read_bytes() != data:
        target.write_bytes(data)
    return (
        f'<link rel="stylesheet" href="/{root.name}/_gallery/{name}" '
        f'integrity="{sri_sha384(data)}" crossorigin="anonymous">'
    )


def is_content_page(html: str) -> bool:
    """A real page: not a meta-refresh redirect, with a head, body and main."""
    return (
        'http-equiv="refresh"' not in html
        and "</head>" in html
        and "</body>" in html
        and "<main" in html
    )


def is_french(rel: str, html: str) -> bool:
    return rel.startswith("fr/") or 'lang="fr' in html[:300]


def patch_page(html: str, rel: str, link: str, count: int) -> str:
    if MARKER in html:
        return html
    nav = nav_markup(count, is_french(rel, html))
    html = html.replace("</head>", f"{link}</head>", 1)
    return html.replace("</body>", f"{nav}</body>", 1)


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: inject_return_pill.py <public/theme>", file=sys.stderr)
        return 2
    root = Path(argv[1])
    if not root.is_dir():
        print(f"inject_return_pill: not a directory: {root}", file=sys.stderr)
        return 1
    count = theme_count()
    link = write_stylesheet(root)
    for page in sorted(root.rglob("*.html")):
        html = page.read_text(encoding="utf-8", errors="replace")
        if not is_content_page(html):
            continue
        patched = patch_page(html, page.relative_to(root).as_posix(), link, count)
        if patched != html:
            atomic_write(page, patched)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
