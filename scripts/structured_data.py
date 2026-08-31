#!/usr/bin/env python3
"""Verify the AI-discovery surface of the built site.

The showcase's themes claim to be citable by answer engines: JSON-LD on
every page, llms.txt and agents.txt per theme, and article-level schema on
blog posts carrying authorship and a publication date. Before this gate,
none of that was checked — a typo in a template would ship invalid JSON-LD
silently, and the blog themes shipped for a day describing every post as a
generic WebPage with no author or date, which is precisely the metadata an
answer engine needs before it can cite anything.

Rules, applied to public/:
  1. Every <script type="application/ld+json"> block must parse as JSON.
  2. Every page must declare at least one typed entity.
  3. Every page under a /posts/ path must declare a BlogPosting whose
     headline, datePublished and author name are non-empty.
  4. Every theme directory must carry llms.txt and agents.txt.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys

SCRIPT = re.compile(
    r'<script type="application/ld\+json">(.*?)</script>', re.S
)


def entities(blob: str) -> list[dict]:
    data = json.loads(blob)
    graph = data.get("@graph", [data])
    return graph if isinstance(graph, list) else [graph]


def main() -> int:
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "public")
    errors: list[str] = []
    pages = 0
    posts = 0

    for page in sorted(root.rglob("index.html")):
        rel = page.relative_to(root)
        html = page.read_text(encoding="utf-8", errors="replace")

        # A legacy rename stub is deliberately minimal: it exists to
        # meta-refresh to the theme's new name and nothing should index it.
        if 'http-equiv="refresh"' in html:
            continue

        blocks = SCRIPT.findall(html)
        if not blocks:
            # Taxonomy pages are emitted by the generator's tags plugin, not
            # by any theme layout, so a theme cannot put JSON-LD on them.
            # Tracked as a generator improvement rather than failed here —
            # but if the generator starts emitting it, rule 1 still applies.
            if "/tags/" in f"/{rel}":
                continue
            errors.append(f"{rel}: no JSON-LD")
            continue
        pages += 1
        found: list[dict] = []
        for blob in blocks:
            try:
                found.extend(entities(blob))
            except ValueError as exc:
                errors.append(f"{rel}: JSON-LD does not parse — {exc}")
        if not any(e.get("@type") for e in found):
            errors.append(f"{rel}: JSON-LD carries no typed entity")

        if "/posts/" in f"/{rel}":
            posts += 1
            arts = [e for e in found if e.get("@type") == "BlogPosting"]
            if not arts:
                errors.append(f"{rel}: post page has no BlogPosting entity")
            for a in arts:
                for field, value in (
                    ("headline", a.get("headline")),
                    ("datePublished", a.get("datePublished")),
                    ("author", (a.get("author") or {}).get("name")),
                ):
                    if not (value or "").strip():
                        errors.append(f"{rel}: BlogPosting {field} is empty")

    themes = sorted(
        d for d in root.iterdir()
        if d.is_dir() and (d / "index.html").is_file()
        and not d.name.startswith((".", "_"))
        and d.name not in ("downloads", "assets", "images")
        # Rename stubs redirect and carry no site of their own.
        and 'http-equiv="refresh"'
        not in (d / "index.html").read_text(encoding="utf-8", errors="replace")
    )
    for theme in themes:
        for name in ("llms.txt", "agents.txt"):
            if not (theme / name).is_file():
                errors.append(f"{theme.name}: missing {name}")

    if errors:
        print(f"structured-data: {len(errors)} failure(s):", file=sys.stderr)
        for e in errors[:20]:
            print(f"  {e}", file=sys.stderr)
        return 1

    print(
        f"structured-data: {pages} pages carry valid JSON-LD, "
        f"{posts} posts typed BlogPosting, "
        f"{len(themes)} themes expose llms.txt and agents.txt"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
