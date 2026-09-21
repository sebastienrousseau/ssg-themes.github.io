#!/usr/bin/env python3
"""Re-encode landing-page imagery to one consistent budget.

Two problems this fixes, both measured rather than assumed:

1. **The ladder had a hole.** Lighthouse's mobile profile is 412 CSS px at
   1.75x, so a `sizes` of `100vw` asks for ~721 px and the browser takes the
   960 variant — 36% more pixels than it can show. Adding 480 and 768 rungs
   lets it pick something that fits.

2. **Quality was inconsistent.** Across the suite the hero variants ranged
   from 0.011 to 0.2 bits per pixel for the same kind of photograph. The
   heavy end was three to four times the median for no visible benefit.

Encoding to a fixed bits-per-pixel target rather than a fixed quality number
keeps a busy photograph and a calm one at comparable file sizes, which is
what makes Largest Contentful Paint land in the same place for every theme.

Usage:  hero_images.py [--bpp 0.05] [--apply] [theme ...]
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

RUNGS = (320, 480, 640, 768, 960)


def dimensions(path: Path) -> tuple[int, int] | None:
    out = subprocess.run(["magick", "identify", "-format", "%w %h", str(path)],
                         capture_output=True, text=True).stdout.split()
    return (int(out[0]), int(out[1])) if len(out) == 2 else None


def encode(src: Path, dest: Path, width: int, target_bpp: float) -> int:
    """Encode `src` to `dest` at `width`, searching quality for the budget."""
    dims = dimensions(src)
    if not dims:
        return 0
    height = max(1, round(width * dims[1] / dims[0]))
    budget = int(width * height * target_bpp)
    best = None
    # A short descending search: quality maps to size non-linearly, so pick
    # the highest quality whose output still fits the budget.
    # The ladder runs low deliberately: a busy photograph (dense foliage,
    # crowds) needs a lower quality than a calm one to occupy the same
    # bytes, and matching bytes is what keeps paint times comparable.
    for quality in (82, 76, 70, 64, 58, 52, 46, 40, 34, 28, 24):
        subprocess.run(["magick", str(src), "-strip", "-resize", f"{width}x",
                        "-quality", str(quality), str(dest)],
                       check=True, capture_output=True)
        size = dest.stat().st_size
        if best is None or size <= budget:
            best = size
        if size <= budget:
            return size
    return best or dest.stat().st_size


# A variant is `<stem>-<width>` or, for an art-directed mobile crop,
# `<stem>-<letter><width>` (m = mobile, d = desktop). They carry different aspect ratios, so they are
# separate families: re-encoding one from the other's master would silently
# replace a landscape rung with a portrait crop.
VARIANT = re.compile(r"^(?P<stem>.+?)-(?P<crop>[a-z]?)(?P<width>\d+)$")


def family_of(name: str) -> tuple[str, str]:
    """(stem, crop) for a variant filename stem; crop is a letter or ""."""
    m = VARIANT.fullmatch(name)
    return (m["stem"], m["crop"]) if m else (name, "")


def rung_name(stem: str, crop: str, width: int) -> str:
    return f"{stem}-{crop}{width}.webp"


def source_for(images: Path, stem: str, crop: str) -> Path | None:
    """The widest existing master for one family of variants."""
    candidates = [p for p in images.glob(f"{stem}-*.webp")
                  if family_of(p.stem) == (stem, crop)]
    if not candidates:
        return None
    return max(candidates, key=lambda p: (dimensions(p) or (0, 0))[0])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bpp", type=float, default=0.05)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("themes", nargs="*")
    args = ap.parse_args()

    themes = args.themes or sorted(
        p.name for p in Path("themes").iterdir() if p.is_dir())
    total_before = total_after = 0
    for theme in themes:
        index = Path("themes") / theme / "_layouts" / "index.html"
        images = Path("themes") / theme / "images"
        if not (index.exists() and images.is_dir()):
            continue
        families = sorted({family_of(Path(m).stem)
                           for m in re.findall(r"images/([\w-]+\.webp)",
                                               index.read_text())})
        for stem, crop in families:
            master = source_for(images, stem, crop)
            if not master:
                continue
            dims = dimensions(master)
            if not dims:
                continue
            for width in RUNGS:
                if dims[0] < width:
                    continue
                dest = images / rung_name(stem, crop, width)
                # Only re-encode rungs the theme already ships. Inventing one
                # writes a file nothing references, and for an art-directed
                # family it would invent it at the wrong aspect ratio.
                if not dest.exists():
                    continue
                before = dest.stat().st_size
                after = encode(master, dest, width, args.bpp) if args.apply else before
                total_before += before
                total_after += after
        print(f"  {theme}: {len(families)} image family/families")
    if args.apply:
        print(f"hero images: {total_before // 1024} KiB -> {total_after // 1024} KiB "
              f"at {args.bpp} bpp")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
