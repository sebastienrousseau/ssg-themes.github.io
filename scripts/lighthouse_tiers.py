#!/usr/bin/env python3
"""Lighthouse tiers: which themes are site tier, and their lhci config.

  lighthouse_tiers.py site-themes <theme>...   print the site-tier themes
  lighthouse_tiers.py config <theme>           print that theme's lhci config

A `tier = "site"` theme (theme.toml) is a live site's own theme, the same
classification pageweight.py and validate.py read. Its Lighthouse config is
.lighthouserc.json with exactly one change: `resource-summary:total:size` in
the per-theme matrix becomes the `transfer_budget_kb` the theme declares.
Every category score, timing budget and audit stays as the gallery sets it.
An archetype cannot declare a budget: the key is ignored unless tier = "site".
"""

from __future__ import annotations

import copy
import json
import sys
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RC = ROOT / ".lighthouserc.json"
SIZE = "resource-summary:total:size"
THEME_PATTERN = "^https?://[^/]+/.+"


def manifest(theme: str) -> dict:
    """The theme's theme.toml, or an empty mapping when it has none."""
    path = ROOT / "themes" / theme / "theme.toml"
    if not path.is_file():
        return {}
    return tomllib.loads(path.read_text(encoding="utf-8"))


def site_themes(themes: list[str]) -> list[str]:
    """The themes among `themes` that declare tier = "site"."""
    return [t for t in themes if manifest(t).get("tier") == "site"]


def config(theme: str) -> dict:
    """.lighthouserc.json with the theme's declared transfer budget."""
    data = manifest(theme)
    if data.get("tier") != "site":
        raise SystemExit(f'{theme}: not a tier = "site" theme')
    if "transfer_budget_kb" not in data:
        raise SystemExit(f'{theme}: tier = "site" needs transfer_budget_kb in theme.toml')
    budget = int(data["transfer_budget_kb"]) * 1024
    rc = copy.deepcopy(json.loads(RC.read_text(encoding="utf-8")))
    matrix = rc["ci"]["assert"]["assertMatrix"]
    entries = [m for m in matrix if m.get("matchingUrlPattern") == THEME_PATTERN]
    if len(entries) != 1 or SIZE not in entries[0]["assertions"]:
        raise SystemExit(f"{RC.name}: expected one theme matrix entry with {SIZE}")
    entries[0]["assertions"][SIZE][1]["maxNumericValue"] = budget
    rc["ci"]["assert"]["assertMatrix"] = entries
    rc["ci"]["collect"].pop("url", None)
    return rc


def main(argv: list[str]) -> int:
    if len(argv) >= 2 and argv[1] == "site-themes":
        print("\n".join(site_themes(argv[2:])))
        return 0
    if len(argv) == 3 and argv[1] == "config":
        print(json.dumps(config(argv[2]), indent=2))
        return 0
    print(__doc__.strip().splitlines()[2], file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
