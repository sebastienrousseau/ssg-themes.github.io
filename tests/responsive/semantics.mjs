#!/usr/bin/env node
/**
 * Semantics, print, and degraded-delivery audit.
 *
 * Three more classes the layout and interaction suites cannot see, because
 * none of them is visible in a normally-delivered, normally-rendered page:
 *
 *   semantics  What a screen reader is handed: accessible names, landmark
 *              uniqueness, the heading outline, label associations, and
 *              whether every `aria-*` reference resolves. A dangling
 *              `aria-controls` is invisible on screen and silently breaks
 *              the announcement.
 *
 *   print      `@media print`. A sticky header repeats on every sheet, a
 *              dark surface empties a cartridge, and a link whose text is
 *              "here" is useless once the href is gone.
 *
 *   degraded   The page before — or without — its CSS and JavaScript. A
 *              theme that only works fully dressed fails every reader on a
 *              slow connection, and the island's static fallback is only a
 *              fallback if it survives the module never arriving.
 *
 * Usage:  node semantics.mjs --base http://127.0.0.1:8765/ssg-themes.github.io
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://127.0.0.1:8765/ssg-themes.github.io';

const pages = readFileSync(new URL('./pages.txt', import.meta.url), 'utf8')
  .split('\n').map((s) => s.trim()).filter(Boolean);

const failures = [];
const fail = (suite, path, ctx, detail) => failures.push({ suite, path, ctx, detail });

const browser = await chromium.launch();

// ── 1. semantics ───────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  for (const path of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    const found = await page.evaluate(() => {
      const out = [];
      const tag = (el) => el.tagName.toLowerCase() +
        (el.id ? `#${el.id}` : '') +
        (typeof el.className === 'string' && el.className
          ? `.${el.className.trim().split(/\s+/)[0]}` : '');

      // Approximate the accessible-name computation: enough to catch a
      // control that has no name at all, which is the failure that matters.
      const accName = (el) => {
        const byRef = (attr) => (el.getAttribute(attr) || '')
          .split(/\s+/).filter(Boolean)
          .map((id) => document.getElementById(id)?.textContent || '')
          .join(' ').trim();
        return (
          (el.getAttribute('aria-label') || '').trim() ||
          byRef('aria-labelledby') ||
          (el.tagName === 'IMG' ? (el.getAttribute('alt') || '').trim() : '') ||
          (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.id
            ? (document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent || '').trim() ||
              (el.closest('label')?.textContent || '').trim()
            : '') ||
          (el.textContent || '').trim() ||
          (el.getAttribute('title') || '').trim() ||
          (el.getAttribute('value') || '').trim()
        );
      };

      const shown = (el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };

      // -- every control is named --------------------------------------
      for (const el of document.querySelectorAll(
        'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"]')) {
        if (!shown(el)) continue;
        if (!accName(el)) out.push(`${tag(el)} has no accessible name`);
      }

      // -- images carry alt, decorative ones an explicit empty one ------
      for (const img of document.querySelectorAll('img')) {
        if (!img.hasAttribute('alt')) out.push(`${tag(img)} has no alt attribute`);
      }

      // -- landmarks are unique or labelled -----------------------------
      const once = { main: 'main', header: 'banner', footer: 'contentinfo' };
      for (const [sel, role] of Object.entries(once)) {
        const n = [...document.querySelectorAll(sel)]
          .filter((el) => !el.closest('article, section, aside')).length;
        if (n > 1) out.push(`${n} top-level <${sel}> elements (${role} must be unique)`);
      }
      const navs = [...document.querySelectorAll('nav')];
      const labels = navs.map((n) =>
        (n.getAttribute('aria-label') || n.getAttribute('aria-labelledby') || '').trim());
      if (navs.length > 1 && new Set(labels).size !== navs.length) {
        out.push(`${navs.length} <nav> elements without distinct labels: ${JSON.stringify(labels)}`);
      }

      // -- heading outline ----------------------------------------------
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(shown);
      const h1s = hs.filter((h) => h.tagName === 'H1');
      if (h1s.length === 0) out.push('no <h1>');
      if (h1s.length > 1) out.push(`${h1s.length} <h1> elements`);
      let prev = 0;
      for (const h of hs) {
        const lvl = Number(h.tagName[1]);
        if (prev && lvl > prev + 1) {
          out.push(`heading jumps h${prev} -> h${lvl} at "${h.textContent.trim().slice(0, 30)}"`);
        }
        prev = lvl;
      }

      // -- aria references resolve --------------------------------------
      for (const attr of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
        for (const el of document.querySelectorAll(`[${attr}]`)) {
          for (const id of (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean)) {
            if (!document.getElementById(id)) {
              out.push(`${tag(el)} ${attr}="${id}" points at no element`);
            }
          }
        }
      }

      // -- duplicate ids break every one of those references ------------
      const seen = new Map();
      for (const el of document.querySelectorAll('[id]')) {
        seen.set(el.id, (seen.get(el.id) || 0) + 1);
      }
      for (const [id, n] of seen) if (n > 1) out.push(`id "${id}" used ${n} times`);

      // -- inputs are labelled -------------------------------------------
      for (const el of document.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
        if (!shown(el)) continue;
        const labelled =
          el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') ||
          (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) ||
          el.closest('label');
        if (!labelled) out.push(`${tag(el)} has no associated label`);
      }

      // -- data tables have scoped headers -------------------------------
      for (const t of document.querySelectorAll('table')) {
        if (!t.querySelector('th')) { out.push('table has no <th>'); continue; }
        for (const th of t.querySelectorAll('th')) {
          if (!th.hasAttribute('scope')) out.push(`<th>${th.textContent.trim().slice(0, 20)}</th> has no scope`);
        }
      }
      return out;
    });
    for (const f of [...new Set(found)]) fail('semantics', path, 'a11y-tree', f);
  }
  await ctx.close();
}

// ── 2. print ───────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.emulateMedia({ media: 'print' });
  for (const path of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    const found = await page.evaluate(() => {
      const out = [];
      // A fixed or sticky element repeats on every printed sheet.
      for (const el of document.querySelectorAll('body *')) {
        // An element inside a `display:none` ancestor still reports its own
        // `display`, so the computed value proves nothing about whether it
        // renders. The box does.
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const s = getComputedStyle(el);
        if (s.position === 'fixed' || s.position === 'sticky') {
          const name = el.tagName.toLowerCase() +
            (typeof el.className === 'string' && el.className
              ? `.${el.className.trim().split(/\s+/)[0]}` : '');
          out.push(`${name} is ${s.position} in print and will repeat on every page`);
        }
      }
      // Main content must survive.
      const main = document.querySelector('main');
      if (!main || main.getBoundingClientRect().height < 50) {
        out.push('main content is missing or collapsed in print');
      }
      return out;
    });
    for (const f of [...new Set(found)]) fail('print', path, 'media-print', f);
  }
  await ctx.close();
}

// ── 3. degraded delivery ───────────────────────────────────────────────
{
  // -- no JavaScript ---------------------------------------------------
  const noJs = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  const p1 = await noJs.newPage();
  for (const path of pages) {
    await p1.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
    const found = await p1.evaluate(() => {
      const out = [];
      // Navigation must remain reachable: either the menu is visible, or
      // the disclosure is, and neither is any use if both are hidden.
      const menu = document.getElementById('navMenu');
      const btn = document.getElementById('navToggle');
      if (menu && btn) {
        const box = (el) => el.getBoundingClientRect().height > 0;
        if (!box(menu) && !box(btn)) out.push('no reachable navigation without JavaScript');
        // A disclosure that cannot open is worse than no disclosure.
        if (!box(menu) && box(btn)) out.push('navigation is behind a control that needs JavaScript');
      }
      // Every island's static content must be present and substantive.
      //
      // This used to assert `tbody tr`, which only described the one island
      // that existed when it was written — a pricing table. A tabbed island
      // with four sections of prose has no table, so a perfectly good
      // fallback was reported as missing. What actually matters is not the
      // shape of the fallback but that there is one: real elements, and
      // enough text to be worth reading.
      for (const island of document.querySelectorAll('ssg-island')) {
        const children = island.querySelectorAll('*').length;
        const text = (island.textContent || '').trim();
        if (children === 0 || text.length < 40) {
          const name = island.getAttribute('component') || 'island';
          out.push(`island "${name}" has no static fallback content`);
        }
      }
      return out;
    }, null).catch(() => []);
    for (const f of [...new Set(found)]) fail('degraded', path, 'no-js', f);
  }
  await noJs.close();

  // -- island module blocked -------------------------------------------
  const blocked = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p2 = await blocked.newPage();
  await p2.route('**/_islands/*.js', (r) => r.abort());
  // Every page carrying an island, not just the first one found. Picking a
  // single page silently stopped covering the second theme's pricing page
  // the moment one existed.
  const islandPages = pages.filter((p) => p.includes('pricing'));
  for (const islandPage of islandPages.length ? islandPages : [pages[0]]) {
    await p2.goto(`${BASE}${islandPage}`, { waitUntil: 'domcontentloaded' });
    await p2.waitForTimeout(400);
    const survived = await p2.evaluate(() => {
      const t = document.querySelector('[data-pricing-table]');
      return {
        table: !!t,
        rows: t ? t.querySelectorAll('tbody tr').length : 0,
        prices: t ? [...t.querySelectorAll('[data-amount]')].map((e) => e.textContent.trim()) : [],
        // The control is added by the module; if the module never ran it must
        // not be on the page, or it is a dead control.
        strayControl: !!document.querySelector('.billing-toggle'),
        // Same rule for the tab strip: it promises arrow-key navigation that
        // only the module delivers, so it must not exist without it.
        strayTabs: !!document.querySelector('[role="tab"]'),
      };
    });
    if (!survived.table || survived.rows === 0) {
      fail('degraded', islandPage, 'island-blocked', 'static table did not survive a blocked module');
    }
    if (survived.prices.some((p) => !p)) {
      fail('degraded', islandPage, 'island-blocked', 'prices empty without the module');
    }
    if (survived.strayControl) {
      fail('degraded', islandPage, 'island-blocked', 'billing control rendered although the module never loaded');
    }
    if (survived.strayTabs) {
      fail('degraded', islandPage, 'island-blocked', 'tab roles present although the module never loaded');
    }
  }
  await blocked.close();

  // -- stylesheet blocked ----------------------------------------------
  const noCss = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p3 = await noCss.newPage();
  await p3.route('**/*.css', (r) => r.abort());
  for (const path of pages) {
    await p3.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
    const found = await p3.evaluate(() => {
      const out = [];
      // Unstyled, everything must still be readable: nothing may rely on
      // CSS to be visible, and content order must put main before footer.
      const main = document.querySelector('main');
      if (!main || main.textContent.trim().length < 50) {
        out.push('main has no readable text without CSS');
      }
      const h1 = document.querySelector('h1');
      if (h1 && !h1.textContent.trim()) out.push('h1 is empty without CSS');
      return out;
    });
    for (const f of [...new Set(found)]) fail('degraded', path, 'no-css', f);
  }
  await noCss.close();
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
  console.log(`semantics: ${pages.length} pages — a11y tree, print, no-JS, no-CSS, blocked island: 0 defects`);
  process.exit(0);
}

console.log(`semantics: ${grouped.size} distinct defect(s)\n`);
for (const suite of ['semantics', 'print', 'degraded']) {
  const rows = [...grouped.values()].filter((g) => g.suite === suite);
  if (!rows.length) continue;
  console.log(`  ${suite} (${rows.length})`);
  for (const r of rows.slice(0, 12)) {
    console.log(`    [${r.ctx}] ${r.detail}`);
    console.log(`      ${r.hits.length} page(s), e.g. ${r.hits[0]}`);
  }
  if (rows.length > 12) console.log(`    … and ${rows.length - 12} more`);
  console.log();
}
process.exit(1);
