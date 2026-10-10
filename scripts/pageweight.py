#!/usr/bin/env python3
"""Page-weight and third-party-request gate for the built showcase.

Asserts two things the themes advertise on their own home pages, so the
claims fail the build rather than quietly drifting:

  1. Every page's compressed transfer weight (HTML + the fingerprinted CSS
     and JS it references) stays under `BUDGET_KB`.
  2. No page references an asset from a host other than its own origin.
     Links in prose to other sites are fine; `src`/`href` on stylesheets,
     scripts, images, fonts and preloads are not.

Run by `make check` after a build, and by CI.
"""
from __future__ import annotations

import gzip
import tomllib
import re
import sys
from pathlib import Path

BUDGET_KB = 20


def theme_allowed_origins(root: Path, theme: str) -> frozenset[str]:
    """Hosts a `tier = "site"` theme declares as first party in theme.toml."""
    manifest = root / "themes" / theme / "theme.toml"
    if not manifest.is_file():
        return frozenset()
    try:
        data = tomllib.loads(manifest.read_text(encoding="utf-8"))
    except (OSError, tomllib.TOMLDecodeError):
        return frozenset()
    if data.get("tier") != "site":
        return frozenset()
    return frozenset(str(h).lower() for h in data.get("allowed_origins", []))


def theme_budget_kb(root: Path, theme: str) -> int:
    """The gallery budget, or the budget a `tier = "site"` theme declares.

    A site theme is a live site's own theme; its stylesheet is sized for
    that site, and `budget_kb` in its theme.toml is the figure it is held
    to here. Archetypes cannot declare one: the key is ignored unless
    `tier = "site"`.
    """
    manifest = root / "themes" / theme / "theme.toml"
    if not manifest.is_file():
        return BUDGET_KB
    try:
        data = tomllib.loads(manifest.read_text(encoding="utf-8"))
    except (OSError, tomllib.TOMLDecodeError):
        return BUDGET_KB
    if data.get("tier") != "site":
        return BUDGET_KB
    return int(data.get("budget_kb", BUDGET_KB))

# Elements whose `src` always causes a fetch.
SRC_FETCH = re.compile(
    r'<(?:script|img|source|iframe|embed|video|audio)\b[^>]*?'
    r'\bsrc\s*=\s*["\']([^"\']+)["\']',
    re.I,
)

# `<link>` only fetches for certain `rel` values. `canonical`, `alternate`
# (hreflang and feed discovery) and `manifest` are metadata: they name a
# URL without the browser requesting it as part of rendering the page, so
# an absolute self-referential canonical is not a third-party request.
LINK_TAG = re.compile(r"<link\b[^>]*>", re.I)
LINK_REL = re.compile(r'\brel\s*=\s*["\']([^"\']+)["\']', re.I)
LINK_HREF = re.compile(r'\bhref\s*=\s*["\']([^"\']+)["\']', re.I)
FETCHING_REL = {
    "stylesheet",
    "preload",
    "prefetch",
    "preconnect",
    "dns-prefetch",
    "modulepreload",
    "icon",
    "apple-touch-icon",
}

# Fingerprinted assets only: `_csp/<hex>.css|js`. A looser pattern also
# matched prose mentioning `_csp/` inside the CSP explainer comment, which
# then blew up as a filesystem path.
LOCAL_REF = re.compile(r'["\']([^"\']*_csp/[0-9a-f]+\.(?:css|js))["\']')


def third_party_subresources(text: str) -> list[str]:
    """Returns absolute-URL subresources the browser would fetch."""
    found = [u for u in SRC_FETCH.findall(text)]
    for tag in LINK_TAG.findall(text):
        rel = LINK_REL.search(tag)
        href = LINK_HREF.search(tag)
        if not rel or not href:
            continue
        rels = {r.strip().lower() for r in rel.group(1).split()}
        if rels & FETCHING_REL:
            found.append(href.group(1))
    return [u for u in found if u.startswith(("http://", "https://", "//"))]


def gz_len(data: bytes) -> int:
    return len(gzip.compress(data, 9))


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    public = root / "public"
    if not public.is_dir():
        print("pageweight: public/ not found — run `make build` first")
        return 1

    failures: list[str] = []
    rows: list[tuple[str, int]] = []

    for html_path in sorted(public.rglob("*.html")):
        rel = html_path.relative_to(public)
        html = html_path.read_bytes()
        total = gz_len(html)

        # Add the fingerprinted assets this page actually references.
        text = html.decode("utf-8", "replace")
        theme_root = public / rel.parts[0] if len(rel.parts) > 1 else public
        for ref in set(LOCAL_REF.findall(text)):
            candidate = theme_root / "_csp" / Path(ref).name
            if candidate.is_file():
                total += gz_len(candidate.read_bytes())

        rows.append((str(rel), total))
        budget_kb = theme_budget_kb(root, rel.parts[0]) if len(rel.parts) > 1 else BUDGET_KB
        if total > budget_kb * 1024:
            failures.append(
                f"{rel}: {total / 1024:.1f} KB gzipped, budget {budget_kb} KB"
            )

        # Third-party subresources. A site theme's declared first-party hosts
        # (theme.toml `allowed_origins`, read only when `tier = "site"`) are
        # its own; everything else is third party for it too.
        allowed = theme_allowed_origins(root, rel.parts[0]) if len(rel.parts) > 1 else frozenset()
        for url in third_party_subresources(text):
            host = url.split("//", 1)[-1].split("/", 1)[0].lower()
            if any(host == h or host.endswith("." + h) for h in allowed):
                continue
            failures.append(f"{rel}: third-party subresource {url}")

    if failures:
        print(f"pageweight: {len(failures)} failure(s)\n")
        for f in failures:
            print(f"  FAIL  {f}")
        return 1

    worst = max(rows, key=lambda r: r[1])
    print(
        f"pageweight: {len(rows)} page(s) pass — largest {worst[0]} at "
        f"{worst[1] / 1024:.1f} KB gzipped (budget {BUDGET_KB} KB), "
        f"0 third-party subresources"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
