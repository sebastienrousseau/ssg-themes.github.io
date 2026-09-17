/* Light, dark and system must be three real modes, not three labels.
 *
 * Every theme ships a three-state toggle and a `theme-init.js` that stamps
 * `data-theme` on <html>. Nothing checked that stamping it changed anything.
 * It did not, on seven of the twenty themes: their page canvas is a literal
 * in a component rule rather than a token, so `.style-cadence { background:
 * #130d08 }` painted the same brown in every mode while the toggle cycled
 * cheerfully through "System", "Light" and "Dark".
 *
 * A control that reports a state it does not deliver is worse than no
 * control, so this is a hard failure rather than a warning.
 *
 * What is asserted, per theme, for both the OS preference and the explicit
 * `data-theme` attribute:
 *
 *   canvas   the painted page background differs between light and dark
 *   ink      the primary heading colour differs between light and dark
 *   honours  an explicit data-theme="light" on a dark-preferring OS wins,
 *            and vice versa, since that is the whole point of the attribute
 *
 * Deliberately not asserted: which colours. A dark-first theme is free to
 * be dark; it is not free to be identical in both modes.
 */
import { chromium } from '@playwright/test';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:8732';
const THEMES = readdirSync('themes').filter((t) => statSync(join('themes', t)).isDirectory());
if (THEMES.length < 10) throw new Error(`only ${THEMES.length} themes found under themes/`);
const SITES = [{ name: 'showcase', path: '/' }, ...THEMES.map((theme) => ({ name: theme, path: `/${theme}/` }))];

const read = async (page) =>
  page.evaluate(() => {
    const bg = (el) => getComputedStyle(el).backgroundColor;
    let canvas = bg(document.body);
    if (canvas === 'rgba(0, 0, 0, 0)') canvas = bg(document.documentElement);
    const h = document.querySelector('main h1, h1') || document.body;
    return { canvas, ink: getComputedStyle(h).color };
  });

const browser = await chromium.launch();
const fails = [];
let checked = 0;

for (const site of SITES) {
  const seen = {};
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: scheme });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${site.path}`, { waitUntil: 'domcontentloaded' });
    seen[scheme] = await read(page);

    // Exercise the real control once per site. A previous showcase build had
    // perfectly valid dark tokens but an obsolete button id, so direct DOM
    // forcing passed while the visible toggle did absolutely nothing.
    if (scheme === 'light') {
      const mode = page.locator('#mode-toggle');
      const state = page.locator('#mode-state');
      if (await mode.count() !== 1 || await state.count() !== 1) {
        fails.push(`${site.name}: missing the #mode-toggle / #mode-state control contract`);
      } else {
        const actual = [];
        for (let click = 0; click < 3; click++) {
          await mode.click();
          const clicked = await page.evaluate(() => ({
            attr: document.documentElement.getAttribute('data-theme') || 'system',
            state: document.getElementById('mode-state')?.textContent.trim() || ''
          }));
          await page.reload({ waitUntil: 'domcontentloaded' });
          clicked.persisted = await page.evaluate(() =>
            document.documentElement.getAttribute('data-theme') || 'system');
          actual.push(clicked);
        }
        const expected = ['light', 'dark', 'system'];
        for (let i = 0; i < expected.length; i++) {
          if (actual[i].attr !== expected[i] || actual[i].persisted !== expected[i]) {
            fails.push(`${site.name}: click ${i + 1} expected ${expected[i]}, got attribute=${actual[i].attr}, after reload=${actual[i].persisted}`);
          }
          if (!actual[i].state) fails.push(`${site.name}: click ${i + 1} leaves the accessible mode state empty`);
        }
      }
    }

    // The attribute must beat the OS preference in both directions.
    const opposite = scheme === 'light' ? 'dark' : 'light';
    await page.evaluate((v) => document.documentElement.setAttribute('data-theme', v), opposite);
    seen[`${scheme}->${opposite}`] = await read(page);
    await ctx.close();
  }
  checked++;

  if (seen.light.canvas === seen.dark.canvas) {
    fails.push(`${site.name}: canvas is ${seen.light.canvas} in both modes — dark mode paints nothing new`);
  }
  if (seen.light.ink === seen.dark.ink && seen.light.canvas === seen.dark.canvas) {
    fails.push(`${site.name}: heading ink is ${seen.light.ink} in both modes`);
  }
  // data-theme="dark" on a light OS must match what a dark OS gives, and vice versa.
  if (seen['light->dark'].canvas !== seen.dark.canvas) {
    fails.push(`${site.name}: data-theme="dark" gives ${seen['light->dark'].canvas} but a dark OS gives ${seen.dark.canvas}`);
  }
  if (seen['dark->light'].canvas !== seen.light.canvas) {
    fails.push(`${site.name}: data-theme="light" gives ${seen['dark->light'].canvas} but a light OS gives ${seen.light.canvas}`);
  }
}

await browser.close();
console.log(`modes: ${checked} sites checked in light, dark, and with data-theme forced both ways`);
if (fails.length) {
  console.log(`FAIL ${fails.length}:`);
  fails.forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('PASS — light, dark and system are three distinct, honoured modes');
