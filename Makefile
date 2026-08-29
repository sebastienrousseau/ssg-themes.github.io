.PHONY: help build build-apex build-atlas build-kinetic build-velocity build-voxt check check-contrast check-weight check-structure clean preview

help:
	@echo "SSG theme showcase"
	@echo ""
	@echo "  make build            Build all themes into public/"
	@echo "  make build-apex       Build the Apex theme"
	@echo "  make build-atlas      Build the Atlas theme"
	@echo "  make build-kinetic    Build the Kinetic theme"
	@echo "  make build-velocity   Build the Velocity theme"
	@echo "  make build-voxt       Build the Voxt theme"
	@echo "  make check            Run every gate (structure, contrast, weight)"
	@echo "  make clean            Remove build output"

build:
	@bash scripts/build.sh all

build-apex:
	@bash scripts/build.sh apex

build-atlas:
	@bash scripts/build.sh atlas

build-kinetic:
	@bash scripts/build.sh kinetic

build-velocity:
	@bash scripts/build.sh velocity

build-voxt:
	@bash scripts/build.sh voxt

# `check-weight` needs a build to inspect, so it depends on one. The other
# two gates read source and run standalone.
check: check-structure check-contrast build check-weight check-audit check-responsive
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

# 25 pages x 13 viewports x 2 colour schemes, measured not screenshotted.
check-responsive:
	@bash tests/responsive/run.sh

clean:
	@rm -rf public dist

# Serve the built site the way it is published: at the root of its own
# host. Previously the showcase lived under a path, so a preview had to
# mirror that prefix or every root-absolute URL 404'd.
preview: build ## Serve the built site as published, on :8099
	@echo "  http://127.0.0.1:8099/"
	@npx --yes http-server public -p 8099 --silent
