# validate.py needs tomllib, which is Python 3.11+. macOS ships 3.9 at
# /usr/bin/python3, so hardcoding that path made `make check-structure`
# impossible to run locally while CI passed. Override with `make PYTHON=...`.
PYTHON ?= python3

.PHONY: help check-aaa check-pa11y check-lighthouse check-audit check-responsive check-links check-schema check-cloudcdn build build-apex build-atlas build-kinetic build-lucid build-quill build-stablo build-velocity build-voxt check check-contrast check-weight check-structure clean preview

help:
	@echo "SSG theme showcase"
	@echo ""
	@echo "  make build            Build all themes into public/"
	@echo "  make build-apex       Build the Apex theme"
	@echo "  make build-atlas      Build the Atlas theme"
	@echo "  make build-cadence    Build the Cadence theme"
	@echo "  make build-covenant   Build the Covenant theme"
	@echo "  make build-hearth     Build the Hearth theme"
	@echo "  make build-intent     Build the Intent theme"
	@echo "  make build-kairo      Build the Kairo theme"
	@echo "  make build-kinetic    Build the Kinetic theme"
	@echo "  make build-lucid      Build the Lucid theme"
	@echo "  make build-noir       Build the Noir theme"
	@echo "  make build-prism      Build the Prism theme"
	@echo "  make build-curio      Build the Curio theme"
	@echo "  make build-signal     Build the Signal theme"
	@echo "  make build-steward    Build the Steward theme"
	@echo "  make build-velocity   Build the Velocity theme"
	@echo "  make build-visage     Build the Visage theme"
	@echo "  make build-vista      Build the Vista theme"
	@echo "  make build-voxt       Build the Voxt theme"
	@echo "  make check            Run every gate (structure, contrast, weight, audit, responsive, aaa)"
	@echo "  make check-cloudcdn   Verify local theme rasters against the CloudCDN checkout"
	@echo "  make clean            Remove build output"
	@echo "  make screenshots      Recapture the gallery screenshots from the build"

build:
	@bash scripts/build.sh all

build-quill:
	@bash scripts/build.sh quill

build-stablo:
	@bash scripts/build.sh stablo

build-apex:
	@bash scripts/build.sh apex

build-atlas:
	@bash scripts/build.sh atlas

.PHONY: build-kaishi build-prism

.PHONY: build-cadence build-covenant build-hearth build-intent build-kairo build-noir build-curio build-scout build-signal build-steward build-visage

build-cadence:
	@bash scripts/build.sh cadence

build-covenant:
	@bash scripts/build.sh covenant

build-hearth:
	@bash scripts/build.sh hearth

build-intent:
	@bash scripts/build.sh intent

build-kairo:
	@bash scripts/build.sh kairo

build-kaishi:
	@bash scripts/build.sh kaishi

build-kinetic:
	@bash scripts/build.sh kinetic

build-lucid:
	@bash scripts/build.sh lucid

build-noir:
	@bash scripts/build.sh noir

build-prism:
	@bash scripts/build.sh prism

build-curio:
	@bash scripts/build.sh curio

build-signal:
	@bash scripts/build.sh signal

build-steward:
	@bash scripts/build.sh steward

build-velocity:
	@bash scripts/build.sh velocity

build-visage:
	@bash scripts/build.sh visage

build-voxt:
	@bash scripts/build.sh voxt

.PHONY: build-vista

build-vista:
	@bash scripts/build.sh vista

build-scout:
	@bash scripts/build.sh scout

# `check-weight` needs a build to inspect, so it depends on one. The other
# two gates read source and run standalone.
check: check-structure check-contrast build check-weight check-audit check-responsive check-aaa check-links check-pa11y check-schema
	@echo "All gates passed."

check-links:
	@bash scripts/linkcheck.sh

check-schema:
	@$(PYTHON) scripts/structured_data.py public

# This is intentionally separate from `check`: CI does not clone the sibling
# CloudCDN repository. Override its location with CLOUDCDN_ROOT when needed.
check-cloudcdn:
	@$(PYTHON) scripts/cloudcdn_images.py

check-structure:
	@$(PYTHON) scripts/validate.py

check-contrast:
	@$(PYTHON) scripts/contrast.py

check-weight:
	@$(PYTHON) scripts/pageweight.py

# Mirrors the deployed URL prefix before auditing — see scripts/audit.sh.
check-audit:
	@bash scripts/audit.sh

# Every discovered page x 13 viewports x 2 colour schemes, measured not screenshotted.
check-responsive:
	@bash tests/responsive/run.sh

# What a browser actually paints: rendered contrast against real backgrounds,
# 44px targets, heading order, and reflow at 11 widths in both schemes.
check-aaa:
	@bash tests/aaa/run.sh

# axe + htmlcs at WCAG2AAA over every built page. The two runners disagree
# often enough to be worth running both, and neither overlaps much with the
# rendered-contrast suite above.
check-pa11y:
	@bash scripts/pa11y.sh

# Lighthouse at minScore 1.0. Kept out of `check` because it wants three runs
# per page and a quiet machine; CI runs it on its own.
.PHONY: screenshots

screenshots: build ## Recapture the gallery screenshots from the built themes
	@bash scripts/screenshots.sh

check-lighthouse:
	@bash scripts/lighthouse.sh

clean:
	@rm -rf public dist

# Serve the built site the way it is published: at the root of its own
# host. Previously the showcase lived under a path, so a preview had to
# mirror that prefix or every root-absolute URL 404'd.
# Served by python rather than `npx http-server`. Every gate already serves
# the site this way, so previewing it needs no second mechanism and no
# network fetch; `npx --yes` downloads a package to hand over a static file
# server the standard library already provides.
preview: build ## Serve the built site as published, on :8099
	@echo "  http://127.0.0.1:8099/"
	@$(PYTHON) -m http.server 8099 --bind 127.0.0.1 -d public

contrast:
	@$(PYTHON) scripts/audit-contrast.py

validate:
	@$(PYTHON) scripts/validate-frontmatter.py
