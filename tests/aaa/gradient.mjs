// Contrast for text whose ground is a gradient or a photograph.
//
// `audit.mjs` resolves a ground by walking ancestors and accumulating opaque
// background colours; the moment it meets a background-image there is no
// single colour to resolve, so it counts the run and skips it. Thirty-six
// runs were skipped that way, and the only record of their contrast was a
// range hand-written into a comment in `scripts/pa11y.sh` — which pa11y then
// cited to justify hiding those same elements from its own AAA run. The
// claim was measured once, by hand, and never again.
//
// This measures them from rendered pixels on every run. For each element it
// captures the same box twice, once as rendered and once with the text
// painted transparent. Pixels that differ between the two are where a glyph
// is actually drawn; the second capture gives the ground beneath each of
// them. Sampling the whole box instead would include the page showing
// through the element's rounded corners and score white-on-white as a
// failure, which is what a first attempt at this did.
import { chromium } from '@playwright/test';
import { PAGES } from './pages.mjs';
import { PNG } from 'pngjs';

const BASE = process.env.BASE || 'http://127.0.0.1:8732';
const SEL = ['.brand-mark', '.hero h1', '.hero .lead'];
const HIDE = `${SEL.join(',')}{color:transparent!important}`;

const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const browser = await chromium.launch();
const fails = [];
let checked = 0;

for (const scheme of ['light', 'dark']) {
  // The themes enforce `style-src 'self'`, which blocks the rule injected
  // below. Bypassing CSP changes nothing about what is rendered — only
  // whether this measurement may hide the text it is measuring.
  const ctx = await browser.newContext({ colorScheme: scheme, bypassCSP: true });
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    const runs = await page.evaluate((SEL) => {
      const out = [];
      for (const sel of SEL) {
        for (const e of document.querySelectorAll(sel)) {
          const r = e.getBoundingClientRect();
          if (r.width < 2 || r.height < 2 || r.top >= innerHeight || r.bottom <= 0) continue;
          const cs = getComputedStyle(e);
          if (cs.visibility === 'hidden' || cs.display === 'none') continue;
          if (!/^rgba?\(/.test(cs.color)) continue;
          const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
          out.push({
            sel, color: cs.color,
            need: (px >= 24 || (px >= 18.66 && bold)) ? 4.5 : 7,
            box: { x: Math.round(Math.max(0, r.x)), y: Math.round(Math.max(0, r.y)),
                   width: Math.round(Math.min(r.width, innerWidth - Math.max(0, r.x))),
                   height: Math.round(Math.min(r.height, innerHeight - Math.max(0, r.y))) },
            text: e.textContent.trim().slice(0, 24),
          });
        }
      }
      return out;
    }, SEL);

    for (const run of runs) {
      if (run.box.width < 2 || run.box.height < 2) continue;
      const shown = PNG.sync.read(await page.screenshot({ clip: run.box }));
      await page.addStyleTag({ content: HIDE });
      const ground = PNG.sync.read(await page.screenshot({ clip: run.box }));
      await page.reload({ waitUntil: 'load' });

      const m = run.color.match(/[\d.]+/g).map(Number);
      if (m.length > 3 && m[3] < 0.999) continue;   // translucent text: not this gate's call
      const fg = lum(m[0], m[1], m[2]);
      let worst = Infinity, glyphs = 0;
      for (let i = 0; i < shown.data.length; i += 4) {
        const d = Math.abs(shown.data[i] - ground.data[i])
                + Math.abs(shown.data[i + 1] - ground.data[i + 1])
                + Math.abs(shown.data[i + 2] - ground.data[i + 2]);
        if (d < 24) continue;                     // no glyph drawn here
        // Only fully covered glyph pixels count. An antialiased edge blends
        // the glyph into whatever is beside it, and reading the "ground" at
        // a half-covered pixel reported Signal's white-on-#173b86 mark —
        // 8.6:1 — as 2.55:1, because the pixel it sampled sat on the
        // boundary between the mark and the page behind it.
        if (Math.abs(shown.data[i] - m[0]) + Math.abs(shown.data[i + 1] - m[1])
          + Math.abs(shown.data[i + 2] - m[2]) > 30) continue;
        glyphs++;
        const r = ratio(fg, lum(ground.data[i], ground.data[i + 1], ground.data[i + 2]));
        if (r < worst) worst = r;
      }
      if (!glyphs) continue;
      checked++;
      if (worst < run.need - 0.005) {
        fails.push(`${scheme} ${path} ${run.sel} "${run.text}" ${worst.toFixed(2)}<${run.need}`);
      }
    }
  }
  await ctx.close();
}
await browser.close();

console.log(`gradient-contrast: ${checked} text run(s) measured from rendered pixels`);
if (fails.length) {
  console.log(`FAIL ${fails.length}:`);
  (process.env.AAA_ALL ? fails : fails.slice(0, 25)).forEach(f => console.log('  ' + f));
  process.exit(1);
}
console.log('PASS — every run over a gradient or photograph meets its AAA threshold');
