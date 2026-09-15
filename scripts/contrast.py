#!/usr/bin/env python3
"""WCAG contrast gate for SSG theme design tokens.

Parses the `:root` custom-property blocks out of each theme stylesheet and
asserts every declared token pair clears its target ratio. Run by `make check`
and by CI, so the accessibility claim in the README is enforced rather than
asserted.

Targets:
  * text             >= 7.0:1  (WCAG 1.4.6 Contrast Enhanced, AAA)
  * large text       >= 4.5:1  (WCAG 1.4.6, AAA for >=24px or >=18.66px bold)
  * non-text / UI    >= 3.0:1  (WCAG 1.4.11 Non-text Contrast, AA)
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

AAA_TEXT = 7.0
AAA_LARGE = 4.5
UI_NONTEXT = 3.0


def _linear(channel: int) -> float:
    c = channel / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex_colour: str) -> float:
    h = hex_colour.lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _linear(r) + 0.7152 * _linear(g) + 0.0722 * _linear(b)


def ratio(fg: str, bg: str) -> float:
    l1, l2 = luminance(fg), luminance(bg)
    if l1 < l2:
        l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)


# Display P3 -> XYZ (D65). Only the middle row is needed: WCAG relative
# luminance is Y, and Y is defined in XYZ, not in any particular RGB
# space. Computing it this way lets a P3 colour be held to exactly the
# same thresholds as an sRGB one rather than being exempt.
P3_TO_XYZ_Y = (0.2289745, 0.6917387, 0.0792868)


def p3_luminance(components: tuple[float, float, float]) -> float:
    """Relative luminance of a `color(display-p3 r g b)` triple."""
    lin = [_linear(round(c * 255)) for c in components]
    return sum(P3_TO_XYZ_Y[i] * lin[i] for i in range(3))


def parse_p3_tokens(css: str, selector: str) -> dict[str, tuple[float, ...]]:
    """Extracts `--name: color(display-p3 r g b);` from a `selector` block.

    P3 tokens were added so wide-gamut displays get the chroma sRGB was
    clipping. They must be checked, not just declared: a colour the gate
    cannot parse is a colour outside the gate, and that is precisely how
    voxt's seven contrast failures went unnoticed for as long as they
    did.
    """
    idx = css.find(selector)
    if idx == -1:
        return {}
    block = css[idx: css.find("}", idx)]
    return {
        name: tuple(float(v) for v in values.split())
        for name, values in re.findall(
            r"(--[a-z0-9-]+)\s*:\s*color\(display-p3\s+([0-9.\s]+)\)\s*;",
            block,
        )
    }


def ratio_mixed(fg_luminance: float, bg_hex: str) -> float:
    """Contrast of an already-computed luminance against a hex colour."""
    l2 = luminance(bg_hex)
    lighter, darker = max(fg_luminance, l2), min(fg_luminance, l2)
    return (lighter + 0.05) / (darker + 0.05)


def parse_tokens(css: str, selector: str) -> dict[str, str]:
    """Extracts `--name: #hex;` pairs from the first block matching `selector`."""
    idx = css.find(selector)
    if idx == -1:
        return {}
    block = css[idx: css.find("}", idx)]
    return {
        name: value
        for name, value in re.findall(
            r"(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;", block
        )
    }


def parse_gradient(css: str, selector: str, token: str) -> list[str]:
    """Hex stops of `--token: linear-gradient(...)` in the first `selector` block.

    Read from the same block as the text tokens so a gradient is always paired
    with the ink that is actually laid over it in that colour scheme. Pairing a
    single ink against every declaration of the token would compare light text
    with the light-mode stops and report a failure that no one can see.
    """
    idx = css.find(selector)
    if idx == -1:
        return []
    block = css[idx: css.find("}", idx)]
    m = re.search(rf"{re.escape(token)}\s*:\s*linear-gradient\(([^;]*)\)\s*;", block)
    return re.findall(r"#[0-9a-fA-F]{6}", m.group(1)) if m else []


# (foreground token, background token, target ratio, human label)
PAIRS = [
    ("--ink", "--bg", AAA_TEXT, "body text on page ground"),
    ("--ink", "--surface", AAA_TEXT, "body text on surface"),
    ("--ink-soft", "--bg", AAA_TEXT, "secondary text on ground"),
    ("--ink-soft", "--surface", AAA_TEXT, "secondary text on surface"),
    ("--ink-muted", "--bg", AAA_TEXT, "muted text on ground"),
    ("--ink-muted", "--surface", AAA_TEXT, "muted text on surface"),
    ("--ink-muted", "--surface-soft", AAA_TEXT, "muted text on soft surface"),
    ("--accent", "--bg", AAA_TEXT, "link on ground"),
    ("--accent", "--surface", AAA_TEXT, "link on surface"),
    ("--accent", "--surface-soft", AAA_TEXT, "link on soft surface"),
    ("--accent-ink", "--accent", AAA_TEXT, "button label on accent"),
    ("--accent-hover", "--surface", AAA_TEXT, "hovered link on surface"),
    ("--on-accent-soft", "--accent-soft", AAA_TEXT, "badge text on accent tint"),
    ("--focus", "--bg", UI_NONTEXT, "focus ring against ground"),
    ("--focus", "--surface", UI_NONTEXT, "focus ring against surface"),
    ("--line", "--surface", UI_NONTEXT, "control border against surface"),
    ("--line", "--bg", UI_NONTEXT, "control border against ground"),
]

THEMES = (
    "apex", "atlas", "cadence", "covenant", "hearth", "intent", "kairo",
    "kaishi", "kinetic", "lucid", "noir", "prism", "quill", "scout",
    "signal", "stablo", "steward", "velocity", "visage",
)

# Voxt is dark-first and uses its own token vocabulary — `--fg` / `--bg-card`
# / `--primary` / `--border` where the other eight use `--ink` / `--surface`
# / `--accent` / `--line`. Because none of the names in PAIRS resolved, it was
# simply left out of THEMES, and so its colours were never checked at all.
#
# That silence was not free. When these pairs were first run against it, seven
# failed, three of them WCAG 1.4.11 non-text violations rather than AAA
# shortfalls: `--border` sat at 1.92:1 against the dark ground and 2.54:1
# against the light one, against a requirement of 3:1.
#
# A theme is not exempt from contrast because it names its tokens differently,
# so voxt is checked here under its own vocabulary rather than rewritten to
# match the others.
VOXT_PAIRS = [
    ("--fg", "--bg", AAA_TEXT, "body text on ground"),
    ("--fg", "--bg-card", AAA_TEXT, "body text on card"),
    ("--fg-muted", "--bg", AAA_TEXT, "secondary text on ground"),
    ("--fg-muted", "--bg-card", AAA_TEXT, "secondary text on card"),
    ("--fg-subtle", "--bg", AAA_TEXT, "muted text on ground"),
    ("--fg-subtle", "--bg-card", AAA_TEXT, "muted text on card"),
    ("--primary", "--bg", AAA_TEXT, "link on ground"),
    ("--primary", "--bg-card", AAA_TEXT, "link on card"),
    ("--primary-hover", "--bg-card", AAA_TEXT, "hovered link on card"),
    ("--accent", "--bg", AAA_TEXT, "accent text on ground"),
    ("--focus", "--bg", UI_NONTEXT, "focus ring against ground"),
    ("--border", "--bg", UI_NONTEXT, "border against ground"),
    ("--border-strong", "--bg-card", UI_NONTEXT, "strong border against card"),
]

# Dark-first: the unqualified `:root` block *is* the dark palette, and the
# light one is the opt-in override. The other eight are the other way round.
VOXT_MODES = (("dark", ":root"), ("light", '[data-theme="light"]'))

# WCAG 1.4.11 Non-text Contrast has no AAA level — 3:1 is the whole
# criterion. A theme that wants to be stricter than "meets AA" therefore has
# nothing higher to conform to, so these themes are held to 4.5:1 instead:
# the AA *text* threshold applied to borders and focus rings. It is the
# strictest defensible bar for non-text, and opt-in because raising it for
# every theme would fail four of them on a rule they never claimed.
# Tokens a theme declares beyond the shared vocabulary. Prism's masthead,
# hero and developer panel are navy in both schemes and carry their own
# `--hero-*` inks, and its code window has its own `--code-*` colours. A
# colour the gate does not name is a colour outside the gate — the reason
# voxt was checked under its own vocabulary rather than exempted — so these
# are held to the same thresholds as the shared pairs.
EXTRA_PAIRS = {
    "prism": [
        ("--hero-ink", "--hero-bg", AAA_TEXT, "masthead text on navy"),
        ("--hero-ink-soft", "--hero-bg", AAA_TEXT, "masthead secondary text on navy"),
        ("--hero-ink", "--hero-surface", AAA_TEXT, "masthead text on raised navy"),
        ("--hero-ink-soft", "--hero-surface", AAA_TEXT, "masthead secondary text on raised navy"),
        ("--hero-accent", "--hero-bg", AAA_TEXT, "eyebrow on navy"),
        ("--hero-accent", "--hero-bg", UI_NONTEXT, "masthead focus ring against navy"),
        ("--hero-accent", "--hero-surface", UI_NONTEXT, "masthead focus ring against raised navy"),
        ("--hero-clay", "--hero-bg", AAA_TEXT, "developer eyebrow on navy"),
        ("--hero-clay", "--hero-surface", AAA_TEXT, "notification title on raised navy"),
        ("--hero-gold", "--hero-bg", AAA_TEXT, "wordmark dot on navy"),
        ("--hero-line", "--hero-bg", UI_NONTEXT, "masthead border against navy"),
        ("--hero-bg", "--hero-ink", AAA_TEXT, "hero button label on white"),
        ("--code-plain", "--code-bg", AAA_TEXT, "code text"),
        ("--code-keyword", "--code-bg", AAA_TEXT, "code keyword"),
        ("--code-function", "--code-bg", AAA_TEXT, "code function"),
        ("--code-string", "--code-bg", AAA_TEXT, "code string"),
        ("--code-comment", "--code-bg", AAA_TEXT, "code comment"),
        ("--code-comment", "--code-bar", AAA_TEXT, "code window title"),
        ("--code-property", "--code-bg", AAA_TEXT, "code property"),
        ("--code-number", "--code-bg", AAA_TEXT, "code number"),
        ("--green-text", "--green-soft", AAA_TEXT, "green tag text on tint"),
        ("--green-text", "--surface", AAA_TEXT, "green text on surface"),
        ("--green-text", "--bg-soft", AAA_TEXT, "metric figure on soft ground"),
        ("--green", "--surface", UI_NONTEXT, "green rule against surface"),
        ("--green", "--bg-soft", UI_NONTEXT, "green rule against soft ground"),
        ("--clay-text", "--clay-soft", AAA_TEXT, "clay tag text on tint"),
        ("--clay-text", "--surface", AAA_TEXT, "clay label on surface"),
        ("--gold-text", "--gold-soft", AAA_TEXT, "gold tag text on tint"),
        ("--burgundy-text", "--burgundy-soft", AAA_TEXT, "burgundy tag text on tint"),
        ("--ink-soft", "--bg-soft", AAA_TEXT, "secondary text on soft ground"),
        ("--ink", "--bg-soft", AAA_TEXT, "body text on soft ground"),
        ("--accent", "--bg-soft", AAA_TEXT, "link on soft ground"),
        ("--ink-muted", "--bg-soft", AAA_TEXT, "muted text on soft ground"),
        ("--line", "--bg-soft", UI_NONTEXT, "control border against soft ground"),
        # The white glyph on each icon badge, against the *lightest* stop of
        # that badge's gradient — the stop that decides whether the icon can
        # be seen. WCAG 1.4.11 (3:1). These were literals inside the
        # component rule until the gate could reach them, and two of them
        # sat at 2.5:1.
        ("--badge-ink", "--badge-blue-to", UI_NONTEXT, "glyph on the blue badge"),
        ("--badge-ink", "--badge-clay-to", UI_NONTEXT, "glyph on the clay badge"),
        ("--badge-ink", "--badge-green-to", UI_NONTEXT, "glyph on the green badge"),
        ("--badge-ink", "--badge-gold-to", UI_NONTEXT, "glyph on the gold badge"),
        ("--badge-ink", "--badge-burgundy-to", UI_NONTEXT, "glyph on the burgundy badge"),
        ("--badge-ink", "--badge-navy-to", UI_NONTEXT, "glyph on the navy badge"),
        ("--badge-ink", "--badge-blue-from", UI_NONTEXT, "glyph on the blue badge, dark stop"),
        ("--badge-ink", "--badge-clay-from", UI_NONTEXT, "glyph on the clay badge, dark stop"),
        ("--badge-ink", "--badge-green-from", UI_NONTEXT, "glyph on the green badge, dark stop"),
        ("--badge-ink", "--badge-gold-from", UI_NONTEXT, "glyph on the gold badge, dark stop"),
        ("--badge-ink", "--badge-burgundy-from", UI_NONTEXT, "glyph on the burgundy badge, dark stop"),
        ("--badge-ink", "--badge-navy-from", UI_NONTEXT, "glyph on the navy badge, dark stop"),
    ],
}

STRICT_NONTEXT = frozenset({"lucid", "quill", "stablo"})
STRICT_NONTEXT_RATIO = 4.5
MODES = (("light", ":root,"), ("dark", ':root[data-theme="dark"]'))


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    failures: list[str] = []
    checked = 0

    for theme in THEMES:
        css_path = root / "themes" / theme / "_layouts" / "styles.css"
        if not css_path.exists():
            failures.append(f"{theme}: missing {css_path.relative_to(root)}")
            continue
        css = css_path.read_text(encoding="utf-8")

        for mode, selector in MODES:
            tokens = parse_tokens(css, selector)
            if not tokens:
                failures.append(f"{theme}/{mode}: no tokens found for `{selector}`")
                continue

            for fg, bg, target, label in PAIRS + EXTRA_PAIRS.get(theme, []):
                if target == UI_NONTEXT and theme in STRICT_NONTEXT:
                    target = STRICT_NONTEXT_RATIO
                if fg not in tokens or bg not in tokens:
                    failures.append(
                        f"{theme}/{mode}: token {fg} or {bg} not declared "
                        f"(needed for '{label}')"
                    )
                    continue
                got = ratio(tokens[fg], tokens[bg])
                checked += 1
                if got + 1e-9 < target:
                    failures.append(
                        f"{theme}/{mode}: {label} — {tokens[fg]} on {tokens[bg]} "
                        f"= {got:.2f}:1, need {target}:1 ({fg} / {bg})"
                    )

    # --- Gradient stops -------------------------------------------------
    # axe cannot compute contrast through a `background-image`: it reports
    # the element rather than a ratio, so a gradient is a hole in the one
    # tool that would otherwise catch this. Kinetic's brand mark sat at
    # 3.68:1 against the cyan end of its wash — a WCAG AA failure — and
    # nothing flagged the number, only the fact that a number could not be
    # produced.
    #
    # Every stop of a gradient that carries text is checked here against
    # the colour laid over it, because the worst stop is the one that
    # decides whether the text is readable.
    GRADIENT_TEXT = {
        "kinetic": [("--wash", "#ffffff", AAA_TEXT, "brand mark on wash")],
    }
    # Text whose ground is a gradient *and* whose colour changes with the
    # scheme, so both have to be read out of the same block. These are the
    # elements hidden from axe in scripts/pa11y.sh, which cannot compute a
    # ratio through a background-image; this is the check that replaces it.
    GRADIENT_TEXT_MODAL = {
        "kinetic": [
            ("--wash-soft", "--ink", AAA_TEXT, "hero heading on soft wash"),
            ("--wash-soft", "--ink-soft", AAA_TEXT, "hero lead on soft wash"),
        ],
    }
    for theme, checks in GRADIENT_TEXT_MODAL.items():
        css_path = root / "themes" / theme / "_layouts" / "styles.css"
        if not css_path.exists():
            continue
        css = css_path.read_text(encoding="utf-8")
        for mode, selector in MODES:
            tokens = parse_tokens(css, selector)
            for grad_token, ink_token, target, label in checks:
                stops = parse_gradient(css, selector, grad_token)
                fg = tokens.get(ink_token)
                if not stops or not fg:
                    failures.append(
                        f"{theme}/{mode}: {label} — could not resolve "
                        f"{grad_token} or {ink_token}"
                    )
                    continue
                for stop in stops:
                    got = ratio(fg, stop)
                    checked += 1
                    if got + 1e-9 < target:
                        failures.append(
                            f"{theme}/{mode}/gradient: {label} — {fg} on stop "
                            f"{stop} = {got:.2f}:1, need {target}:1"
                        )

    for theme, checks in GRADIENT_TEXT.items():
        css_path = root / "themes" / theme / "_layouts" / "styles.css"
        if not css_path.exists():
            continue
        css = css_path.read_text(encoding="utf-8")
        for token, fg, target, label in checks:
            stops = re.findall(
                rf"{re.escape(token)}:\s*linear-gradient\(([^;]*)\)\s*;", css
            )
            if not stops:
                failures.append(f"{theme}: no gradient found for {token}")
                continue
            for grad in stops:
                for stop in re.findall(r"#[0-9a-fA-F]{6}", grad):
                    got = ratio(fg, stop)
                    checked += 1
                    if got + 1e-9 < target:
                        failures.append(
                            f"{theme}/gradient: {label} — {fg} on stop {stop} "
                            f"= {got:.2f}:1, need {target}:1 ({token})"
                        )

    # --- Display P3 ------------------------------------------------------
    # The wide-gamut restatements are held to the same thresholds as the
    # sRGB tokens they override. They keep their lightness by
    # construction, so they should pass wherever the sRGB value does —
    # "should" being exactly the kind of assumption this file exists to
    # stop anyone relying on.
    for theme in THEMES + ("voxt",):
        css_path = root / "themes" / theme / "_layouts" / "styles.css"
        if not css_path.exists():
            continue
        css = css_path.read_text(encoding="utf-8")
        gamut = css.find("@media (color-gamut: p3)")
        if gamut == -1:
            failures.append(f"{theme}: no Display P3 block")
            continue
        p3_region = css[gamut:]
        pairs = VOXT_PAIRS if theme == "voxt" else PAIRS
        modes = VOXT_MODES if theme == "voxt" else MODES
        for mode, selector in modes:
            srgb = parse_tokens(css, selector)
            wide = parse_p3_tokens(p3_region, selector)
            if not wide:
                continue
            for fg, bg, target, label in pairs:
                if fg not in wide or bg not in srgb:
                    continue
                if target == UI_NONTEXT and theme in STRICT_NONTEXT:
                    target = STRICT_NONTEXT_RATIO
                got = ratio_mixed(p3_luminance(wide[fg]), srgb[bg])
                checked += 1
                if got + 1e-9 < target:
                    failures.append(
                        f"{theme}/{mode}/p3: {label} — {fg} on {srgb[bg]} "
                        f"= {got:.2f}:1, need {target}:1"
                    )

    voxt_css = root / "themes" / "voxt" / "_layouts" / "styles.css"
    if not voxt_css.exists():
        failures.append("voxt: missing themes/voxt/_layouts/styles.css")
    else:
        css = voxt_css.read_text(encoding="utf-8")
        for mode, selector in VOXT_MODES:
            tokens = parse_tokens(css, selector)
            if not tokens:
                failures.append(f"voxt/{mode}: no tokens found for `{selector}`")
                continue
            for fg, bg, target, label in VOXT_PAIRS:
                if fg not in tokens or bg not in tokens:
                    failures.append(
                        f"voxt/{mode}: token {fg} or {bg} not declared "
                        f"(needed for '{label}')"
                    )
                    continue
                got = ratio(tokens[fg], tokens[bg])
                checked += 1
                if got + 1e-9 < target:
                    failures.append(
                        f"voxt/{mode}: {label} — {tokens[fg]} on {tokens[bg]} "
                        f"= {got:.2f}:1, need {target}:1 ({fg} / {bg})"
                    )

    if failures:
        print(f"contrast: {len(failures)} failure(s) across {checked} checked pair(s)\n")
        for f in failures:
            print(f"  FAIL  {f}")
        return 1

    print(
        f"contrast: all {checked} token pairs pass "
        f"(AAA text; non-text 3:1, or {STRICT_NONTEXT_RATIO}:1 for {', '.join(sorted(STRICT_NONTEXT))})"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
