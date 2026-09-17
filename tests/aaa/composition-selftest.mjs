/* Known-answer check for composition.mjs, in the spirit of selftest.mjs:
   a gate that has never been run against an answer you already know is not
   evidence of anything. */
import { chromium } from '@playwright/test';
import { PROBE } from './composition.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const EXPECT = [
  ['distortion', 'c-stretched'],
  ['over-crop',  'c-cropped'],
  ['duplicate',  'd.svg'],
  ['collision',  'c-hit-a'],
  ['unsized',    'c-unsized'],
];
// A correct image must not be reported by any check.
const MUST_NOT_FLAG = ['c-framed', 'c-clean'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
await page.goto(pathToFileURL(resolve('tests/aaa/fixtures/composition.html')).href, { waitUntil: 'load' });
const found = await page.evaluate(PROBE, { coverFloor: 0.7, photoMin: 160, overlapPx: 4 });
await browser.close();

const fails = [];
for (const [kind, marker] of EXPECT) {
  if (!found.some((f) => f.kind === kind && f.detail.includes(marker))) {
    fails.push(`expected a "${kind}" naming ${marker}; got ${JSON.stringify(found.filter((f) => f.kind === kind).map((f) => f.detail))}`);
  }
}
for (const clean of MUST_NOT_FLAG) {
  if (found.some((f) => f.detail.includes(clean))) fails.push(`${clean} was flagged but is correct`);
}
console.log(`composition selftest: ${found.length} defect(s) found on the fixture`);
for (const f of found) console.log(`   ${f.kind}: ${f.detail}`);
if (fails.length) { console.log('FAIL:'); fails.forEach((f) => console.log('  ' + f)); process.exit(1); }
console.log('PASS — every planted fault detected, neither correct case flagged');
