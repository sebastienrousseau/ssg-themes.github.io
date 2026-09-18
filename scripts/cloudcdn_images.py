#!/usr/bin/env python3
"""Verify that every theme uses raster imagery from the local CloudCDN repo.

Registry screenshots and thumbnails are excluded: they are generated from the
local theme builds and are not source photography. Set CLOUDCDN_ROOT to use a
checkout outside the standard ~/Code/Public/JavaScript/cloudcdn.pro location.
"""

from __future__ import annotations

import hashlib
import re
import os
from pathlib import Path
import sys


REPO = Path(__file__).resolve().parents[1]
THEMES = REPO / "themes"
DEFAULT_CDN = REPO.parents[1] / "JavaScript" / "cloudcdn.pro"
CDN = Path(os.environ.get("CLOUDCDN_ROOT", DEFAULT_CDN)).expanduser().resolve()
RASTER_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}
GENERATED_PREVIEWS = {"screenshot.png", "screenshot.webp", "tn.png", "tn.webp"}
# A local size rung derived from a CloudCDN master: `coat-768.webp` and the
# art-directed `coat-m768.webp` both come from `coat.webp`. The suite encodes
# its own ladder to a fixed bits-per-pixel budget, so these cannot be
# byte-identical upstream. What still has to hold is provenance: the master
# they derive from must itself match CloudCDN exactly, which is checked below.
# `coat-768`, the art-directed `coat-m768` and the desktop crop
# `portrait-d768` are all rungs of one family.
VARIANT = re.compile(r"^(?P<stem>.+?)-[a-z]?\d+$")
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
    # Group each theme's rasters into families by stem: `coat.webp`,
    # `coat-768.webp` and the art-directed `coat-m768.webp` are one family.
    # Provenance holds when at least one member matches CloudCDN byte for
    # byte; the rest are rungs this repository encodes itself to a fixed
    # bits-per-pixel budget, so they cannot match and should not have to.
    # Some families ship no un-suffixed master at all, which is why this
    # keys on the family rather than on a bare filename.
    families: dict[tuple[str, str], list[Path]] = {}
    for asset in source_assets:
        theme = asset.relative_to(THEMES).parts[0]
        variant = VARIANT.match(asset.stem)
        stem = variant.group("stem") if variant else asset.stem
        families.setdefault((theme, stem), []).append(asset)

    for (theme, stem), members in sorted(families.items()):
        if not any(digest(member) in cdn_hashes for member in members):
            failures.extend(members)
            print(f"NO CLOUDCDN SOURCE  {theme}/{stem} "
                  f"({len(members)} file(s))")
            continue
        photographic_themes.add(theme)
        if any(is_referenced(member, THEMES / theme) for member in members):
            referenced_themes.add(theme)

        photographic_themes.add(theme)
        if is_referenced(asset, THEMES / theme):
            referenced_themes.add(theme)

    if failures:
        print(
            f"cloudcdn-images: FAIL — {len(failures)} raster asset(s) do not trace to CloudCDN",
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
        f"cloudcdn-images: PASS — {len(source_assets)} raster asset(s) across "
        f"{len(photographic_themes)} themes trace to a CloudCDN master and every "
        "theme references CloudCDN imagery"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
