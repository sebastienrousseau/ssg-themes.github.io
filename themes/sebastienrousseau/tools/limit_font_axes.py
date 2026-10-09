#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2007-2026 Sebastien Rousseau
# SPDX-License-Identifier: MIT
"""Trim each self-hosted variable font's weight axis to its @font-face range.

A browser never asks a font for a weight outside the `font-weight` range its
`@font-face` rule declares: a request for 300 or 800 is matched to the face
and clamped into that range before the variation is applied. The weight
masters outside the declared range are therefore bytes no page can render.
This tool reads `fonts.css`, and for every face with a `font-weight: <a> <b>`
range and a local `url(...)` it instantiates the font's `wght` axis to
[a, b] in place. Other axes (Newsreader's `opsz`) are left whole.

What stays the same and what does not: advance widths and metrics are
untouched, so every line breaks where it did and every page keeps its
height. Glyph outlines move by rounding only (the rescaled variation deltas
are stored as integers), which shows as anti-aliasing changes on glyph
edges. Measured on ten demo pages at 1280 px: identical page heights, no
pixel differing by more than 92 of 255 in a channel, none visible at 3x.

Idempotent: a font whose axis already matches its declared range is skipped.

Usage: uv run --with 'fonttools[woff]==4.66.1' tools/limit_font_axes.py <fonts dir>
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FACE = re.compile(r"@font-face\s*\{(?P<body>[^}]*)\}", re.S)
WEIGHT = re.compile(r"font-weight\s*:\s*(\d+)\s+(\d+)\s*;")
SRC = re.compile(r"url\(\s*['\"]?(?P<url>[^'\")]+\.woff2)['\"]?\s*\)")


def declared_ranges(css: str) -> dict[str, tuple[int, int]]:
    """Map each local woff2 file named in fonts.css to its declared weights."""
    ranges: dict[str, tuple[int, int]] = {}
    for face in FACE.finditer(css):
        body = face.group("body")
        weight, src = WEIGHT.search(body), SRC.search(body)
        if weight and src and "/" not in src.group("url"):
            ranges[src.group("url")] = (int(weight.group(1)), int(weight.group(2)))
    return ranges


def limit(path: Path, low: int, high: int) -> str:
    """Instantiate the wght axis of one font to [low, high]."""
    font = TTFont(path)
    axes = {a.axisTag: a for a in font["fvar"].axes} if "fvar" in font else {}
    wght = axes.get("wght")
    if wght is None:
        return "static, skipped"
    if (wght.minValue, wght.maxValue) == (low, high):
        return "already limited"
    if not (wght.minValue <= low <= high <= wght.maxValue):
        raise SystemExit(
            f"{path.name}: declared {low}-{high} is outside the font's "
            f"{wght.minValue:g}-{wght.maxValue:g}"
        )
    before = path.stat().st_size
    trimmed = instancer.instantiateVariableFont(font, {"wght": (low, high)})
    trimmed.flavor = "woff2"
    trimmed.save(path)
    return (
        f"wght {wght.minValue:g}-{wght.maxValue:g} -> {low}-{high}, "
        f"{before} -> {path.stat().st_size} bytes"
    )


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__.strip().splitlines()[-1], file=sys.stderr)
        return 2
    fonts = Path(argv[1])
    ranges = declared_ranges((fonts / "fonts.css").read_text(encoding="utf-8"))
    if not ranges:
        raise SystemExit("no @font-face with a weight range and a local woff2 found")
    for name, (low, high) in sorted(ranges.items()):
        print(f"{name}: {limit(fonts / name, low, high)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
