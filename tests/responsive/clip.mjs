// SPDX-License-Identifier: Apache-2.0 OR MIT
/*
 * WCAG 1.4.4 clip check, run in the page with `page.evaluate(clippedContent)`.
 *
 * Content clipped by a fixed height is the classic 1.4.4 failure: an
 * `overflow: hidden` box whose content outgrows it once the type is larger.
 * The check reports every such box that holds something a person could
 * lose: text, an image or other media, or anything focusable. A box whose
 * whole subtree is none of these (a decorative layer of empty, aria-hidden
 * shapes, sized past its frame on purpose) has nothing to read or reach,
 * so clipping it loses nothing. That is decided from the content, never
 * from a class name or a list of selectors. `clip-selftest.mjs` pins both
 * sides.
 *
 * Self-contained: Playwright serialises the function into the page, so it
 * must not reference anything outside its own body.
 */
export function clippedContent() {
  const MEDIA = 'img, svg, video, audio, canvas, iframe, object, embed, picture';
  const FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]';
  const holdsContent = (el) =>
    el.textContent.trim() !== '' || el.querySelector(`${MEDIA}, ${FOCUSABLE}`) !== null;
  const out = [];
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    out.push(`document overflows: ${de.scrollWidth} > ${de.clientWidth}`);
  }
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    // Screen-reader-only text is clipped on purpose; that is the
    // technique, not a loss of content.
    const srOnly =
      (parseFloat(s.width) <= 1 && parseFloat(s.height) <= 1) ||
      s.clipPath === 'inset(50%)' ||
      /visually-hidden|sr-only|visuallyhidden/.test(
        typeof el.className === 'string' ? el.className : '');
    if (srOnly) continue;
    if (s.overflow !== 'hidden' && s.overflowY !== 'hidden') continue;
    if (el.scrollHeight <= el.clientHeight + 2 || el.clientHeight === 0) continue;
    if (!holdsContent(el)) continue;
    const id = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}` +
      (typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : '');
    out.push(`${id} clips ${el.scrollHeight - el.clientHeight}px of content`);
  }
  return out;
}
