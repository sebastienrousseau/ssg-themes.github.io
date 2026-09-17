#!/usr/bin/env python3
"""Verify that every theme uses raster imagery from the local CloudCDN repo.

Registry screenshots and thumbnails are excluded: they are generated from the
local theme builds and are not source photography. Set CLOUDCDN_ROOT to use a
checkout outside the standard ~/Code/Public/JavaScript/cloudcdn.pro location.
"""

from __future__ import annotations

import hashlib
import os
from pathlib import Path
import sys


REPO = Path(__file__).resolve().parents[1]
THEMES = REPO / "themes"
DEFAULT_CDN = REPO.parents[1] / "JavaScript" / "cloudcdn.pro"
CDN = Path(os.environ.get("CLOUDCDN_ROOT", DEFAULT_CDN)).expanduser().resolve()
RASTER_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}
GENERATED_PREVIEWS = {"screenshot.png", "screenshot.webp", "tn.png", "tn.webp"}
REFERENCE_EXTENSIONS = {".css", ".html", ".js", ".json", ".md", ".styl", ".toml"}


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def rasters(root: Path):
    return sorted(
        path
        for path in root.rglob("*")
        if path.is_file() and path.suffix.lower() in RASTER_EXTENSIONS
    )


def is_referenced(asset: Path, theme_root: Path) -> bool:
    """Return whether a theme source file references an image by filename."""
    needle = asset.name.encode()
    for source in theme_root.rglob("*"):
        if not source.is_file() or source.suffix.lower() not in REFERENCE_EXTENSIONS:
            continue
        try:
            if needle in source.read_bytes():
                return True
        except OSError:
            continue
    return False


def main() -> int:
    if not CDN.is_dir():
        print(f"error: CloudCDN checkout not found: {CDN}", file=sys.stderr)
        print("set CLOUDCDN_ROOT to its local path", file=sys.stderr)
        return 2

    cdn_hashes: dict[str, Path] = {}
    for source in rasters(CDN):
        cdn_hashes.setdefault(digest(source), source)

    theme_dirs = sorted(path for path in THEMES.iterdir() if path.is_dir())
    source_assets = [
        path
        for path in rasters(THEMES)
        if path.name not in GENERATED_PREVIEWS
    ]

    failures: list[Path] = []
    photographic_themes: set[str] = set()
    referenced_themes: set[str] = set()
    for asset in source_assets:
        theme = asset.relative_to(THEMES).parts[0]
        source = cdn_hashes.get(digest(asset))
        if source is None:
            failures.append(asset)
            print(f"NO MATCH  {asset.relative_to(REPO)}")
            continue
        photographic_themes.add(theme)
        if is_referenced(asset, THEMES / theme):
            referenced_themes.add(theme)

    if failures:
        print(
            f"cloudcdn-images: FAIL — {len(failures)} raster asset(s) have no exact CloudCDN match",
            file=sys.stderr,
        )
        return 1

    non_photographic = [path.name for path in theme_dirs if path.name not in photographic_themes]
    unreferenced = [path.name for path in theme_dirs if path.name not in referenced_themes]
    if non_photographic:
        print(
            "cloudcdn-images: FAIL — themes without CloudCDN imagery: "
            + ", ".join(non_photographic),
            file=sys.stderr,
        )
        return 1
    if unreferenced:
        print(
            "cloudcdn-images: FAIL — themes without referenced CloudCDN imagery: "
            + ", ".join(unreferenced),
            file=sys.stderr,
        )
        return 1

    print(
        f"cloudcdn-images: PASS — {len(source_assets)} raster assets across "
        f"{len(photographic_themes)} themes match CloudCDN byte-for-byte and every "
        "theme references CloudCDN imagery"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
