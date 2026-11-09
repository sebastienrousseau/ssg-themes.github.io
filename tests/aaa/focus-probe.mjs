// SPDX-License-Identifier: Apache-2.0 OR MIT
/* The focus hit-test behind focus.mjs, kept apart so focus-selftest.mjs can
 * run the same code against a fixture. Runs in the page via page.evaluate and
 * reports on document.activeElement; null when nothing is focused or the
 * element is out of scope. */
export function probeFocus() {
  let el = document.activeElement;
  if (!el || el === document.body) return null;
  // A radio or checkbox hidden under its own label: the input is 1x1 and
  // invisible, so what carries the focus ring - and what a sighted user
  // sees obscured or not - is the label. Hit-testing the input instead
  // reports each of a pair as covering the other, which is what these
  // pricing toggles did. Only when the label really is the visible part.
  if (el.tagName === 'INPUT') {
    const b0 = el.getBoundingClientRect();
    const hidden = getComputedStyle(el).opacity === '0' || b0.width <= 2 || b0.height <= 2;
    const lab = el.closest('label') ||
      (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
    if (hidden && lab) {
      const lb = lab.getBoundingClientRect();
      if (lb.width > 2 && lb.height > 2) el = lab;
    }
  }
  if (el.closest('#ssg-search-widget') || el.id === 'ssg-search-btn') return null;
  const b = el.getBoundingClientRect();
  if (!b.width || !b.height) return null;
  const key = el.tagName + ':' + (el.textContent || '').trim().slice(0, 24) + ':' + Math.round(b.top);

  // The boxes the focus ring is drawn around. An inline link that wraps is
  // one fragment per line, and its bounding box also spans the words before
  // and after it on those lines; sampling that box reports the neighbouring
  // text as covering the link, which is how a wrapped "ORCID" link in a
  // sentence failed. So a wrapped inline element is sampled fragment by
  // fragment. Anything else keeps its bounding box: an inline element that
  // holds a block child returns empty fragments around that block.
  const frags = [...el.getClientRects()].filter((q) => q.width > 1 && q.height > 1);
  const boxes = getComputedStyle(el).display === 'inline' && frags.length > 1 ? frags : [b];

  // Sample a grid across each box and ask who would receive a click.
  let owned = 0, tested = 0;
  const covering = new Set();
  for (const q of boxes) {
    for (const fx of [0.08, 0.3, 0.5, 0.7, 0.92]) {
      for (const fy of [0.06, 0.25, 0.5, 0.75, 0.94]) {
        const x = q.left + q.width * fx, y = q.top + q.height * fy;
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
        tested++;
        const top = document.elementFromPoint(x, y);
        if (!top) continue;
        if (top === el || el.contains(top) || top.contains(el)) { owned++; continue; }
        covering.add(top.tagName + (top.id ? '#' + top.id : '.' + (('' + top.className).trim().split(/\s+/)[0] || '?')));
      }
    }
  }
  // How much of the top of the viewport is spoken for by sticky or
  // fixed chrome. An element taller than what is left cannot be brought
  // fully clear of it by any amount of scrolling or scroll-padding, so
  // for those the enhanced criterion is unachievable by construction -
  // the same reasoning already applied to the viewport edge above. It
  // still has to be visible somewhere, which `owned` decides.
  let overlay = 0;
  for (const c of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(c);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    if (c === el || c.contains(el) || el.contains(c)) continue;
    const cr = c.getBoundingClientRect();
    if (cr.top <= 0 && cr.bottom > 0 && cr.bottom < innerHeight / 2) {
      overlay = Math.max(overlay, cr.bottom);
    }
  }
  return {
    key, txt: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28),
    top: +b.top.toFixed(1), h: Math.round(b.height),
    oversized: b.height > innerHeight - overlay,
    tested, owned, covering: [...covering],
  };
}
