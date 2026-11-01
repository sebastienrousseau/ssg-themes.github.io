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

import base64
import hashlib
import json
import re
import sys
from pathlib import Path

ATTRS = ("href", "src", "srcset", "action", "formaction", "poster", "cite", "ping", "data-src", "data-href")
ATTR_RE = re.compile(r'(\s(?:' + "|".join(ATTRS) + r')=")([^"]*)"')
URL_FN_RE = re.compile(r"url\((['\"]?)(/(?!/)[^)'\"]*)\1\)")
# The opening tag is rewritten like any other (a `<script src="/main.js">`
# is a reference); only the element body between the tags is kept verbatim.
SKIP_BODY_RE = re.compile(r"(<(?:script|style)\b[^>]*>)(.*?)(</(?:script|style)\b[^>]*>)", re.DOTALL | re.IGNORECASE)
THEME_INIT_RE = re.compile(r'<script src="[^"]*theme-init[^"]*"[^>]*></script>')
CSP_SCRIPT_RE = re.compile(r'<script src="([^"]*/_csp/[0-9a-f]+\.js)"')
CLOUDCDN_TAG_RE = re.compile(r"<(?:img|link)\b[^>]*https://cloudcdn\.pro/[^>]*>", re.IGNORECASE)


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

    def add_cloudcdn_cors(match: re.Match[str]) -> str:
        tag = match.group(0)
        if "crossorigin" in tag.lower():
            return tag
        if tag.endswith("/>"):
            return tag[:-2].rstrip() + ' crossorigin="anonymous" />'
        return tag[:-1].rstrip() + ' crossorigin="anonymous">'

    def rewrite(chunk: str) -> str:
        chunk = chunk.replace(
            "https://cloudcdn.pro/clients/sebastienrousseau/favicon.ico",
            f"{prefix}favicon.ico",
        )
        chunk = URL_FN_RE.sub(url_fn, ATTR_RE.sub(attr, chunk))
        return CLOUDCDN_TAG_RE.sub(add_cloudcdn_cors, chunk)

    out = []
    # split() with three groups yields: text, open tag, body, close tag, text, ...
    pieces = SKIP_BODY_RE.split(markup)
    for i, chunk in enumerate(pieces):
        out.append(chunk if i % 4 == 2 else rewrite(chunk))
    return "".join(out)


def load_fonts_css(root: Path, prefix: str) -> str:
    """Loads and minifies fonts/fonts.css with root-rebased WOFF2 URLs."""
    fonts_path = root / "fonts" / "fonts.css"
    if not fonts_path.is_file():
        return ""
    css = fonts_path.read_text(encoding="utf-8")
    css = re.sub(
        r"url\((['\"]?)([a-z0-9-]+\.woff2)\1\)",
        rf"url(\1{prefix}fonts/\2\1)",
        css,
    )
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    return re.sub(r"\s+", " ", css).strip()


def write_bundled_css(csp_dir: Path, css_text: str) -> tuple[str, str]:
    """Writes a content-addressed CSS bundle and returns (filename, sha384_sri)."""
    data = css_text.encode("utf-8")
    name = hashlib.sha256(data).hexdigest()[:16] + ".css"
    sri = "sha384-" + base64.b64encode(hashlib.sha384(data).digest()).decode("ascii")
    target = csp_dir / name
    if not target.exists():
        target.write_bytes(data)
    return name, sri


def bundle_page_styles(
    markup: str, root: Path, prefix: str, fonts_css: str
) -> tuple[str, str | None]:
    """Combines fonts.css and extracted _csp/*.css into one stylesheet before theme-init.js."""
    csp_link_re = re.compile(
        r'<link rel="stylesheet" href="' + re.escape(prefix) + r'_csp/([0-9a-f]+\.css)"[^>]*>'
    )
    matches = list(csp_link_re.finditer(markup))
    if not matches:
        return markup, None
    csp_dir = root / "_csp"
    chunks = [fonts_css] if fonts_css else []
    for match in matches:
        css_file = csp_dir / match.group(1)
        if css_file.is_file():
            chunks.append(css_file.read_text(encoding="utf-8").strip())
    bundle_name, sri = write_bundled_css(csp_dir, "".join(chunks))
    bundle_tag = (
        f'<link rel="stylesheet" href="{prefix}_csp/{bundle_name}" '
        f'integrity="{sri}" crossorigin="anonymous">'
    )
    for match in reversed(matches):
        markup = markup[: match.start()] + markup[match.end() :]
    fonts_tag = f'<link rel="stylesheet" href="{prefix}fonts/fonts.css" />'
    if fonts_tag in markup:
        markup = markup.replace(fonts_tag, bundle_tag, 1)
    elif "</head>" in markup:
        markup = markup.replace("</head>", bundle_tag + "</head>", 1)
    init_match = THEME_INIT_RE.search(markup)
    if init_match and "</head>" in markup:
        init_tag = init_match.group(0)
        markup = markup.replace(init_tag, "", 1).replace("</head>", init_tag + "</head>", 1)
    markup = CSP_SCRIPT_RE.sub(r'<script defer src="\1"', markup)
    return markup, bundle_name


def prune_unused_csp_css(csp_dir: Path, keep: set[str]) -> None:
    """Removes intermediate _csp/*.css files superseded by bundled stylesheets."""
    if not csp_dir.is_dir() or not keep:
        return
    for css_file in csp_dir.glob("*.css"):
        if css_file.name not in keep:
            css_file.unlink()


def rebase_manifests(root: Path, prefix: str) -> None:
    """Replaces cross-origin CloudCDN manifest icons with the local favicon."""
    for manifest_path in sorted(root.rglob("manifest.json")):
        try:
            data = json.loads(manifest_path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        icons = data.get("icons")
        if not isinstance(icons, list):
            continue
        updated = False
        for icon in icons:
            if isinstance(icon, dict) and str(icon.get("src", "")).startswith("https://cloudcdn.pro/"):
                icon["src"] = f"{prefix}favicon.ico"
                icon["sizes"] = "32x32"
                icon["type"] = "image/x-icon"
                icon["purpose"] = "any"
                updated = True
        if updated:
            manifest_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__, file=sys.stderr)
        return 2
    root, prefix = Path(argv[1]), argv[2]
    if not prefix.startswith("/") or not prefix.endswith("/"):
        print(f"error: prefix must look like /name/, got {prefix!r}", file=sys.stderr)
        return 2
    fonts_css = load_fonts_css(root, prefix)
    kept_css: set[str] = set()
    files = sorted(root.rglob("*.html"))
    changed = 0
    for path in files:
        before = path.read_text(encoding="utf-8")
        after, bundle_name = bundle_page_styles(
            rebase_markup(before, prefix), root, prefix, fonts_css
        )
        if bundle_name:
            kept_css.add(bundle_name)
        if after != before:
            path.write_text(after, encoding="utf-8")
            changed += 1
    prune_unused_csp_css(root / "_csp", kept_css)
    rebase_manifests(root, prefix)
    print(f"==> re-based root-absolute references onto {prefix} in {changed}/{len(files)} pages of {root}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
