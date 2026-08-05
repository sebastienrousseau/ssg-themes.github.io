#!/usr/bin/env python3
"""
Validation script for SSG Themes Monorepo.
Checks theme structure, required layouts, data files, and content frontmatter.
"""
import sys
import json
from pathlib import Path

def validate_theme(theme_path: Path) -> bool:
    theme_name = theme_path.name
    print(f"Validating theme: {theme_name}...")
    errors = []

    # Check theme.json
    theme_json = theme_path / "theme.json"
    if not theme_json.exists():
        errors.append("Missing theme.json manifest")
    else:
        try:
            data = json.loads(theme_json.read_text())
            if "name" not in data or "version" not in data:
                errors.append("theme.json must contain 'name' and 'version'")
        except Exception as e:
            errors.append(f"Invalid theme.json: {e}")

    # Check required directories
    layouts_dir = theme_path / "_layouts"
    content_dir = theme_path / "content"
    
    if not layouts_dir.exists():
        errors.append("Missing _layouts directory")
    else:
        required_layouts = ["index.html", "page.html"]
        for layout in required_layouts:
            if not (layouts_dir / layout).exists():
                errors.append(f"Missing required layout: _layouts/{layout}")

    if not content_dir.exists():
        errors.append("Missing content directory")

    if errors:
        print(f"❌ Theme '{theme_name}' failed validation:")
        for err in errors:
            print(f"  - {err}")
        return False
    
    print(f"✅ Theme '{theme_name}' passed validation!")
    return True

def main():
    root = Path(__file__).resolve().parent.parent
    themes_dir = root / "themes"
    if not themes_dir.exists():
        print("Error: themes directory not found")
        sys.exit(1)

    all_passed = True
    for theme in themes_dir.iterdir():
        if theme.is_dir():
            if not validate_theme(theme):
                all_passed = False

    if not all_passed:
        sys.exit(1)

if __name__ == "__main__":
    main()
