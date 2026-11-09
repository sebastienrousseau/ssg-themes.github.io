# SPDX-License-Identifier: Apache-2.0 OR MIT
"""Unit tests for scripts/rebase_links.py.

Run with `make test` (python3 -m unittest discover -s tests/unit).
"""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))

import rebase_links

PREFIX = "/sebastienrousseau/"


class RebaseValue(unittest.TestCase):
    def test_root_absolute_gains_prefix(self) -> None:
        self.assertEqual(rebase_links.rebase_value("/about/", PREFIX), "/sebastienrousseau/about/")

    def test_already_prefixed_is_idempotent(self) -> None:
        value = "/sebastienrousseau/_csp/a.js"
        self.assertEqual(rebase_links.rebase_value(value, PREFIX), value)

    def test_protocol_relative_and_absolute_untouched(self) -> None:
        for value in ("//cdn.example/x.js", "https://example.com/x", "#top", "page.html"):
            self.assertEqual(rebase_links.rebase_value(value, PREFIX), value)


class RebaseMarkup(unittest.TestCase):
    def test_srcset_candidates_keep_descriptors(self) -> None:
        html = '<img src="/a.webp" srcset="/a.webp 1x, /a@2x.webp 2x">'
        self.assertEqual(
            rebase_links.rebase_markup(html, PREFIX),
            '<img src="/sebastienrousseau/a.webp" '
            'srcset="/sebastienrousseau/a.webp 1x, /sebastienrousseau/a@2x.webp 2x">',
        )

    def test_preload_imagesrcset_is_rebased(self) -> None:
        # Regression: imagesrcset was missing from ATTRS, so the hero
        # preload candidates pointed at /_csp/ on the gallery root (404).
        html = (
            '<link rel="preload" as="image" href="/_csp/hero-192.webp" '
            'imagesrcset="/_csp/hero-192.webp 192w, /_csp/hero-288.webp 288w" imagesizes="96px">'
        )
        out = rebase_links.rebase_markup(html, PREFIX)
        self.assertIn(
            'imagesrcset="/sebastienrousseau/_csp/hero-192.webp 192w, '
            '/sebastienrousseau/_csp/hero-288.webp 288w"',
            out,
        )
        self.assertIn('href="/sebastienrousseau/_csp/hero-192.webp"', out)

    def test_script_and_style_bodies_are_verbatim(self) -> None:
        html = '<script src="/m.js">fetch("/api/")</script><style>a{b:url(/x.png)}</style>'
        out = rebase_links.rebase_markup(html, PREFIX)
        self.assertIn('src="/sebastienrousseau/m.js"', out)
        self.assertIn('fetch("/api/")', out)
        self.assertIn("url(/x.png)", out)


if __name__ == "__main__":
    unittest.main()
