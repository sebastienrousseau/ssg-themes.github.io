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

THEMES = ("apex", "atlas", "kinetic", "lucid", "velocity")

# WCAG 1.4.11 Non-text Contrast has no AAA level — 3:1 is the whole
# criterion. A theme that wants to be stricter than "meets AA" therefore has
# nothing higher to conform to, so these themes are held to 4.5:1 instead:
# the AA *text* threshold applied to borders and focus rings. It is the
# strictest defensible bar for non-text, and opt-in because raising it for
# every theme would fail four of them on a rule they never claimed.
STRICT_NONTEXT = frozenset({"lucid"})
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

            for fg, bg, target, label in PAIRS:
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
