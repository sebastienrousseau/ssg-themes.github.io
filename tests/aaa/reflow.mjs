import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:8732';
const PAGES = [
  '/lucid/', '/lucid/installation/', '/lucid/configuration/', '/lucid/accessibility/',
  '/lucid/fr/', '/lucid/fr/installation/', '/lucid/fr/configuration/', '/lucid/fr/accessibilite/',
];
// 320 is the WCAG 1.4.10 reference width; 640 at 200% zoom is the same test.
const VIEWPORTS = [
  [320,568],[360,740],[375,667],[390,844],[412,915],[768,1024],[834,1112],
  [1024,768],[1280,800],[1440,900],[1920,1080],
];
const SCHEMES = ['light','dark'];

const browser = await chromium.launch();
let checks = 0; const fails = [];
for (const scheme of SCHEMES) {
  const ctx = await browser.newContext({ colorScheme: scheme });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    for (const [w,h] of VIEWPORTS) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
      const r = await page.evaluate(() => {
        const de = document.documentElement;
        const wide = [...document.querySelectorAll('body *')]
          .filter(e => !e.closest('#ssg-search-widget'))
          .filter(e => e.getBoundingClientRect().width > window.innerWidth + 1)
          .slice(0,3)
          .map(e => (e.tagName+'.'+(typeof e.className==='string'?e.className:'')).slice(0,50));
        return { scrollW: de.scrollWidth, innerW: window.innerWidth, wide };
      });
      checks++;
      if (r.scrollW > r.innerW + 1) fails.push(`${path} @${w}x${h} ${scheme}: scrollWidth ${r.scrollW} > ${r.innerW}`);
      if (r.wide.length) fails.push(`${path} @${w}x${h} ${scheme}: overflowing ${r.wide.join(', ')}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`reflow: ${checks} page/viewport/scheme combinations checked`);
if (fails.length) { console.log(`FAIL ${fails.length}:`); fails.slice(0,15).forEach(f=>console.log('  '+f)); process.exit(1); }
console.log('PASS — no horizontal overflow anywhere');
