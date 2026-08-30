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
  * every `translation_key` resolves in every locale a theme declares

The last check exists because a missing translation does not break a
build: the generator's i18n plugin simply emits no `hreflang` alternates
for a page it cannot pair, and the page ships looking fine while its
alternates have silently vanished. That is the exact failure mode that
made the first multi-locale attempt invisible, so it is a hard failure
here.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tomllib
from pathlib import Path

CATEGORIES = ("Blog", "Documentation", "Marketing", "Portfolio", "Publication")

THEMES = ("apex", "atlas", "kinetic", "lucid", "quill", "stablo", "velocity", "voxt")

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


def front_matter(path: Path) -> dict[str, str] | None:
    """Reads the scalar `key: value` pairs of a YAML front-matter block.

    Deliberately not a YAML parser: the themes only ever use quoted or
    bare scalars, and pulling in PyYAML for five keys would add a
    dependency to a gate that must run anywhere `python3` does. Returns
    None when the file carries no `---` fenced block.
    """
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    out: dict[str, str] = {}
    for line in lines[1:]:
        if line.strip() == "---":
            return out
        if not line or line.lstrip().startswith("#"):
            continue
        key, sep, value = line.partition(":")
        if not sep or key != key.strip() or " " in key.strip():
            continue
        out[key.strip()] = value.strip().strip('"').strip("'")
    return None  # unterminated front matter


def locales_of(theme: Path) -> tuple[str, list[str]] | None:
    """Returns `(default_locale, locales)` from the theme's `[i18n]`
    section, or None for a single-locale theme."""
    config = theme / "ssg.toml"
    if not config.is_file():
        return None
    try:
        data = tomllib.loads(config.read_text(encoding="utf-8"))
    except (OSError, tomllib.TOMLDecodeError):
        return None
    i18n = data.get("i18n")
    if not isinstance(i18n, dict):
        return None
    locales = i18n.get("locales")
    if not isinstance(locales, list) or len(locales) < 2:
        return None
    return str(i18n.get("default_locale", locales[0])), [str(l) for l in locales]


def check_translations(theme: Path, name: str) -> list[str]:
    """Fails when a `translation_key` does not resolve in every locale.

    A page's locale is its first content-relative directory when that
    directory names a declared locale, and the default locale otherwise
    — the root-hosted-default-locale layout the generator expects.
    """
    errors: list[str] = []
    config = locales_of(theme)
    if config is None:
        return errors
    default_locale, locales = config

    content = theme / "content"
    # key -> locale -> [relative paths]
    matrix: dict[str, dict[str, list[str]]] = {}

    for md in sorted(content.rglob("*.md")):
        rel = md.relative_to(content)
        head = rel.parts[0] if len(rel.parts) > 1 else ""
        locale = head if head in locales else default_locale

        fm = front_matter(md)
        if fm is None:
            errors.append(f"{name}: content/{rel} has no YAML front matter")
            continue
        key = fm.get("translation_key", "").strip()
        if not key:
            errors.append(
                f"{name}: content/{rel} declares no translation_key; "
                f"with {len(locales)} locales configured every page needs "
                "one or its hreflang alternates are dropped silently"
            )
            continue
        matrix.setdefault(key, {}).setdefault(locale, []).append(str(rel))

    for key in sorted(matrix):
        by_locale = matrix[key]
        missing = [loc for loc in locales if loc not in by_locale]
        if missing:
            have = ", ".join(
                f"{loc}={by_locale[loc][0]}" for loc in sorted(by_locale)
            )
            errors.append(
                f"{name}: translation_key {key!r} resolves in "
                f"{len(by_locale)}/{len(locales)} locales — missing "
                f"{', '.join(missing)} (have {have})"
            )
        for loc, paths in sorted(by_locale.items()):
            if len(paths) > 1:
                errors.append(
                    f"{name}: translation_key {key!r} is claimed by "
                    f"{len(paths)} pages in locale {loc}: "
                    f"{', '.join(sorted(paths))}"
                )

    return errors


# OS and editor droppings that must not enter history. Checked against the
# git index rather than the filesystem: `.DS_Store` is gitignored and macOS
# recreates it whenever Finder touches a directory, so testing for mere
# presence failed this gate on every macOS working copy while the repository
# itself was perfectly clean.
JUNK_NAMES = (".DS_Store", "Thumbs.db", ".AppleDouble")


def tracked_junk(root: Path) -> list[str]:
    """Returns an error for each junk file actually tracked by git."""
    try:
        out = subprocess.run(
            ["git", "ls-files", "-z"],
            cwd=root,
            capture_output=True,
            check=True,
            text=True,
        ).stdout
    except (OSError, subprocess.CalledProcessError):
        # Not a git checkout (a release tarball, say) — nothing to assert.
        return []

    return [
        f"repo: {path} is tracked by git and should not be"
        for path in out.split("\0")
        if path and Path(path).name in JUNK_NAMES
    ]


# Paths that were live before the themes were renamed. Each must keep
# resolving — silently turning a working URL into a 404 is the failure this
# guards against, and it is invisible without a check because the build
# succeeds either way.
LEGACY_PATHS = {
    "portfolio": "apex",
    "sebastienrousseau": "atlas",
    "kaishi": "velocity",
}


def check_legacy_redirects(root: Path) -> list[str]:
    """Fails when a renamed theme's old path stops resolving.

    Only meaningful after a build; skipped when `public/` is absent so the
    source-only gates stay runnable on a clean checkout.
    """
    public = root / "public"
    if not public.is_dir():
        return []

    errors: list[str] = []
    for legacy, target in sorted(LEGACY_PATHS.items()):
        page = public / legacy / "index.html"
        if not page.is_file():
            errors.append(
                f"repo: legacy path /{legacy}/ no longer resolves — it is "
                f"live today and must redirect to /{target}/"
            )
            continue
        html = page.read_text(encoding="utf-8", errors="replace")
        if f"/{target}/" not in html:
            errors.append(
                f"repo: /{legacy}/ exists but does not point at /{target}/"
            )
        if "canonical" not in html:
            errors.append(f"repo: /{legacy}/ redirect has no canonical link")
    return errors


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
            cat = data.get("category")
            if not cat:
                errors.append(f"{name}: theme.json missing category")
            elif cat not in CATEGORIES:
                errors.append(
                    f"{name}: theme.json category {cat!r} is not one of "
                    f"{', '.join(CATEGORIES)}"
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

    errors.extend(check_translations(theme, name))

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


def check_registration(root: Path) -> list[str]:
    """Every theme on disk must be advertised where a reader looks for it.

    Adding a theme means touching several files, and the two that describe it
    to people — the showcase index and the README — are the two nothing
    validated. Lucid was built, gated, packaged, deployed and served at
    /lucid/ while the showcase homepage listed five themes and did not
    mention it, so the only way in was a URL you already knew.

    THEMES is checked against the directory listing as well, so a theme
    cannot be added to disk and left out of every gate that iterates it.
    """
    errors: list[str] = []

    on_disk = sorted(
        d.name for d in (root / "themes").iterdir()
        if d.is_dir() and not d.name.startswith(".")
    )
    if on_disk != sorted(THEMES):
        missing = set(on_disk) - set(THEMES)
        extra = set(THEMES) - set(on_disk)
        if missing:
            errors.append(f"themes/ has {', '.join(sorted(missing))} but THEMES does not list them")
        if extra:
            errors.append(f"THEMES lists {', '.join(sorted(extra))} but themes/ has no such directory")

    index = root / "public_index.html"
    if index.is_file():
        html = index.read_text(encoding="utf-8")
        for name in on_disk:
            # The card links to the demo; that is what makes it reachable.
            if f'href="{name}/"' not in html:
                errors.append(f"public_index.html has no card linking to {name}/")
    else:
        errors.append("public_index.html is missing")

    # The count and the roll-call in the showcase copy are claims about how
    # many themes exist, and nothing checked them. They had been wrong for
    # three additions: the page said "five themes" with eight on disk, and
    # its JSON-LD still said "Four themes ... Apex, Atlas, Kinetic and
    # Velocity". Both read as deliberate, which is what makes prose claims
    # about state worth gating.
    if index.is_file():
        html = index.read_text(encoding="utf-8")
        words = {
            1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six",
            7: "seven", 8: "eight", 9: "nine", 10: "ten", 11: "eleven",
            12: "twelve",
        }
        expected = words.get(len(on_disk))
        if expected:
            lowered = html.lower()
            for n, word in words.items():
                if n == len(on_disk):
                    continue
                # Only count it as a claim when it sits next to "theme".
                for phrase in (f"{word} themes", f"{word} gated themes"):
                    if phrase in lowered:
                        errors.append(
                            f'public_index.html says "{phrase}" but themes/ '
                            f"holds {len(on_disk)}"
                        )
            if f"{expected} themes" not in lowered:
                errors.append(
                    f'public_index.html never says "{expected} themes"; '
                    f"themes/ holds {len(on_disk)}"
                )
        # Every theme must be named, not merely linked: the enumerations in
        # the title, description and lead are where a new theme goes missing.
        for name in on_disk:
            if name.capitalize() not in html:
                errors.append(f"public_index.html never names {name.capitalize()}")
            # The eyebrow is what tells a reader what a theme is for before
            # they read the description, so it has to agree with the manifest
            # rather than being typed independently.
            tj = root / "themes" / name / "theme.json"
            if tj.is_file():
                try:
                    cat = json.loads(tj.read_text()).get("category")
                except (OSError, ValueError):
                    cat = None
                if cat:
                    card = f'<p class="theme-cat">{cat}</p>\n                <h3>{name.capitalize()}</h3>'
                    if card not in html:
                        errors.append(
                            f"public_index.html: {name.capitalize()} card does "
                            f"not show its category {cat!r}"
                        )

    # The headline figures must stay generated. Typing one back in is easy,
    # reads as deliberate, and is exactly how 136 and 6.9 KB survived next to
    # a sentence promising the numbers came from gates.
    if index.is_file():
        html = index.read_text(encoding="utf-8")
        facts = re.search(r'<ul class="facts">(.*?)</ul>', html, re.S)
        if not facts:
            errors.append("public_index.html has no facts list")
        else:
            # In the source every entry carries data-fact and an em-dash
            # placeholder; scripts/facts.py substitutes the real value into
            # the built page. A value typed here would ship as-is.
            for attrs, value in re.findall(r"<b([^>]*)>([^<]*)</b>", facts.group(1)):
                if "data-fact=" not in attrs:
                    errors.append(
                        "public_index.html: a facts entry does not use "
                        f'data-fact (found "{value.strip()}")'
                    )
                elif value.strip() not in ("", "\u2014", "-"):
                    errors.append(
                        f'public_index.html: facts list has a typed value '
                        f'"{value.strip()}"; leave the placeholder so '
                        "scripts/facts.py fills it"
                    )

    readme = root / "README.md"
    if readme.is_file():
        text = readme.read_text(encoding="utf-8")
        for name in on_disk:
            if f"themes/{name}/" not in text:
                errors.append(f"README.md does not list the {name} theme")
    else:
        errors.append("README.md is missing")

    return errors


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    all_errors: list[str] = []

    for name in THEMES:
        all_errors.extend(check_theme(root, name))

    all_errors.extend(check_registration(root))
    all_errors.extend(tracked_junk(root))
    all_errors.extend(check_legacy_redirects(root))

    if all_errors:
        print(f"validate: {len(all_errors)} failure(s)\n")
        for e in all_errors:
            print(f"  FAIL  {e}")
        return 1

    print(f"validate: {len(THEMES)} themes pass structural checks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
