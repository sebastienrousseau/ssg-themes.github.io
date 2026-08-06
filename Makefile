.PHONY: help build build-all build-portfolio build-sebastienrousseau build-kaishi check clean

help:
	@echo "Static Site Generator Themes & Showcase (ssg-themes.github.io)"
	@echo ""
	@echo "Commands:"
	@echo "  make build               Build all themes into public/"
	@echo "  make build-portfolio     Build the portfolio theme"
	@echo "  make build-sebastienrousseau Build the sebastienrousseau theme"
	@echo "  make build-kaishi        Build the kaishi theme"
	@echo "  make check               Run validation check across themes"
	@echo "  make clean               Clean build output directory"

build: build-all

build-all:
	@bash scripts/build.sh all

build-portfolio:
	@bash scripts/build.sh portfolio

build-sebastienrousseau:
	@bash scripts/build.sh sebastienrousseau

build-kaishi:
	@bash scripts/build.sh kaishi

check:
	@python3 scripts/validate.py

clean:
	@rm -rf public/ dist/
