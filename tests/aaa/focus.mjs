/* WCAG 2.4.11 Focus Not Obscured (Minimum, AA) and 2.4.12 (Enhanced, AAA).
 *
 * Both criteria are about author-created content covering the focused item.
 * The only sound way to test that is paint order: rectangle overlap says
 * nothing, because a skip link with a higher z-index legitimately sits on top
 * of the sticky masthead it overlaps. So every assertion here goes through
 * document.elementFromPoint - if the focused element is what the browser
 * would hand a click at points inside it, nothing is covering it.
 *
 * The viewport edge is not author-created content, so an element taller than
 * the space below the header is not a failure; what must hold is that a
 * usable part of the focus ring is actually on screen. */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://127.0.0.1:8732';
const PAGES = [
  '/lucid/', '/lucid/installation/', '/lucid/configuration/', '/lucid/accessibility/',
  '/lucid/fr/', '/lucid/fr/installation/', '/lucid/fr/configuration/', '/lucid/fr/accessibilite/',
];
const VIEWPORTS = [
  { width: 1280, height: 800 }, { width: 1024, height: 800 }, { width: 900, height: 800 },
  { width: 768, height: 700 }, { width: 480, height: 700 }, { width: 390, height: 700 },
  { width: 320, height: 640 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
const fails = [];
let stops = 0;

for (const vp of VIEWPORTS) {
  await page.setViewportSize(vp);
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(250);           // let the injected search button land
    const seen = new Set();
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        if (el.closest('#ssg-search-widget') || el.id === 'ssg-search-btn') return null;
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) return null;
        const key = el.tagName + ':' + (el.textContent || '').trim().slice(0, 24) + ':' + Math.round(b.top);

        // Sample a grid across the element and ask who would receive a click.
        let owned = 0, tested = 0;
        const covering = new Set();
        for (const fx of [0.08, 0.3, 0.5, 0.7, 0.92]) {
          for (const fy of [0.06, 0.25, 0.5, 0.75, 0.94]) {
            const x = b.left + b.width * fx, y = b.top + b.height * fy;
            if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
            tested++;
            const top = document.elementFromPoint(x, y);
            if (!top) continue;
            if (top === el || el.contains(top) || top.contains(el)) { owned++; continue; }
            covering.add(top.tagName + (top.id ? '#' + top.id : '.' + (('' + top.className).trim().split(/\s+/)[0] || '?')));
          }
        }
        return {
          key, txt: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28),
          top: +b.top.toFixed(1), h: Math.round(b.height),
          tested, owned, covering: [...covering],
        };
      });
      if (!r) continue;
      if (seen.has(r.key)) break;
      seen.add(r.key);
      stops++;
      const at = `${path} @${vp.width}x${vp.height} "${r.txt}"`;
      if (r.covering.length) fails.push(`2.4.12 ${at} covered by ${r.covering.join(',')}`);
      else if (r.tested === 0) fails.push(`2.4.11 ${at} focused entirely outside the viewport (top=${r.top})`);
      else if (r.owned === 0) fails.push(`2.4.11 ${at} focus ring not visible anywhere (h=${r.h})`);
    }
  }
}

await browser.close();
console.log(`focus: ${stops} focus stops hit-tested (${PAGES.length} pages x ${VIEWPORTS.length} viewports)`);
if (fails.length) {
  const uniq = [...new Set(fails)];
  console.log(`FAIL ${uniq.length}:`);
  uniq.slice(0, 15).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('PASS - 2.4.11 Focus Not Obscured (Minimum) + 2.4.12 (Enhanced)');
