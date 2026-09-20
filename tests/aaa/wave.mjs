#!/usr/bin/env node
/* Run the locally installed WAVE extension engine over every generated page.
 *
 * This intentionally uses the same engine as the Chrome extension. The two
 * legacy redirect stubs are excluded because Chromium follows their external
 * meta refresh; auditing the destination would no longer be an audit of this
 * repository. */
import { chromium } from '@playwright/test';
import { readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, relative, sep } from 'node:path';

const root = new URL('../../public/', import.meta.url);
const base = process.env.WAVE_BASE_URL || 'http://127.0.0.1:8099';
const wavePath = join(
  homedir(),
  'Library/Application Support/Google/Chrome/Default/Extensions',
  'jbbplnpkjmmeebjpijfedlgcdilocofh/3.3.1.0_0/wave.min.js',
);

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

function pagePath(file) {
  const rel = relative(root.pathname, file).split(sep).join('/');
  return rel.endsWith('/index.html')
    ? `/${rel.slice(0, -'index.html'.length)}`
    : `/${rel}`;
}

function itemCounts(category) {
  return Object.fromEntries(Object.entries(category?.items || {})
    .map(([id, items]) => [id, Array.isArray(items) ? items.length : 0])
    .filter(([, count]) => count));
}

const excluded = new Set(['/portfolio/', '/sebastienrousseau/']);
const paths = (await htmlFiles(root.pathname)).map(pagePath)
  .filter(path => !excluded.has(path)).sort();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  bypassCSP: true,
  viewport: { width: 1440, height: 900 },
});

let cursor = 0;
const failures = [];
let summaryDescendants = 0;
const totals = { error: 0, contrast: 0, alert: 0 };

async function worker() {
  const page = await context.newPage();
  while (cursor < paths.length) {
    const path = paths[cursor++];
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    const before = await page.locator(
      'summary a,summary button,summary input,summary select,summary textarea,' +
      'summary [tabindex]:not([tabindex="-1"])',
    ).count();
    await page.evaluate(() => {
      window.waveconfig = {
        debug: false,
        extensionUrl: '',
        platform: 'extension',
        browser: 'chrome',
      };
    });
    await page.addScriptTag({ path: wavePath });
    await page.waitForFunction(() => window.wave?.engine?.results?.error, null, {
      timeout: 5_000,
    });
    const result = await page.evaluate(() => {
      const r = window.wave.engine.results;
      return {
        error: r.error,
        contrast: r.contrast,
        alert: r.alert,
      };
    });
    const after = await page.locator(
      'summary a,summary button,summary input,summary select,summary textarea,' +
      'summary [tabindex]:not([tabindex="-1"])',
    ).count();
    summaryDescendants += before + after;
    const counts = {};
    for (const kind of Object.keys(totals)) {
      const items = itemCounts(result[kind]);
      const count = Object.values(items).reduce((sum, n) => sum + n, 0);
      totals[kind] += count;
      if (count) counts[kind] = items;
    }
    if (Object.keys(counts).length || before || after) {
      failures.push({ path, before, after, ...counts });
    }
  }
  await page.close();
}

try {
  await Promise.all(Array.from({ length: 6 }, worker));
} finally {
  await browser.close();
}

console.log(`wave: ${paths.length} generated pages`);
console.log(`wave: errors=${totals.error} contrast=${totals.contrast} alerts=${totals.alert}`);
console.log(`wave: interactive descendants in summary=${summaryDescendants}`);
if (failures.length) {
  for (const failure of failures) console.error(JSON.stringify(failure));
  process.exitCode = 1;
}
