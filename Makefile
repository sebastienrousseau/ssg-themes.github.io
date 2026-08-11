.PHONY: help build build-all build-apex build-atlas build-velocity build-portfolio build-sebastienrousseau build-kaishi check clean

help:
	@echo "Static Site Generator Themes & Showcase (ssg-themes.github.io)"
	@echo ""
	@echo "Commands:"
	@echo "  make build               Build all themes into public/"
	@echo "  make build-apex          Build the Apex theme (themes/apex)"
	@echo "  make build-atlas         Build the Atlas theme (themes/atlas)"
	@echo "  make build-velocity      Build the Velocity theme (themes/velocity)"
	@echo "  make check               Run validation check across themes"
	@echo "  make clean               Clean build output directory"

build: build-all

build-all:
	@bash scripts/build.sh all

build-apex:
	@bash scripts/build.sh apex

build-atlas:
	@bash scripts/build.sh atlas

build-velocity:
	@bash scripts/build.sh velocity

# Backward-compatible target aliases
build-portfolio: build-apex
build-sebastienrousseau: build-atlas
build-kaishi: build-velocity

check:
	@python3 scripts/validate.py

clean:
	@rm -rf public/ dist/
