/* Captures the gallery landing page as its own social preview.
 *
 * `og:image` and `twitter:image` on the landing page resolve to the
 * generator's default, <base_url>/images/screenshot.png. Nothing produced
 * that file, so every share of the gallery unfurled without a picture.
 *
 * Lives beside shots.mjs so `@playwright/test` resolves from the same
 * node_modules; a script piped in on stdin resolves from the cwd instead,
 * where there is none. */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://127.0.0.1:8733';
const OUT = process.env.SHOT_OUT || 'showcase/images/screenshot.png';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1500, height: 1000 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
});
await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForTimeout(400);
await page.screenshot({ path: OUT });
await browser.close();
console.log(`  ${OUT}  1500x1000`);
