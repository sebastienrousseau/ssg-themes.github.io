#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0 OR MIT
"""Fail unless every theme's generated accessibility report is clean.

`ssg build` writes public/<theme>/accessibility-report.json. This used to
be inline Python in build.yml, so `make check` never ran it and a failure
showed up only in CI.
"""

import json
import pathlib
import sys

# Derived from themes/ rather than named literally. Kinetic shipped
# and deployed while this list still read apex/atlas/velocity, so
# its report was generated and never once asserted on.
themes = sorted(p.name for p in pathlib.Path("themes").iterdir() if p.is_dir())
if not themes:
    sys.exit("no themes found under themes/")
print(f"asserting on: {', '.join(themes)}")
failed = False
for theme in themes:
    p = pathlib.Path("public") / theme / "accessibility-report.json"
    # A theme that produced no report is a hole, not a pass.
    if not p.exists():
        print(f"{theme}: MISSING {p}")
        failed = True
        continue
    data = json.loads(p.read_text())
    issues = data.get("total_issues", -1)
    print(f"{theme}: {issues} issue(s) across {data.get('pages_scanned')} page(s)")
    if issues != 0:
        failed = True
        for page in data.get("pages", []):
            print(f"  {page}")
sys.exit(1 if failed else 0)
