// SPDX-License-Identifier: Apache-2.0 OR MIT
/*
 * Self-test for the 1.4.4 clip check in clip.mjs.
 *
 * Fixtures, not built pages, so it proves the check both ways: a clipped
 * box that holds text, an image or a control must be reported, and a
 * clipped decorative layer of empty shapes must not. If the content rule
 * ever stops recognising one kind of content, the matching case fails here
 * rather than letting real clipping through on the theme pages.
 */
import { chromium } from '@playwright/test';
import { HERMETIC } from '../hermetic.mjs';
import { clippedContent } from './clip.mjs';

const BOX = 'style="overflow:hidden;height:40px"';
const TALL = 'style="display:block;height:200px"';
const CASES = [
  { name: 'clipped text', flagged: true, html: `<div ${BOX}><p ${TALL}>Words</p></div>` },
  { name: 'clipped image', flagged: true, html: `<div ${BOX}><img ${TALL} alt="Chart" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div>` },
  { name: 'clipped control', flagged: true, html: `<div ${BOX}><span ${TALL}></span><button aria-label="Play"></button></div>` },
  { name: 'decorative layer', flagged: false, html: `<div ${BOX} aria-hidden="true"><span ${TALL}></span><span ${TALL}></span></div>` },
  { name: 'nothing clipped', flagged: false, html: `<div ${BOX}><p style="margin:0">Words</p></div>` },
];

const browser = await chromium.launch(HERMETIC);
const page = await browser.newPage();
const wrong = [];
for (const c of CASES) {
  await page.setContent(`<!doctype html><body>${c.html}</body>`);
  const flagged = (await page.evaluate(clippedContent)).length > 0;
  if (flagged !== c.flagged) wrong.push(`${c.name}: expected ${c.flagged ? '' : 'no '}report`);
}
await browser.close();

if (wrong.length) {
  console.error(`clip self-test: ${wrong.length} case(s) wrong\n  ${wrong.join('\n  ')}`);
  process.exit(1);
}
console.log(`clip self-test: ${CASES.length} cases pass`);
