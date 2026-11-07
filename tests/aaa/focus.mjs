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
import { HERMETIC } from '../hermetic.mjs';
import { BASE, PAGES } from './pages.mjs';
import { probeFocus } from './focus-probe.mjs';

const VIEWPORTS = [
  { width: 1280, height: 800 }, { width: 1024, height: 800 }, { width: 900, height: 800 },
  { width: 768, height: 700 }, { width: 480, height: 700 }, { width: 390, height: 700 },
  { width: 320, height: 640 },
];

const browser = await chromium.launch(HERMETIC);
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
      await page.evaluate(async () => {
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
      });
      const r = await page.evaluate(probeFocus);
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
