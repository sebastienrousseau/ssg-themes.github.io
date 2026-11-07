// SPDX-License-Identifier: Apache-2.0 OR MIT
/* Self-test for the audit's WCAG 2.5.5 inline exemption.
 *
 * The exemption decides which small links the target check ignores, so it
 * needs its own evidence both ways: a link in a sentence must be exempt
 * whatever its classes, and a standalone link (alone in its block, between
 * punctuation only, or beside a heading in a card) must still be reported.
 * The expectations live in the fixture as data-expect, written from the
 * criterion, not from what the audit printed. */
import { chromium } from '@playwright/test';
import { HERMETIC } from '../hermetic.mjs';
import { AUDIT } from './audit.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const b = await chromium.launch(HERMETIC);
const p = await b.newPage();
await p.goto(pathToFileURL(resolve('tests/aaa/fixtures/targets.html')).href);
const { targets } = await p.evaluate(AUDIT);
const cases = await p.$$eval('a[data-expect]', (as) =>
  as.map((a) => ({ text: a.textContent.trim().slice(0, 20), expect: a.dataset.expect })));
await b.close();

const wrong = [];
for (const c of cases) {
  const flagged = targets.some((t) => t.includes(`"${c.text}"`));
  if (flagged !== (c.expect === 'flag')) wrong.push(`"${c.text}": expected ${c.expect}, got ${flagged ? 'flag' : 'exempt'}`);
}
if (wrong.length) {
  console.error(`targets self-test: ${wrong.length} case(s) wrong\n  ${wrong.join('\n  ')}`);
  process.exit(1);
}
console.log(`targets self-test: ${cases.length} cases pass`);
