/* Composition: what the layout gates cannot see.
 *
 * The existing suites measure colour, target size, reflow and focus. None of
 * them looks at whether the page is actually *composed* — and three faults
 * shipped in the reference-led themes because of it:
 *
 *   1. A hero built from seven absolutely-positioned boxes at fixed
 *      percentages. The headline crossed the statistics row and the call to
 *      action landed on a card. Nothing failed: no element overflowed the
 *      viewport, so `reflow` passed, and the text still cleared AAA against
 *      its own ground, so `a11y` passed.
 *
 *   2. A photograph in a `min-height:38rem` box under `object-fit:cover`,
 *      which threw away most of the subject at every width. An image cropped
 *      to nothing is still an image, so nothing complained.
 *
 *   3. The same photograph used twice on one page, which reads as a mistake
 *      rather than a motif.
 *
 * What is asserted here, per page and per viewport:
 *
 *   distortion   an <img> whose rendered box differs from its intrinsic
 *                ratio while `object-fit` is `fill` — the image is squashed
 *   over-crop    an <img> under `cover` showing less than COVER_FLOOR of one
 *                axis — the subject is being cut away rather than framed
 *   duplicate    the same source used more than once at display size on one
 *                page
 *   collision    two elements that each carry their own text overlapping in
 *                both axes; one of them is unreadable
 *   unsized      a content <img> with no width/height attributes, which
 *                cannot reserve space and shifts the layout as it loads
 *
 * Deliberately not asserted: whether a composition is *good*. This catches
 * the mechanical faults a person would call broken, not taste.
 */
import { chromium } from '@playwright/test';
import { BASE, PAGES } from './pages.mjs';

/* How much of an axis a `cover` image may lose before it counts as cut away
   rather than framed. 0.7 allows the usual 16:10 into 4:3 reframing; Cadence's
   hero was showing 0.42 of its width. */
const COVER_FLOOR = 0.7;
/* Ignore marks, icons and rules: only things large enough to read as pictures. */
const PHOTO_MIN_PX = 160;
const OVERLAP_PX = 4;

const VIEWPORTS = [[1440, 900], [768, 1024], [390, 844]];

export const PROBE = ({ coverFloor, photoMin, overlapPx }) => {
  const out = [];
  const name = (e) => e.tagName.toLowerCase() +
    (e.id ? `#${e.id}` : '') +
    (typeof e.className === 'string' && e.className.trim()
      ? `.${e.className.trim().split(/\s+/)[0]}` : '');
  const visible = (e) => {
    const s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    // The content of a closed <details> is laid out but never painted, and
    // Chromium still reports a full-size rect for it. Taking that at face
    // value reported every FAQ answer as colliding with the question below
    // it, on a disclosure list that renders perfectly.
    const d = e.closest('details:not([open])');
    if (d && !e.closest('summary') && e !== d) return false;
    if (typeof e.checkVisibility === 'function' &&
        !e.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) {
      return false;
    }
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // --- images -----------------------------------------------------------
  const seen = new Map();
  for (const img of document.querySelectorAll('img')) {
    if (!visible(img) || !img.naturalWidth) continue;
    const r = img.getBoundingClientRect();
    const box = r.width / r.height;
    const nat = img.naturalWidth / img.naturalHeight;
    const fit = getComputedStyle(img).objectFit;

    if (fit === 'fill' && Math.abs(box - nat) / nat > 0.02) {
      out.push({ kind: 'distortion', detail: `${name(img)} is drawn at ${box.toFixed(2)} but is ${nat.toFixed(2)} — stretched` });
    }
    if (fit === 'cover') {
      const shown = Math.min(box / nat, nat / box);   // fraction of the short axis kept
      if (shown < coverFloor) {
        out.push({ kind: 'over-crop', detail: `${name(img)} shows ${(shown * 100).toFixed(0)}% of its frame (box ${box.toFixed(2)} vs native ${nat.toFixed(2)})` });
      }
    }
    if (r.width >= photoMin && (!img.getAttribute('width') || !img.getAttribute('height'))) {
      out.push({ kind: 'unsized', detail: `${name(img)} has no width/height attributes` });
    }
    if (r.width >= photoMin) {
      // Full path, minus any responsive width suffix: /x/a-640.webp and
      // /x/a-1200.webp are the same picture, /a/s.webp and /b/s.webp are not.
      const key = new URL(img.currentSrc || img.src, location.href).pathname.replace(/-\d+(?=\.\w+$)/, '');
      seen.set(key, (seen.get(key) || 0) + 1);
    }
  }
  for (const [src, n] of seen) {
    if (n > 1) out.push({ kind: 'duplicate', detail: `${src} appears ${n} times at display size on one page` });
  }

  /* The rect an element reports ignores any ancestor clipping it. A code
     sample inside a pane with `overflow:hidden` still claims its full
     height, so it appears to collide with whatever sits below the pane even
     though the visible part stops at the edge. Intersect with every
     clipping ancestor and compare what a reader can actually see. */
  const clippedRect = (el) => {
    let r = el.getBoundingClientRect();
    let box = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const o = getComputedStyle(a);
      if (!/hidden|clip|auto|scroll/.test(o.overflow + o.overflowX + o.overflowY)) continue;
      const ar = a.getBoundingClientRect();
      box = {
        left: Math.max(box.left, ar.left), top: Math.max(box.top, ar.top),
        right: Math.min(box.right, ar.right), bottom: Math.min(box.bottom, ar.bottom),
      };
    }
    return box;
  };

  // --- text colliding with text -----------------------------------------
  // Only elements that own a text node, so a wrapper overlapping its own
  // decoration is not reported. Fixed and sticky chrome is excluded: a
  // masthead passing over content as the page scrolls is the pattern
  // working, and `focus.mjs` already decides whether it obscures anything.
  const texty = [...document.querySelectorAll('body *')].filter((e) => {
    if (!visible(e)) return false;
    if (e.closest('#ssg-search-widget')) return false;
    // Descendants of sticky/fixed chrome travel with that chrome too. Looking
    // only at the descendant's own position reported masthead copy as page
    // content colliding with an intentionally floating header.
    for (let n = e; n && n !== document.body; n = n.parentElement) {
      const p = getComputedStyle(n).position;
      if (p === 'fixed' || p === 'sticky') return false;
    }
    const cs = getComputedStyle(e);
    // An inline box that wraps reports a single rect spanning every line it
    // covers, so two inline runs on neighbouring lines intersect without
    // overlapping on screen. Compare block-level boxes only.
    if (cs.display.startsWith('inline')) return false;
    if (e.closest('[aria-hidden="true"]')) return false;
    return [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
  });
  for (let i = 0; i < texty.length; i++) {
    for (let j = i + 1; j < texty.length; j++) {
      const A = texty[i], B = texty[j];
      if (A.contains(B) || B.contains(A)) continue;
      const a = clippedRect(A), b = clippedRect(B);
      if (a.right <= a.left || a.bottom <= a.top) continue;   // clipped away
      if (b.right <= b.left || b.bottom <= b.top) continue;
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > overlapPx && oy > overlapPx) {
        out.push({ kind: 'collision', detail: `${name(A)} overlaps ${name(B)} by ${Math.round(ox)}x${Math.round(oy)}px ` +
          `([${Math.round(a.left)},${Math.round(a.top)},${Math.round(a.right)},${Math.round(a.bottom)}] / ` +
          `[${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.right)},${Math.round(b.bottom)}])` });
      }
    }
  }
  return out;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const only = process.env.ONLY_THEME;
  const pages = only ? PAGES.filter((p) => p.startsWith(`/${only}/`)) : PAGES;
  if (!pages.length) throw new Error(`no pages for ONLY_THEME=${only}`);

  const browser = await chromium.launch();
  const found = new Map();
  let renders = 0;

  for (const [w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    for (const path of pages) {
      const res = await page.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => null);
      if (!res || res.status() >= 400) continue;
      const defects = await page.evaluate(PROBE, { coverFloor: COVER_FLOOR, photoMin: PHOTO_MIN_PX, overlapPx: OVERLAP_PX });
      renders++;
      for (const d of defects) {
        const key = `${d.kind}|${path}|${d.detail}`;
        if (!found.has(key)) found.set(key, { ...d, path, widths: [] });
        found.get(key).widths.push(w);
      }
    }
    await ctx.close();
  }
  await browser.close();

  console.log(`composition: ${renders} renders (${pages.length} pages x ${VIEWPORTS.length} viewports)`);
  if (!found.size) {
    console.log('PASS — no distorted or over-cropped images, no repeated photographs, no colliding text');
    process.exit(0);
  }
  const order = ['collision', 'over-crop', 'distortion', 'duplicate', 'unsized'];
  console.log(`FAIL ${found.size} distinct defect(s):`);
  for (const kind of order) {
    const rows = [...found.values()].filter((f) => f.kind === kind);
    if (!rows.length) continue;
    console.log(`  ${kind} (${rows.length})`);
    for (const r of rows.slice(0, 40)) console.log(`    ${r.path} @${r.widths.join(',')} — ${r.detail}`);
    if (rows.length > 12) console.log(`    … and ${rows.length - 12} more`);
  }
  process.exit(1);
}
