#!/usr/bin/env python3
"""Structural gate for the theme monorepo.

Checks the things a theme registry and a downstream user rely on, and the
specific regressions that shipped in 1.0.0:

  * manifests present, agreeing with each other and with the directory name
  * required layouts, partials, config, docs and screenshots present
  * every layout inherits from `base.html` rather than duplicating a shell
  * page copy uses `{{!content}}` (unescaped), never `{{content}}`
  * the navigation disclosure button that the stylesheet reveals exists
  * no third-party host, tracker or CDN reference anywhere in the sources
  * no leftover personal identifiers from the 1.0.0 Atlas snapshot
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

THEMES = ("apex", "atlas", "velocity")

REQUIRED_FILES = (
    "theme.toml",
    "theme.json",
    "ssg.toml",
    "README.md",
    "CHANGELOG.md",
    "images/screenshot.png",
    "images/tn.png",
    "content/content.schema.toml",
    "_layouts/base.html",
    "_layouts/header.html",
    "_layouts/footer.html",
    "_layouts/page.html",
    "_layouts/index.html",
    "_layouts/404.html",
    "_layouts/styles.css",
    "_layouts/main.js",
    "_layouts/theme-init.js",
)

# Hosts and vendor names that must never reappear in theme sources.
FORBIDDEN = (
    "cdn.jsdelivr.net",
    "unpkg.com",
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "googletagmanager.com",
    "google-analytics.com",
    "clarity.ms",
    "cloudflareinsights.com",
    "formspree.io",
    "open.spotify.com",
    "cloudcdn.pro",
    "bootstrap@",
    "sebastienrousseau.com",
    "orcid.org",
)

# Screenshot sizes required by theme registries (Hugo's is the strictest).
MIN_SCREENSHOT = (1500, 1000)
MIN_THUMBNAIL = (900, 600)


def png_size(path: Path) -> tuple[int, int] | None:
    """Reads width/height from a PNG IHDR without an image library."""
    data = path.read_bytes()[:33]
    if len(data) < 33 or data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")


def check_theme(root: Path, name: str) -> list[str]:
    errors: list[str] = []
    theme = root / "themes" / name

    if not theme.is_dir():
        return [f"{name}: directory missing"]

    for rel in REQUIRED_FILES:
        if not (theme / rel).is_file():
            errors.append(f"{name}: missing {rel}")

    # --- manifests agree with each other and with the directory ---
    tj = theme / "theme.json"
    if tj.is_file():
        try:
            data = json.loads(tj.read_text())
            if data.get("name") != name:
                errors.append(
                    f"{name}: theme.json name is {data.get('name')!r}, "
                    f"expected {name!r} (must match the directory)"
                )
            for field in ("version", "license", "min_ssg_version",
                          "demosite", "screenshot"):
                if not data.get(field):
                    errors.append(f"{name}: theme.json missing {field}")
            if data.get("license") != "MIT":
                errors.append(
                    f"{name}: theme.json license is {data.get('license')!r}; "
                    "the repository LICENSE is MIT"
                )
        except (OSError, ValueError) as exc:
            errors.append(f"{name}: theme.json unreadable — {exc}")

    # --- screenshots at registry-required sizes ---
    for rel, (min_w, min_h) in (
        ("images/screenshot.png", MIN_SCREENSHOT),
        ("images/tn.png", MIN_THUMBNAIL),
    ):
        p = theme / rel
        if not p.is_file():
            continue
        size = png_size(p)
        if size is None:
            errors.append(f"{name}: {rel} is not a readable PNG")
        elif size[0] < min_w or size[1] < min_h:
            errors.append(
                f"{name}: {rel} is {size[0]}x{size[1]}, "
                f"registries require at least {min_w}x{min_h}"
            )

    layouts = sorted((theme / "_layouts").glob("*.html"))
    partials = {"base.html", "header.html", "footer.html"}

    for layout in layouts:
        text = layout.read_text(encoding="utf-8")

        # Escaped content renders Markdown output as visible source. This
        # is the 1.0.0 bug that forced every content body to stay empty.
        if re.search(r"\{\{\s*content\s*\}\}", text):
            errors.append(
                f"{name}: {layout.name} uses escaped {{{{content}}}}; "
                "use {{!content}} so Markdown renders as HTML"
            )

        if layout.name in partials:
            continue

        if "{{#extends" not in text:
            errors.append(
                f"{name}: {layout.name} does not extend base.html — "
                "the document shell must not be duplicated per layout"
            )
        if "<!DOCTYPE" in text.upper():
            errors.append(
                f"{name}: {layout.name} declares its own doctype; "
                "only base.html should"
            )

    # --- the control the stylesheet reveals must exist ---
    header = theme / "_layouts" / "header.html"
    css = theme / "_layouts" / "styles.css"
    if header.is_file() and css.is_file():
        header_text = header.read_text(encoding="utf-8")
        css_text = css.read_text(encoding="utf-8")
        if ".nav-toggle" in css_text and 'id="navToggle"' not in header_text:
            errors.append(
                f"{name}: styles.css styles .nav-toggle but header.html "
                "emits no #navToggle — mobile navigation would be unreachable"
            )
        if "aria-expanded" not in header_text:
            errors.append(f"{name}: nav disclosure lacks aria-expanded")
        if ":focus-visible" not in css_text:
            errors.append(f"{name}: styles.css defines no :focus-visible ring")
        if "prefers-reduced-motion" not in css_text:
            errors.append(
                f"{name}: styles.css has no prefers-reduced-motion block"
            )

    # --- no third-party or personal references anywhere in the theme ---
    for path in theme.rglob("*"):
        if not path.is_file() or path.suffix in {".png", ".jpg", ".ico", ".gz", ".zip"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        lowered = text.lower()
        for needle in FORBIDDEN:
            if needle in lowered:
                errors.append(
                    f"{name}: {path.relative_to(theme)} references {needle}"
                )

    return errors


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    all_errors: list[str] = []

    for name in THEMES:
        all_errors.extend(check_theme(root, name))

    stray = sorted(root.rglob(".DS_Store"))
    for s in stray:
        if ".git/" not in str(s):
            all_errors.append(f"repo: {s.relative_to(root)} is committed")

    if all_errors:
        print(f"validate: {len(all_errors)} failure(s)\n")
        for e in all_errors:
            print(f"  FAIL  {e}")
        return 1

    print(f"validate: {len(THEMES)} themes pass structural checks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
