# SPDX-License-Identifier: Apache-2.0 OR MIT
"""Unit tests for scripts/inject_return_pill.py.

Run with `make test` (python3 -m unittest discover -s tests/unit).
"""

from __future__ import annotations

import hashlib
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))

import inject_return_pill as pill

PAGE = (
    '<html lang="{lang}"><head>'
    '<link rel="stylesheet" href="/t/styles.abc.css" integrity="sha384-OLD">'
    '<script src="/t/main.abc.js" integrity="sha384-OLD" defer></script>'
    "</head><body><main>x</main></body></html>"
)


class ThemeCount(unittest.TestCase):
    def test_counts_theme_manifests_only(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            themes = Path(tmp)
            for slug in ("a", "b"):
                (themes / slug).mkdir()
                (themes / slug / "theme.toml").write_text("name = 'x'\n")
            (themes / "not-a-theme").mkdir()
            (themes / "NOTES.md").write_text("")
            self.assertEqual(pill.theme_count(themes), 2)

    def test_empty_set_is_an_error(self) -> None:
        with tempfile.TemporaryDirectory() as tmp, self.assertRaises(SystemExit):
            pill.theme_count(Path(tmp))

    def test_repository_count_matches_manifests(self) -> None:
        expected = len(list((pill.REPO_ROOT / "themes").glob("*/theme.toml")))
        self.assertEqual(pill.theme_count(), expected)


class PatchPage(unittest.TestCase):
    LINK = '<link rel="stylesheet" href="/t/_gallery/return-pill.x.css">'

    def test_english_page_gets_english_pill_and_its_stylesheet(self) -> None:
        out = pill.patch_page(PAGE.format(lang="en"), "index.html", self.LINK, 7)
        self.assertIn('href="/">← All 7 themes</a></nav></body>', out)
        self.assertIn(f"{self.LINK}</head>", out)
        # The generator's own assets and their integrity are left alone.
        self.assertEqual(out.count("sha384-OLD"), 2)

    def test_french_by_path_or_lang(self) -> None:
        by_path = pill.patch_page(PAGE.format(lang="en"), "fr/index.html", self.LINK, 7)
        by_lang = pill.patch_page(PAGE.format(lang="fr-FR"), "about/index.html", self.LINK, 7)
        for out in (by_path, by_lang):
            self.assertIn('href="/fr/">← Les 7 thèmes</a>', out)

    def test_second_pass_adds_no_second_pill(self) -> None:
        once = pill.patch_page(PAGE.format(lang="en"), "index.html", self.LINK, 7)
        self.assertEqual(pill.patch_page(once, "index.html", self.LINK, 7), once)
        self.assertEqual(once.count('<nav class="ssg-return-nav"'), 1)
        self.assertEqual(once.count(self.LINK), 1)

    def test_redirect_and_fragment_are_not_pages(self) -> None:
        self.assertFalse(
            pill.is_content_page('<meta http-equiv="refresh"></head></body><main>')
        )
        self.assertFalse(pill.is_content_page("<div>partial</div>"))
        self.assertTrue(pill.is_content_page(PAGE))


class WriteStylesheet(unittest.TestCase):
    def test_own_fingerprinted_file_and_generator_assets_untouched(self) -> None:
        # Regression: the pill used to be appended to the generator's
        # fingerprinted bundles, so their names stopped matching their
        # bytes, and pages it did not visit kept a stale integrity hash.
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "t"
            root.mkdir()
            (root / "styles.abc.css").write_text("body{}")
            first = pill.write_stylesheet(root)
            second = pill.write_stylesheet(root)
            self.assertEqual(first, second)
            self.assertEqual((root / "styles.abc.css").read_text(), "body{}")
            files = list((root / "_gallery").glob("*.css"))
            self.assertEqual(len(files), 1)
            data = files[0].read_bytes()
            self.assertIn(hashlib.sha384(data).hexdigest()[:8], files[0].name)
            self.assertIn(f'href="/t/_gallery/{files[0].name}"', first)
            self.assertIn(f'integrity="{pill.sri_sha384(data)}"', first)
            self.assertIn('crossorigin="anonymous"', first)


if __name__ == "__main__":
    unittest.main()
