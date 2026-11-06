# SPDX-License-Identifier: Apache-2.0 OR MIT
"""Unit tests for scripts/verify_sri.py."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))

import verify_sri


def site(tmp: str, css: bytes, pinned: bytes) -> Path:
    root = Path(tmp)
    (root / "t").mkdir()
    (root / "t" / "a.css").write_bytes(css)
    sri = "sha384-" + verify_sri.digest("sha384", pinned)
    (root / "t" / "index.html").write_text(
        f'<link rel="stylesheet" href="/t/a.css" integrity="{sri}">'
        '<script src="https://cdn.example/x.js" integrity="sha384-x"></script>'
    )
    return root


class VerifySri(unittest.TestCase):
    def test_matching_hash_passes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(verify_sri.main(["", str(site(tmp, b"a{}", b"a{}"))]), 0)

    def test_edited_file_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = site(tmp, b"a{}.extra{}", b"a{}")
            self.assertEqual(verify_sri.main(["", str(root)]), 1)

    def test_missing_file_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = site(tmp, b"a{}", b"a{}")
            (root / "t" / "a.css").unlink()
            self.assertEqual(verify_sri.main(["", str(root)]), 1)

    def test_nothing_pinned_is_a_failure(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "index.html").write_text("<p>no assets</p>")
            self.assertEqual(verify_sri.main(["", tmp]), 1)


if __name__ == "__main__":
    unittest.main()
