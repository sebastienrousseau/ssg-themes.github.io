#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0 OR MIT
"""Check that every `integrity` hash in the built site matches its file.

The generator writes SRI hashes, and several passes in scripts/ rewrite
built HTML and assets afterwards. A pass that edits a pinned file without
updating every page that pins it makes the browser refuse the stylesheet
or script, silently, on exactly those pages. This recomputes each local
hash from the bytes on disk, so that can never reach a deploy.

Usage: verify_sri.py [public]
"""

from __future__ import annotations

import base64
import hashlib
import re
import sys
from pathlib import Path

TAG_RE = re.compile(r"<(?:script|link)\b[^>]*>", re.IGNORECASE)
INTEGRITY_RE = re.compile(r'\bintegrity="([^"]+)"', re.IGNORECASE)
URL_RE = re.compile(r'\b(?:src|href)="([^"]+)"', re.IGNORECASE)


def digest(algo: str, data: bytes) -> str:
    return base64.b64encode(hashlib.new(algo, data).digest()).decode("ascii")


def resolve(root: Path, page: Path, url: str) -> Path | None:
    """Local file a URL names, or None for an external URL."""
    url = url.split("#", 1)[0].split("?", 1)[0]
    if url.startswith(("http:", "https:", "//", "data:")):
        return None
    if url.startswith("/"):
        return root / url.lstrip("/")
    return page.parent / url


def check_tag(root: Path, page: Path, tag: str) -> str | None:
    """An error message for one tag, or None when it is fine or not pinned."""
    integrity, url = INTEGRITY_RE.search(tag), URL_RE.search(tag)
    if not integrity or not url:
        return None
    target = resolve(root, page, url.group(1))
    if target is None:
        return None
    if not target.is_file():
        return f"{url.group(1)}: pinned file is missing"
    data = target.read_bytes()
    # Any one listed hash matching is enough, as in the browser.
    for item in integrity.group(1).split():
        algo, _, want = item.partition("-")
        if algo in {"sha256", "sha384", "sha512"} and digest(algo, data) == want:
            return None
    return f"{url.group(1)}: integrity does not match the file"


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else "public")
    if not root.is_dir():
        print(f"verify_sri: {root}/ is missing; run `make build` first", file=sys.stderr)
        return 1
    checked = 0
    errors = []
    for page in sorted(root.rglob("*.html")):
        for tag in TAG_RE.findall(page.read_text(encoding="utf-8", errors="replace")):
            if INTEGRITY_RE.search(tag):
                checked += 1
            problem = check_tag(root, page, tag)
            if problem:
                errors.append(f"{page.relative_to(root)}: {problem}")
    for line in errors:
        print(line)
    print(f"sri: {checked} pinned reference(s) checked, {len(errors)} mismatch(es)")
    # Zero references means the check looked at nothing, not that it passed.
    return 1 if errors or checked == 0 else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
