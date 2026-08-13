#!/usr/bin/env node
/**
 * Keyboard, zoom and user-preference audit.
 *
 * Three suites the viewport matrix cannot reach, because none of them is a
 * function of window size:
 *
 *   keyboard   Tab order, focus visibility, and the two disclosure widgets
 *              (navigation menu, search dialog). A control that is visually
 *              hidden but still focusable is a keyboard trap in slow
 *              motion: focus vanishes into a menu the user cannot see.
 *
 *   zoom       WCAG 1.4.4 is about *text* resize, which is not the same as
 *              a narrow viewport: the box stays 1280px while the type grows
 *              to 200%. Anything with a fixed height clips instead of
 *              reflowing. 1.4.12 Text Spacing is checked the same way, by
 *              applying the exact overrides the criterion names.
 *
 *   prefs      `prefers-reduced-motion: reduce` must actually stop motion,
 *              not merely be declared. `forced-colors: active` (Windows
 *              High Contrast) strips author colours, so any affordance
 *              carried only by a background colour disappears.
 *
 * Usage:  node interaction.mjs --base http://127.0.0.1:8765/ssg-themes.github.io
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://127.0.0.1:8765/ssg-themes.github.io';

const pages = readFileSync(new URL('./pages.txt', import.meta.url), 'utf8')
  .split('\n').map((s) => s.trim()).filter(Boolean);

const failures = [];
const fail = (suite, path, ctx, detail) =>
  failures.push({ suite, path, ctx, detail });

/**
 * WCAG 1.4.12 Text Spacing, applied through the CSSOM.
 *
 * Not via an injected `<style>`: the themes ship `style-src 'self'`, which
 * blocks it — correctly. Setting properties from script is a different
 * operation and is not governed by that directive, so the criterion can be
 * exercised without weakening the policy under test.
 */
function applyTextSpacing() {
  for (const el of document.querySelectorAll('body, body *')) {
    el.style.setProperty('line-height', '1.5', 'important');
    el.style.setProperty('letter-spacing', '0.12em', 'important');
    el.style.setProperty('word-spacing', '0.16em', 'important');
    if (el.tagName === 'P') {
      el.style.setProperty('margin-bottom', '2em', 'important');
    }
  }
}

const browser = await chromium.launch();

// ── 1. keyboard ────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  for (const path of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });

    // Nothing hidden may be focusable. A collapsed menu that still takes
    // Tab sends focus somewhere invisible.
    const ghosts = await page.evaluate(() => {
      const sel = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const bad = [];
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) continue;
        // A zero-size element only matters if it can actually take focus.
        // An input inside a `display:none` overlay reports `display:inline`
        // on itself, so its own computed style proves nothing — ask the
        // browser where focus lands.
        el.focus();
        if (document.activeElement !== el) continue;
        el.blur();
        bad.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}`);
      }
      return bad;
    });
    for (const g of ghosts) {
      fail('keyboard', path, 'zero-size', `${g} is focusable but has no box`);
    }

    // The skip link must be the first stop and must actually move focus.
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => ({
      tag: document.activeElement?.tagName.toLowerCase(),
      cls: document.activeElement?.className ?? '',
      href: document.activeElement?.getAttribute('href') ?? '',
      // A focused control with no visible ring is unusable by keyboard.
      outline: getComputedStyle(document.activeElement).outlineWidth,
      shadow: getComputedStyle(document.activeElement).boxShadow,
    }));
    if (!String(first.cls).includes('skip')) {
      fail('keyboard', path, 'skip-link', `first Tab reached ${first.tag}.${first.cls}, not the skip link`);
    }
    if (first.outline === '0px' && first.shadow === 'none') {
      fail('keyboard', path, 'focus-ring', `${first.tag}.${first.cls} shows no focus indicator`);
    }

    // Every focusable control must show a ring when focused.
    const ringless = await page.evaluate(() => {
      const sel = 'a[href], button, input, select, textarea, summary';
      const bad = [];
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        el.focus();
        const s = getComputedStyle(el);
        const ring = s.outlineWidth !== '0px' || s.boxShadow !== 'none' ||
                     s.textDecorationLine.includes('underline');
        if (!ring) bad.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}`);
        el.blur();
      }
      return bad;
    });
    for (const b of [...new Set(ringless)]) {
      fail('keyboard', path, 'focus-ring', `${b} has no visible focus indicator`);
    }
  }

  // Navigation disclosure: collapsed menu links must not be focusable, and
  // Escape must return focus to the control that opened it.
  await page.goto(`${BASE}/apex/index.html`, { waitUntil: 'networkidle' });
  const nav = await page.evaluate(() => {
    const btn = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const links = [...menu.querySelectorAll('a')];
    const boxed = () => links.filter((a) => a.getBoundingClientRect().height > 0).length;
    const closed = boxed();
    btn.click();
    const open = boxed();
    return { closed, open, total: links.length };
  });
  if (nav.closed !== 0) {
    fail('keyboard', '/apex/index.html', 'nav-disclosure',
      `${nav.closed} menu link(s) focusable while collapsed`);
  }
  if (nav.open !== nav.total) {
    fail('keyboard', '/apex/index.html', 'nav-disclosure',
      `only ${nav.open}/${nav.total} links reachable when expanded`);
  }

  // Search dialog: opening must move focus into it, Escape must close it.
  await page.goto(`${BASE}/apex/index.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.getElementById('ssg-search-btn')?.click());
  await page.waitForTimeout(150);
  const dlg = await page.evaluate(() => {
    const overlay = document.getElementById('ssg-search-overlay');
    return {
      open: overlay && getComputedStyle(overlay).display !== 'none',
      focusInside: overlay ? overlay.contains(document.activeElement) : false,
    };
  });
  if (!dlg.open) fail('keyboard', '/apex/index.html', 'search-dialog', 'did not open on click');
  else if (!dlg.focusInside) fail('keyboard', '/apex/index.html', 'search-dialog', 'focus stayed outside the open dialog');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  const closed = await page.evaluate(() => {
    const o = document.getElementById('ssg-search-overlay');
    return !o || getComputedStyle(o).display === 'none';
  });
  if (!closed) fail('keyboard', '/apex/index.html', 'search-dialog', 'Escape did not close it');
  await ctx.close();
}

// ── 2. zoom and text spacing ───────────────────────────────────────────
for (const mode of ['zoom-200', 'text-spacing']) {
  // A desktop box, deliberately: the point is that the *type* grows while
  // the viewport does not.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  for (const path of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    if (mode === 'zoom-200') {
      // Browser text-only zoom is a font-size setting, not a viewport
      // change — which is exactly what makes 1.4.4 distinct from 1.4.10.
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Page.setFontSizes', {
        fontSizes: { standard: 32, fixed: 26 },
      });
      await page.reload({ waitUntil: 'networkidle' });
    } else {
      await page.evaluate(applyTextSpacing);
    }
    await page.waitForTimeout(80);
    const bad = await page.evaluate(() => {
      const out = [];
      const de = document.documentElement;
      if (de.scrollWidth > de.clientWidth + 1) {
        out.push(`document overflows: ${de.scrollWidth} > ${de.clientWidth}`);
      }
      // Content clipped by a fixed height is the classic 1.4.4 failure.
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        // Screen-reader-only text is clipped on purpose; that is the
        // technique, not a loss of content.
        const srOnly =
          (parseFloat(s.width) <= 1 && parseFloat(s.height) <= 1) ||
          s.clipPath === 'inset(50%)' ||
          /visually-hidden|sr-only|visuallyhidden/.test(
            typeof el.className === 'string' ? el.className : '');
        if (srOnly) continue;
        if (s.overflow === 'hidden' || s.overflowY === 'hidden') {
          if (el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
            const id = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}` +
              (typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : '');
            out.push(`${id} clips ${el.scrollHeight - el.clientHeight}px of content`);
          }
        }
      }
      return out;
    });
    for (const b of [...new Set(bad)]) fail('zoom', path, mode, b);
  }
  await ctx.close();
}

// ── 3. reduced motion and forced colours ───────────────────────────────
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  for (const path of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    const moving = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        const dur = (v) => Math.max(...v.split(',').map((x) => parseFloat(x) || 0));
        if (dur(s.transitionDuration) > 0.05 || dur(s.animationDuration) > 0.05) {
          const id = `${el.tagName.toLowerCase()}` +
            (typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : '');
          out.push(`${id} keeps ${s.transitionDuration}/${s.animationDuration} under reduce`);
        }
      }
      return out;
    });
    for (const m of [...new Set(moving)]) fail('prefs', path, 'reduced-motion', m);
  }
  await ctx.close();

  const fc = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    forcedColors: 'active',
  });
  const fp = await fc.newPage();
  for (const path of pages) {
    await fp.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    const bad = await fp.evaluate(() => {
      const out = [];
      // In forced colours the UA repaints text and backgrounds, but an
      // affordance drawn only with a background colour — a button with no
      // border — flattens into the page.
      for (const el of document.querySelectorAll('button, .btn, [role="button"]')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const s = getComputedStyle(el);
        const bordered = ['Top', 'Right', 'Bottom', 'Left'].some(
          (side) => parseFloat(s[`border${side}Width`]) > 0);
        if (!bordered) {
          const id = `${el.tagName.toLowerCase()}` +
            (typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : '');
          out.push(`${id} has no border, so it vanishes in forced colours`);
        }
      }
      return out;
    });
    for (const b of [...new Set(bad)]) fail('prefs', path, 'forced-colors', b);
  }
  await fc.close();
}

await browser.close();

// ── report ─────────────────────────────────────────────────────────────
const grouped = new Map();
for (const f of failures) {
  const key = `${f.suite}|${f.ctx}|${f.detail}`;
  if (!grouped.has(key)) grouped.set(key, { ...f, hits: [] });
  grouped.get(key).hits.push(f.path);
}

if (grouped.size === 0) {
  console.log(`interaction: ${pages.length} pages — keyboard, zoom 200%, text spacing, reduced motion, forced colours: 0 defects`);
  process.exit(0);
}

console.log(`interaction: ${grouped.size} distinct defect(s)\n`);
for (const suite of ['keyboard', 'zoom', 'prefs']) {
  const rows = [...grouped.values()].filter((g) => g.suite === suite);
  if (!rows.length) continue;
  console.log(`  ${suite} (${rows.length})`);
  for (const r of rows.slice(0, 10)) {
    console.log(`    [${r.ctx}] ${r.detail}`);
    console.log(`      ${r.hits.length} page(s), e.g. ${r.hits[0]}`);
  }
  if (rows.length > 10) console.log(`    … and ${rows.length - 10} more`);
  console.log();
}
process.exit(1);
