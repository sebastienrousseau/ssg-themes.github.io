/* Captures the registry screenshots from the built themes.
 *
 * The registry wants 1500x1000 and 900x600, and validate.py enforces both.
 * Taking them from the built site rather than drawing them by hand means the
 * picture cannot drift from what the theme actually renders. */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://127.0.0.1:8733';
const THEMES = (process.env.SHOT_THEMES || 'stablo,quill').split(',');
const SIZES = [
  { file: 'screenshot.png', width: 1500, height: 1000 },
  { file: 'tn.png', width: 900, height: 600 },
];

const browser = await chromium.launch();
for (const theme of THEMES) {
  for (const size of SIZES) {
    const page = await browser.newPage({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
      colorScheme: 'light',
    });
    await page.goto(`${BASE}/${theme}/`, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `themes/${theme}/images/${size.file}` });
    await page.close();
    console.log(`  ${theme}/${size.file}  ${size.width}x${size.height}`);
  }
}
await browser.close();
console.log('shots: captured');
