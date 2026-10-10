#!/usr/bin/env python3
"""Re-base a site-tier theme's root-absolute references onto its gallery path.

A theme with `tier = "site"` in its theme.toml is the production layout set
of a site that owns its host: its header, footer and sample pages link to
`/about/`, `/fr/` or `/main.js` without a template prefix, because on that
host there is nothing to prefix. The showcase serves every theme under
`<SHOWCASE_BASE_URL>/<theme>/`, where those links resolve against the
gallery root and 404. The other themes carry a `{{base_path}}` variable in
their templates for this; a site-tier theme cannot, since its templates
must stay byte-identical to the site's own.

This pass is the showcase-side equivalent of `{{base_path}}`: in every HTML
file of the built theme, root-absolute values of link-carrying attributes
gain the theme's path prefix. It changes nothing else:

* references the generator already prefixed (fingerprinted `_csp/` assets,
  listing links, feeds) are left alone, so the pass is idempotent;
* protocol-relative (`//host/...`) and absolute URLs are not touched;
* `<script>` and `<style>` bodies are skipped (their opening tags are
  not: a `src` on a script tag is a reference), so the CSP hashes the
  generator recorded for inline code stay valid, and no stylesheet,
  script or feed file is rewritten, so every `integrity` attribute still
  matches its file.

Usage: rebase_links.py <built theme dir> </theme-path/>
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ATTRS = ("href", "src", "srcset", "action", "formaction", "poster", "cite", "ping", "data-src", "data-href")
ATTR_RE = re.compile(r'(\s(?:' + "|".join(ATTRS) + r')=")([^"]*)"')
URL_FN_RE = re.compile(r"url\((['\"]?)(/(?!/)[^)'\"]*)\1\)")
# The opening tag is rewritten like any other (a `<script src="/main.js">`
# is a reference); only the element body between the tags is kept verbatim.
SKIP_BODY_RE = re.compile(r"(<(?:script|style)\b[^>]*>)(.*?)(</(?:script|style)>)", re.S | re.I)


def rebase_value(value: str, prefix: str) -> str:
    """Prefixes one root-absolute URL; returns other values unchanged."""
    if not value.startswith("/") or value.startswith("//"):
        return value
    if value == prefix.rstrip("/") or value.startswith(prefix):
        return value
    return prefix.rstrip("/") + value


def rebase_srcset(value: str, prefix: str) -> str:
    """Prefixes each candidate URL of a srcset list, keeping its descriptor."""
    parts = []
    for candidate in value.split(","):
        candidate = candidate.strip()
        if not candidate:
            continue
        url, _, descriptor = candidate.partition(" ")
        url = rebase_value(url, prefix)
        parts.append(f"{url} {descriptor.strip()}".rstrip())
    return ", ".join(parts)


def rebase_markup(markup: str, prefix: str) -> str:
    """Rewrites attribute values outside script and style bodies."""

    def attr(match: re.Match[str]) -> str:
        head, value = match.group(1), match.group(2)
        if head.lstrip().startswith("srcset="):
            return f'{head}{rebase_srcset(value, prefix)}"'
        return f'{head}{rebase_value(value, prefix)}"'

    def url_fn(match: re.Match[str]) -> str:
        quote, value = match.group(1), match.group(2)
        return f"url({quote}{rebase_value(value, prefix)}{quote})"

    def rewrite(chunk: str) -> str:
        return URL_FN_RE.sub(url_fn, ATTR_RE.sub(attr, chunk))

    out = []
    # split() with three groups yields: text, open tag, body, close tag, text, ...
    pieces = SKIP_BODY_RE.split(markup)
    for i, chunk in enumerate(pieces):
        out.append(chunk if i % 4 == 2 else rewrite(chunk))
    return "".join(out)


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__, file=sys.stderr)
        return 2
    root, prefix = Path(argv[1]), argv[2]
    if not prefix.startswith("/") or not prefix.endswith("/"):
        print(f"error: prefix must look like /name/, got {prefix!r}", file=sys.stderr)
        return 2
    files = sorted(root.rglob("*.html"))
    changed = 0
    for path in files:
        before = path.read_text(encoding="utf-8")
        after = rebase_markup(before, prefix)
        if after != before:
            path.write_text(after, encoding="utf-8")
            changed += 1
    print(f"==> re-based root-absolute references onto {prefix} in {changed}/{len(files)} pages of {root}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
