// SPDX-License-Identifier: Apache-2.0 OR MIT
/* Self-test for the 2.4.11/2.4.12 hit-test in focus-probe.mjs.
 *
 * The probe decides what counts as covering a focused element, so it needs
 * evidence both ways: a link that wraps across lines in running text is not
 * covered by the words beside it, and a link under an author-placed box is
 * covered, including when the box hides only one of its line fragments.
 * The expectations live in the fixture as data-expect, written from the
 * criterion, not from what the probe printed. */
import { chromium } from '@playwright/test';
import { HERMETIC } from '../hermetic.mjs';
import { probeFocus } from './focus-probe.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const b = await chromium.launch(HERMETIC);
const p = await b.newPage({ viewport: { width: 320, height: 640 } });
await p.goto(pathToFileURL(resolve('tests/aaa/fixtures/focus.html')).href);
const links = await p.$$('a[data-expect]');
const wrong = [];
for (const a of links) {
  await a.focus();
  const r = await p.evaluate(probeFocus);
  const expect = await a.getAttribute('data-expect');
  const got = r && r.covering.length ? 'covered' : 'clear';
  if (got !== expect) wrong.push(`"${r ? r.txt : '?'}": expected ${expect}, got ${got} ${r ? r.covering.join(',') : ''}`);
}
await b.close();

if (wrong.length) {
  console.error(`focus self-test: ${wrong.length} case(s) wrong\n  ${wrong.join('\n  ')}`);
  process.exit(1);
}
console.log(`focus self-test: ${links.length} cases pass`);
