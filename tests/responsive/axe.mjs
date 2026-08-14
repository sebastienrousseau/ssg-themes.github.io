#!/usr/bin/env node
/**
 * axe-core (WCAG 2.2 AA) over every built page.
 *
 * This runs axe through the same pinned Playwright Chromium as the other
 * three suites, rather than through `@axe-core/cli`. The CLI drives the
 * runner's *system* Chrome via ChromeDriver, and on GitHub's ubuntu-latest
 * image those two drift apart: every page failed with "session not
 * created: This version of ChromeDriver only supports Chrome version 151"
 * — twenty-five environment errors that said nothing about the site. A
 * browser the repo pins cannot drift from a driver the repo also pins.
 *
 * Automated rules catch perhaps 20-50% of accessibility defects, so this
 * complements the interaction and semantics suites rather than replacing
 * them.
 *
 * Usage:  node axe.mjs [--base http://127.0.0.1:8765/ssg-themes.github.io]
 */
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const BASE =
  process.argv.includes('--base')
    ? process.argv[process.argv.indexOf('--base') + 1]
    : 'http://127.0.0.1:8765/ssg-themes.github.io';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const pages = readFileSync(new URL('./pages.txt', import.meta.url), 'utf8')
  .split('\n').map((s) => s.trim()).filter(Boolean);

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const findings = [];
for (const path of pages) {
  const res = await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  if (!res || res.status() >= 400) {
    findings.push({ path, id: 'http', help: `status ${res?.status()}`, nodes: [] });
    continue;
  }
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  for (const v of violations) {
    findings.push({
      path,
      id: v.id,
      help: v.help,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target.join(' ')),
    });
  }
}
await browser.close();

if (findings.length === 0) {
  console.log(`axe: ${pages.length} pages, WCAG 2.2 AA — 0 violations`);
  process.exit(0);
}

console.log(`axe: ${findings.length} violation(s) across ${pages.length} pages\n`);
for (const f of findings) {
  console.log(`  [${f.impact ?? 'error'}] ${f.id} — ${f.help}`);
  console.log(`    ${f.path}`);
  for (const n of f.nodes.slice(0, 4)) console.log(`      ${n}`);
  if (f.nodes.length > 4) console.log(`      … and ${f.nodes.length - 4} more`);
}
process.exit(1);
