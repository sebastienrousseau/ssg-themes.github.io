.PHONY: help build build-apex build-atlas build-velocity check check-contrast check-weight check-structure clean

help:
	@echo "SSG theme showcase"
	@echo ""
	@echo "  make build            Build all themes into public/"
	@echo "  make build-apex       Build the Apex theme"
	@echo "  make build-atlas      Build the Atlas theme"
	@echo "  make build-velocity   Build the Velocity theme"
	@echo "  make check            Run every gate (structure, contrast, weight)"
	@echo "  make clean            Remove build output"

build:
	@bash scripts/build.sh all

build-apex:
	@bash scripts/build.sh apex

build-atlas:
	@bash scripts/build.sh atlas

build-velocity:
	@bash scripts/build.sh velocity

# `check-weight` needs a build to inspect, so it depends on one. The other
# two gates read source and run standalone.
check: check-structure check-contrast build check-weight check-audit
	@echo "All gates passed."

check-structure:
	@python3 scripts/validate.py

check-contrast:
	@python3 scripts/contrast.py

check-weight:
	@python3 scripts/pageweight.py

# Mirrors the deployed URL prefix before auditing — see scripts/audit.sh.
check-audit:
	@bash scripts/audit.sh

clean:
	@rm -rf public dist
