#!/usr/bin/env python3
"""Fill the showcase's headline figures from the gates that produce them.

The page says, above these numbers, that they "are produced by gates that run
on every commit — there are no hardcoded score badges here". That was not
true: all four were typed into public_index.html, and two had gone stale —
it claimed 136 colour pairs when the gate checked 238, and a 6.9 KB heaviest
page when the heaviest was 12.4 KB.

A number typed next to a promise that it is generated is worse than an
ungated number, because the promise is what stops anyone checking. So the
source now carries placeholders and this fills them from the real output. A
placeholder left unfilled fails the build rather than shipping a dash.
"""
from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys


def run(script: str) -> str:
    out = subprocess.run(
        [sys.executable, f"scripts/{script}"],
        capture_output=True, text=True, check=False,
    )
    return out.stdout + out.stderr


def main() -> int:
    root = pathlib.Path(".")
    page = root / "public" / "index.html"
    if not page.is_file():
        print("facts: public/index.html not built yet", file=sys.stderr)
        return 1

    facts: dict[str, str] = {}

    contrast = run("contrast.py")
    m = re.search(r"all (\d+) token pairs pass", contrast)
    if m:
        facts["tokens"] = m.group(1)

    weight = run("pageweight.py")
    m = re.search(r"at ([\d.]+) KB gzipped", weight)
    if m:
        facts["heaviest"] = f"{m.group(1)} KB"
    m = re.search(r"(\d+) third-party subresources", weight)
    if m:
        facts["thirdparty"] = m.group(1)

    reports = sorted((root / "public").glob("*/accessibility-report.json"))
    if reports:
        total = 0
        for r in reports:
            try:
                total += int(json.loads(r.read_text()).get("total_issues", 0))
            except (OSError, ValueError):
                print(f"facts: unreadable {r}", file=sys.stderr)
                return 1
        facts["a11y"] = str(total)

    html = page.read_text(encoding="utf-8")
    for key, value in facts.items():
        html = re.sub(
            rf'(<b data-fact="{key}">)[^<]*(</b>)',
            lambda mm: mm.group(1) + value + mm.group(2),
            html,
        )

    # An unfilled placeholder means a gate changed its wording and this stopped
    # reading it. Better to fail than to publish a dash under a promise.
    left = re.findall(r'<b data-fact="([a-z]+)">\s*(?:—|-)?\s*</b>', html)
    if left:
        print(f"facts: no value for {', '.join(left)}", file=sys.stderr)
        return 1

    page.write_text(html, encoding="utf-8")
    print("facts: " + ", ".join(f"{k}={v}" for k, v in sorted(facts.items())))
    return 0


if __name__ == "__main__":
    sys.exit(main())
