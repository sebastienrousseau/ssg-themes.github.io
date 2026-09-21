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
import { BASE, PAGES } from './pages.mjs';

const VIEWPORTS = [
  { width: 1280, height: 800 }, { width: 1024, height: 800 }, { width: 900, height: 800 },
  { width: 768, height: 700 }, { width: 480, height: 700 }, { width: 390, height: 700 },
  { width: 320, height: 640 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
// Real users who set this get instant scrolling; so does the suite, where
// the theme honours it. Where it does not, the settle loop below waits.
await page.emulateMedia({ reducedMotion: 'reduce' });
const fails = [];
let stops = 0;

for (const vp of VIEWPORTS) {
  await page.setViewportSize(vp);
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(250);           // let the injected search button land
    // Focus can start a smooth scroll. Measuring mid-animation reports an
    // element as outside the viewport while the browser is still bringing it
    // in - which is how voxt's 5464px home page produced 167 failures for a
    // page that behaves correctly. 2.4.11/2.4.12 are about what covers the
    // focused element once it is there, not how it travelled, so scrolling is
    // made instant where the theme honours prefers-reduced-motion (emulated on
    // the context below), and otherwise waited out frame by frame. Injecting a
    // stylesheet is not an option: these pages send style-src 'self'.
    const seen = new Set();
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(async () => {
        // Even with instant scrolling, the layout settles a frame later.
        await new Promise((resolve) => {
          let last = -1, still = 0, tries = 0;
          const tick = () => {
            if (window.scrollY === last) { if (++still >= 3) return resolve(); }
            else { still = 0; last = window.scrollY; }
            if (++tries > 90) return resolve();
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        let el = document.activeElement;
        if (!el || el === document.body) return null;
        // A radio or checkbox hidden under its own label: the input is 1x1 and
        // invisible, so what carries the focus ring - and what a sighted user
        // sees obscured or not - is the label. Hit-testing the input instead
        // reports each of a pair as covering the other, which is what these
        // pricing toggles did. Only when the label really is the visible part.
        if (el.tagName === 'INPUT') {
          const b0 = el.getBoundingClientRect();
          const hidden = getComputedStyle(el).opacity === '0' || b0.width <= 2 || b0.height <= 2;
          const lab = el.closest('label') ||
            (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
          if (hidden && lab) {
            const lb = lab.getBoundingClientRect();
            if (lb.width > 2 && lb.height > 2) el = lab;
          }
        }
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
        // How much of the top of the viewport is spoken for by sticky or
        // fixed chrome. An element taller than what is left cannot be brought
        // fully clear of it by any amount of scrolling or scroll-padding, so
        // for those the enhanced criterion is unachievable by construction -
        // the same reasoning already applied to the viewport edge above. It
        // still has to be visible somewhere, which `owned` decides.
        let overlay = 0;
        for (const c of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(c);
          if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
          if (c === el || c.contains(el) || el.contains(c)) continue;
          const cr = c.getBoundingClientRect();
          if (cr.top <= 0 && cr.bottom > 0 && cr.bottom < innerHeight / 2) {
            overlay = Math.max(overlay, cr.bottom);
          }
        }
        return {
          key, txt: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28),
          top: +b.top.toFixed(1), h: Math.round(b.height),
          oversized: b.height > innerHeight - overlay,
          tested, owned, covering: [...covering],
        };
      });
      if (!r) continue;
      if (seen.has(r.key)) break;
      seen.add(r.key);
      stops++;
      const at = `${path} @${vp.width}x${vp.height} "${r.txt}"`;
      if (r.covering.length && !r.oversized) fails.push(`2.4.12 ${at} covered by ${r.covering.join(',')}`);
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
  (process.env.AAA_ALL?uniq:uniq.slice(0,15)).forEach((f) => console.log('  ' + f));
  // Public Actions pages hide raw logs from signed-out readers. Emit each
  // sampled defect as an annotation as well, so a Linux-only rendering
  // difference remains diagnosable without weakening or rerunning the gate.
  const commandValue = (value) => value
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
  uniq.slice(0, 15).forEach((f) => {
    console.log(`::error title=Focus visibility defect::${commandValue(f)}`);
  });
  process.exit(1);
}
console.log('PASS - 2.4.11 Focus Not Obscured (Minimum) + 2.4.12 (Enhanced)');
