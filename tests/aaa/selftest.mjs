/* Checks the audit against answers computed from first principles.
 *
 * The audit is the thing deciding whether nine themes ship, so it needs its
 * own evidence. Every expectation below is derived here from the WCAG
 * formula and the fixture's source colours - not copied from what the audit
 * printed - so agreement means both arrived at the same number independently. */
import { chromium } from '@playwright/test';
import { AUDIT } from './audit.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const lin = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const L = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const ratio = (a, b) => { const s = [L(a), L(b)].sort((x, y) => y - x); return (s[0] + 0.05) / (s[1] + 0.05); };
const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));

const WHITE = [255, 255, 255];
const INK = [29, 29, 31];

// Every ground below composites to plain white, so all four must agree.
const EXPECT = {
  plain: ratio(INK, WHITE),
  srgbfn: ratio(INK, WHITE),
  translucent: ratio(INK, over(WHITE, 0.82, WHITE)),
  rgba: ratio(INK, over(WHITE, 0.5, WHITE)),
  fail: ratio([160, 160, 160], WHITE),
  borderline: ratio([88, 88, 88], WHITE),
  alphatext: ratio(over([0, 0, 0], 0.35, WHITE), WHITE),
};

const b = await chromium.launch();
const p = await b.newPage();
await p.goto(pathToFileURL(resolve('tests/aaa/fixtures/contrast.html')).href);
const got = await p.evaluate(AUDIT);
await b.close();

const failed = new Map();
for (const line of got.contrast) {
  const m = line.match(/"([^"]*)" ([\d.]+)</);
  failed.set(m[1], Number(m[2]));
}
const byText = {
  plain: 'plain white ground', srgbfn: 'srgb function ground',
  translucent: 'translucent srgb ground', rgba: 'translucent rgba ground',
  fail: 'too light to read', borderline: 'just under seven to one',
  alphatext: 'translucent text',
};

const problems = [];
for (const [key, expected] of Object.entries(EXPECT)) {
  const text = byText[key];
  const shouldFail = expected < 7;
  const reported = failed.get(text);
  if (shouldFail && reported === undefined) {
    problems.push(`${key}: is ${expected.toFixed(2)}:1 and should have been reported, was not`);
  } else if (!shouldFail && reported !== undefined) {
    problems.push(`${key}: is ${expected.toFixed(2)}:1 and passes, but was reported at ${reported}:1`);
  } else if (shouldFail && Math.abs(reported - expected) > 0.05) {
    problems.push(`${key}: expected ${expected.toFixed(2)}:1, audit said ${reported}:1`);
  }
}
// The gradient must be declared unmeasurable, never silently passed.
if (!got._unmeasured.some((u) => u.startsWith('P'))) {
  problems.push('gradient: text on a background-image was not reported as unmeasured');
}

if (problems.length) {
  console.log(`SELFTEST FAIL ${problems.length}:`);
  problems.forEach((p) => console.log('  ' + p));
  process.exit(1);
}
console.log(`selftest: PASS — ${Object.keys(EXPECT).length} known ratios reproduced, gradient declared unmeasurable`);
