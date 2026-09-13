#!/usr/bin/env bash
set -euo pipefail
# pa11y over every built page, in both runners, at WCAG2AAA.
#
# The committed .pa11yci names one URL. That is how a suite ends up reporting
# success for pages it has never opened, so the list is discovered from the
# build instead and the config is generated per run. Adding a theme adds its
# pages here automatically.
cd "$(dirname "$0")/.."

[[ -d public ]] || { echo "error: run \`make build\` first" >&2; exit 1; }
# Resolve a pa11y-ci that actually runs. A bare `command -v` is not enough:
# under mise, `pa11y-ci` is a shim that resolves only when a version is
# selected for the directory, and otherwise exits with "No version is set" -
# which looks like a tool failure rather than a missing selection.
PA11Y=""
if pa11y-ci --version >/dev/null 2>&1; then
  PA11Y="pa11y-ci"
elif command -v mise >/dev/null 2>&1 && mise exec npm:pa11y-ci -- pa11y-ci --version >/dev/null 2>&1; then
  PA11Y="mise exec npm:pa11y-ci -- pa11y-ci"
elif command -v npx >/dev/null 2>&1 && npx --no-install pa11y-ci --version >/dev/null 2>&1; then
  PA11Y="npx --no-install pa11y-ci"
else
  echo "error: pa11y-ci not runnable (npm install -g pa11y-ci)" >&2
  exit 1
fi

PORT="${PORT:-8733}"
MIN_URLS="${MIN_URLS:-70}"

python3 - "$PORT" > /tmp/pa11yci.generated.json <<'PY'
import json, os, re, sys
port = sys.argv[1]
urls = []
for d, _, fs in os.walk('public'):
    for name in sorted(fs):
        if name != '404.html':
            continue
        # A 404 page has no index.html, so walking directories never finds it.
        rel404 = os.path.relpath(d, 'public').replace(os.sep, '/')
        urls.append(f"http://127.0.0.1:{port}/" + ('' if rel404 == '.' else rel404 + '/') + '404.html')
    if 'index.html' not in fs:
        continue
    # Redirect stubs have no content to audit.
    if re.search(r'http-equiv=["\']?refresh', open(os.path.join(d, 'index.html'), encoding='utf-8').read(), re.I):
        continue
    rel = os.path.relpath(d, 'public').replace(os.sep, '/')
    urls.append(f"http://127.0.0.1:{port}/" + ('' if rel == '.' else rel + '/'))
cfg = json.load(open('.pa11yci'))
cfg['urls'] = sorted(urls)
# axe cannot compute a contrast ratio through a background-image: it reports
# every text run on a gradient as failing the rule it was unable to evaluate.
# The elements below are the suite's only gradient-backed text. Their ratios
# are computed against each gradient stop by scripts/contrast.py, which is a
# gate in its own right and fails the build if any stop drops below AAA:
#
#   .brand-mark  white on the brand gradient   7.10:1 - 7.90:1
#   .hero h1     16.54:1 - 16.89:1 light, 14.83:1 - 16.71:1 dark
#   .hero .lead  13.05:1 - 13.32:1 light, 12.15:1 - 13.69:1 dark
#
# Hidden from axe only, and only these three selectors, so every other element
# on every page is still measured.
cfg.setdefault('defaults', {})['hideElements'] = '.brand-mark, .hero h1, .hero .lead'
json.dump(cfg, open('/dev/stdout', 'w'), indent=2)
PY

COUNT=$(python3 -c "import json;print(len(json.load(open('/tmp/pa11yci.generated.json'))['urls']))")
if (( COUNT < MIN_URLS )); then
  echo "error: only ${COUNT} URLs discovered, expected at least ${MIN_URLS} — the build is incomplete" >&2
  exit 1
fi

python3 -m http.server "${PORT}" --bind 127.0.0.1 -d public >/dev/null 2>&1 &
SRV=$!
trap 'kill "${SRV}" 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do
  curl -sf "http://127.0.0.1:${PORT}/" >/dev/null && break
  sleep 0.25
done

echo "pa11y: ${COUNT} pages, axe + htmlcs, WCAG2AAA"
${PA11Y} --config /tmp/pa11yci.generated.json
