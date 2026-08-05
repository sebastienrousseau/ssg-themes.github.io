.PHONY: help build build-portfolio dev-portfolio check clean

help:
	@echo "Static Site Generator Themes & Showcase (ssg-themes.github.io)"
	@echo ""
	@echo "Commands:"
	@echo "  make build          Build all themes and demo showcase into public/"
	@echo "  make build-portfolio Build the executive portfolio theme"
	@echo "  make dev-portfolio  Start dev server for portfolio theme"
	@echo "  make check          Run validation check across themes"
	@echo "  make clean          Clean build output directory"

build: build-portfolio

build-portfolio:
	@bash scripts/build.sh portfolio

dev-portfolio:
	@ssg dev -c themes/portfolio/content -t themes/portfolio/_layouts

check:
	@python3 scripts/validate.py

clean:
	@rm -rf public/ dist/
