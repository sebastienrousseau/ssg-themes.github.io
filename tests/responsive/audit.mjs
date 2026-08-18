#!/usr/bin/env node
/**
 * Cross-viewport layout audit.
 *
 * Loads every built page at every viewport in the matrix below, in both
 * colour schemes, and measures the things that actually break a layout on a
 * real device. Nothing here is a screenshot diff — each check is a numeric
 * assertion about the rendered box tree, so a failure names the element and
 * the measurement rather than "these pixels differ".
 *
 * Checks, and why each one is here:
 *
 *   overflow-x    A page wider than its viewport forces sideways scrolling.
 *                 WCAG 1.4.10 (Reflow) requires content to reflow at 320px
 *                 without it, which is the width this matrix starts at.
 *   element-wide  An individual element wider than the viewport, reported
 *                 separately because it names the culprit rather than the
 *                 document. `.table-wrap` style scroll containers are
 *                 exempt: scrolling *inside* a container is the fix, not
 *                 the defect.
 *   target-size   Interactive controls below 24x24 CSS px fail WCAG 2.5.8
 *                 (AA). 44x44 is the AAA/Apple guidance the themes claim,
 *                 so both thresholds are reported.
 *   overlap       Two interactive elements whose boxes intersect — a tap
 *                 lands on whichever is on top, which on touch is a
 *                 coin flip.
 *   offscreen     An interactive element positioned outside the viewport
 *                 that is not deliberately hidden.
 *   tiny-text     Body copy under 12px, below which reading fails on a
 *                 phone regardless of contrast.
 *
 * Usage:  node audit.mjs [--base http://127.0.0.1:8765/ssg-themes.github.io]
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const BASE =
  process.argv.includes('--base')
    ? process.argv[process.argv.indexOf('--base') + 1]
    : 'http://127.0.0.1:8765/ssg-themes.github.io';

/**
 * Real devices, not round numbers. 320 is the WCAG 1.4.10 floor and the
 * iPhone SE (1st gen); 4K is included because `clamp()` ceilings and
 * `max-width` containers are where wide layouts fall apart.
 */
const VIEWPORTS = [
  { name: '320x568  iPhone SE 1', width: 320, height: 568, touch: true },
  { name: '360x740  Android', width: 360, height: 740, touch: true },
  { name: '375x667  iPhone SE 3', width: 375, height: 667, touch: true },
  { name: '390x844  iPhone 14', width: 390, height: 844, touch: true },
  { name: '414x896  iPhone 11 PM', width: 414, height: 896, touch: true },
  { name: '768x1024 iPad portrait', width: 768, height: 1024, touch: true },
  { name: '820x1180 iPad Air', width: 820, height: 1180, touch: true },
  { name: '1024x768 iPad landscape', width: 1024, height: 768, touch: true },
  { name: '1280x800 laptop', width: 1280, height: 800, touch: false },
  { name: '1440x900 laptop', width: 1440, height: 900, touch: false },
  { name: '1920x1080 desktop', width: 1920, height: 1080, touch: false },
  { name: '2560x1440 QHD', width: 2560, height: 1440, touch: false },
  { name: '3840x2160 4K', width: 3840, height: 2160, touch: false },
];

const SCHEMES = ['light', 'dark'];

/** Runs in the page. Returns a flat list of defects. */
function probe() {
  const out = [];
  const vw = document.documentElement.clientWidth;
  const de = document.documentElement;

  const label = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className
      ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
      : '';
    const txt = (el.textContent || '').trim().slice(0, 24);
    return `${el.tagName.toLowerCase()}${id}${cls}${txt ? ` "${txt}"` : ''}`;
  };

  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0')
      return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // --- document-level horizontal overflow -----------------------------
  if (de.scrollWidth > de.clientWidth + 1) {
    out.push({
      kind: 'overflow-x',
      detail: `document scrollWidth ${de.scrollWidth} > clientWidth ${de.clientWidth}`,
    });
  }

  // --- elements wider than the viewport -------------------------------
  // A scroll container is the *fix* for wide content, so anything inside
  // one, and the container itself, is exempt.
  const scrollable = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const ov = getComputedStyle(n).overflowX;
      if (ov === 'auto' || ov === 'scroll') return true;
    }
    return false;
  };
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || scrollable(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width > vw + 1) {
      out.push({
        kind: 'element-wide',
        detail: `${label(el)} is ${Math.round(r.width)}px wide in a ${vw}px viewport`,
      });
    }
    if (r.left < -1 || r.right > vw + 1) {
      const s = getComputedStyle(el);
      // Skip-links and the like park themselves offscreen on purpose.
      if (s.position === 'absolute' || s.position === 'fixed') continue;
      out.push({
        kind: 'element-escapes',
        detail: `${label(el)} spans ${Math.round(r.left)}..${Math.round(r.right)} outside 0..${vw}`,
      });
    }
  }

  // --- interactive target sizes ---------------------------------------
  const INTERACTIVE = 'a[href], button, input, select, textarea, summary, [role="button"]';
  const controls = [...document.querySelectorAll(INTERACTIVE)].filter(visible);
  // 2.5.8 is not a bare "every target is 24x24" rule — it carries two
  // exceptions that are part of the criterion, not loopholes:
  //
  //   Inline   The target sits in a sentence, where its size is set by the
  //            line-height of the text around it. Enlarging it would break
  //            the line. A standalone link that merely computes to
  //            `display: inline` is NOT covered — a nav item or a row in a
  //            list of links is a target in its own right.
  //   Spacing  An undersized target passes if a 24px-diameter circle
  //            centred on it does not touch any other target's box, or the
  //            circle of another undersized one. A sparse footer of small
  //            text links is reachable; a tight stack of them is not.
  //
  // Both matter here. Implementing neither passed a page of 19px taxonomy
  // links that axe correctly failed; implementing only the first then
  // failed 88 well-spaced footer links that axe correctly passed. The
  // criterion distinguishes them, so the audit has to as well.
  const boxes = controls.map((el) => el.getBoundingClientRect());
  const undersized = (r) => r.width < 24 || r.height < 24;
  const circleOf = (r) => ({
    cx: r.left + r.width / 2, cy: r.top + r.height / 2, rad: 12,
  });
  const circleHitsRect = (c, r) => {
    const nx = Math.max(r.left, Math.min(c.cx, r.right));
    const ny = Math.max(r.top, Math.min(c.cy, r.bottom));
    return Math.hypot(c.cx - nx, c.cy - ny) < c.rad;
  };
  const hasClearSpacing = (i) => {
    const c = circleOf(boxes[i]);
    for (let j = 0; j < controls.length; j++) {
      if (j === i || controls[i].contains(controls[j]) || controls[j].contains(controls[i]))
        continue;
      const other = boxes[j];
      if (circleHitsRect(c, other)) return false;
      if (undersized(other)) {
        const c2 = circleOf(other);
        if (Math.hypot(c.cx - c2.cx, c.cy - c2.cy) < c.rad + c2.rad) return false;
      }
    }
    return true;
  };

  const inlineInSentence = (el, cs) => {
    if (el.tagName !== 'A' || cs.display !== 'inline') return false;
    const parent = el.parentElement;
    if (!parent) return false;
    const own = (el.textContent || '').trim();
    const around = (parent.textContent || '').trim();
    return around.length > own.length + 1;
  };

  for (let i = 0; i < controls.length; i++) {
    const el = controls[i], r = boxes[i];
    const cs = getComputedStyle(el);
    if (inlineInSentence(el, cs)) continue;
    // A skip link parks itself outside the viewport until focused; its
    // resting box is not a tap target, and measuring it reported a size no
    // user can ever hit. What matters is its size *when focused*, checked
    // separately below.
    const parked =
      (cs.position === 'absolute' || cs.position === 'fixed') &&
      (r.right < 0 || r.bottom < 0 || r.left > vw || r.top > window.innerHeight);
    if (parked) continue;
    const w = Math.round(r.width), h = Math.round(r.height);
    if (w >= 44 && h >= 44) continue;
    if (hasClearSpacing(i)) continue;
    if (w < 24 || h < 24) {
      out.push({ kind: 'target-size-aa', detail: `${label(el)} is ${w}x${h} (WCAG 2.5.8 needs 24x24, and it is not clear of neighbours)` });
    } else {
      out.push({ kind: 'target-size-aaa', detail: `${label(el)} is ${w}x${h} (theme claims 44x44)` });
    }
  }

  // --- skip links, measured in the state a user actually meets them ----
  for (const el of document.querySelectorAll('a.skip-link, a[href^="#"][class*="skip"]')) {
    el.focus();
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width), h = Math.round(r.height);
    if (w < 44 || h < 44) {
      out.push({ kind: 'target-size-aaa', detail: `${label(el)} is ${w}x${h} when focused` });
    }
    el.blur();
  }

  // --- overlapping interactive elements --------------------------------
  for (let i = 0; i < controls.length; i++) {
    for (let j = i + 1; j < controls.length; j++) {
      const a = controls[i], b = controls[j];
      if (a.contains(b) || b.contains(a)) continue;
      // A deliberately floating element (the search trigger) passing over
      // in-flow content as the page scrolls is the pattern working, not a
      // defect — the content scrolls clear. What is a genuine tap hazard is
      // two *fixed* controls sharing space, since neither can be moved.
      const pa = getComputedStyle(a).position, pb = getComputedStyle(b).position;
      const floating = (p) => p === 'fixed' || p === 'sticky';
      if (floating(pa) !== floating(pb)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox > 2 && oy > 2) {
        out.push({
          kind: 'overlap',
          detail: `${label(a)} overlaps ${label(b)} by ${Math.round(ox)}x${Math.round(oy)}px`,
        });
      }
    }
  }

  // --- the search trigger against the header it sits beside -------------
  //
  // The generator injects the trigger as `position: fixed` over the page,
  // not as a child of the header, so it cannot inherit the header's
  // vertical centring. It shipped 4-6px low on all four themes, which is
  // small enough to read as sloppiness rather than a bug and never showed
  // up in any existing check. Only meaningful while it is beside the
  // header: below 48rem it deliberately moves to the bottom corner.
  const trigger = document.querySelector('#ssg-search-btn');
  const header = document.querySelector('.site-header');
  if (trigger && header && vw >= 768) {
    const tr = trigger.getBoundingClientRect();
    const hr = header.getBoundingClientRect();
    // Only when it is actually overlapping the header band.
    if (tr.top < hr.bottom) {
      const drift = Math.round((tr.top + tr.height / 2) - (hr.top + hr.height / 2));
      if (Math.abs(drift) > 2) {
        out.push({
          kind: 'control-misaligned',
          detail: `${label(trigger)} centre is ${drift}px off the header's`,
        });
      }
    }
  }

  // --- unreadably small text -------------------------------------------
  for (const el of document.querySelectorAll('p, li, td, th, dd, dt')) {
    if (!visible(el)) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size && size < 12) {
      out.push({ kind: 'tiny-text', detail: `${label(el)} renders at ${size.toFixed(1)}px` });
    }
  }

  return out;
}

const pages = readFileSync(new URL('./pages.txt', import.meta.url), 'utf8')
  .split('\n').map((s) => s.trim()).filter(Boolean);

const browser = await chromium.launch();
const failures = [];
let checks = 0;

for (const scheme of SCHEMES) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: scheme,
      hasTouch: vp.touch,
      isMobile: vp.touch,
      deviceScaleFactor: vp.touch ? 2 : 1,
    });
    const page = await context.newPage();
    // A page that navigates off-origin would have the audit measuring
    // somebody else's site; fail loudly instead.
    page.on('framenavigated', (f) => {
      if (f === page.mainFrame() && !f.url().startsWith(BASE.split('/ssg-themes')[0])) {
        throw new Error(`navigated off-origin to ${f.url()}`);
      }
    });
    for (const path of pages) {
      const url = `${BASE}${path}`;
      const res = await page.goto(url, { waitUntil: 'networkidle' });
      if (!res || res.status() >= 400) {
        failures.push({ scheme, vp: vp.name, path, kind: 'http', detail: `status ${res?.status()}` });
        continue;
      }
      const defects = await page.evaluate(probe);
      checks++;
      for (const d of defects) failures.push({ scheme, vp: vp.name, path, ...d });
    }
    await context.close();
  }
}
await browser.close();

// --- report ------------------------------------------------------------
const byKind = new Map();
for (const f of failures) {
  const key = `${f.kind}|${f.detail}`;
  if (!byKind.has(key)) byKind.set(key, { ...f, hits: [] });
  byKind.get(key).hits.push(`${f.path} @ ${f.vp}/${f.scheme}`);
}

if (byKind.size === 0) {
  console.log(
    `responsive: ${pages.length} pages x ${VIEWPORTS.length} viewports x ${SCHEMES.length} schemes ` +
    `= ${checks} renders, 0 defects`);
  process.exit(0);
}

console.log(`responsive: ${byKind.size} distinct defect(s) across ${checks} renders\n`);
const order = ['http', 'overflow-x', 'element-escapes', 'element-wide', 'overlap', 'control-misaligned', 'target-size-aa', 'target-size-aaa', 'tiny-text'];
for (const kind of order) {
  const rows = [...byKind.values()].filter((v) => v.kind === kind);
  if (!rows.length) continue;
  console.log(`  ${kind} (${rows.length})`);
  for (const r of rows.slice(0, 12)) {
    console.log(`    ${r.detail}`);
    console.log(`      ${r.hits.length} render(s), e.g. ${r.hits[0]}`);
  }
  if (rows.length > 12) console.log(`    … and ${rows.length - 12} more`);
  console.log();
}
process.exit(1);
