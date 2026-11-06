/* The page set every browser gate runs against.
 *
 * This is discovered from the built site rather than listed by hand. The
 * hand-written list this replaces named three themes; six others - including
 * the two that later turned out to have real contrast defects - were never
 * visited, and the suites reported success for them because they had never
 * looked. A gate that cannot see something must not report that it passed.
 *
 * Discovery alone would fail the same way against an empty directory: zero
 * pages means zero failures. So the floors below turn "found nothing" into a
 * hard error, and every theme shipped in themes/ must contribute a page. */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const BASE = process.env.BASE || 'http://127.0.0.1:8732';

const ROOT = 'public';
const MIN_PAGES = 90;

function walk(dir, out = []) {
  // Directory entries carry their type, so no separate stat precedes the
  // read below (a stat-then-read pair can see two different files).
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    const entry = dirent.name;
    const full = join(dir, entry);
    if (dirent.isDirectory()) walk(full, out);
    else if (entry === '404.html') {
      // Not reachable by walking directories: a 404 page has no index.html.
      // Written by scripts/publish_404.py after the build, one per theme and
      // per locale, plus the gallery's own.
      const rel = relative(ROOT, dir).split(sep).join('/');
      out.push(rel === '' ? '/404.html' : `/${rel}/404.html`);
    }
    else if (entry === 'index.html') {
      // Redirect stubs are not pages: they carry no content to audit, and
      // navigating one tears down the execution context mid-evaluate.
      if (/http-equiv=["']?refresh/i.test(readFileSync(full, 'utf8'))) continue;
      const rel = relative(ROOT, dir).split(sep).join('/');
      out.push(rel === '' ? '/' : `/${rel}/`);
    }
  }
  return out;
}

export const PAGES = (() => {
  if (!existsSync(ROOT)) throw new Error(`${ROOT}/ is missing - run "make build" first`);
  const pages = walk(ROOT).sort();
  if (pages.length < MIN_PAGES) {
    throw new Error(`only ${pages.length} pages found under ${ROOT}/, expected at least ${MIN_PAGES} - the build is incomplete`);
  }
  const themes = readdirSync('themes').filter((t) => statSync(join('themes', t)).isDirectory());
  const seen = new Set(pages.map((p) => p.split('/')[1]));
  const missing = themes.filter((t) => !seen.has(t));
  if (missing.length) {
    throw new Error(`themes built but never visited by the gate: ${missing.join(', ')}`);
  }
  // Optional explicit filter for targeted local runs, as a comma list of
  // page paths (AAA_FILTER=/,/fr/,/apex/). It narrows the set before the
  // slice below, so batches still split the filtered pages rather than
  // each re-running all of them. It refuses to run in CI, and every entry
  // must name a discovered page: a typo would otherwise select nothing and
  // the suites would report a pass over zero pages.
  let selected = pages;
  const filter = process.env.AAA_FILTER;
  if (filter) {
    if (process.env.CI) throw new Error('AAA_FILTER is for local runs; CI must measure every page');
    const wanted = filter.split(',').map((s) => s.trim()).filter(Boolean);
    const known = new Set(pages);
    const unknown = wanted.filter((p) => !known.has(p));
    if (unknown.length || !wanted.length) {
      throw new Error(`AAA_FILTER names no discovered page: ${unknown.join(', ') || '(empty)'}`);
    }
    selected = pages.filter((p) => wanted.includes(p));
  }
  // Optional slice, as "index/total": the runner uses it to restart the
  // browser between groups of pages. A long-lived Chromium grows past what
  // a memory-pressured machine has free and the OS kills it, and a gate
  // killed partway reports nothing at all rather than a failure. Every
  // check above runs against the whole discovered set first, so slicing
  // cannot weaken the floor or let an unvisited theme through.
  const slice = process.env.AAA_SLICE;
  if (!slice) return selected;
  const [i, n] = slice.split('/').map(Number);
  if (!Number.isInteger(i) || !Number.isInteger(n) || n < 1 || i < 0 || i >= n) {
    throw new Error(`AAA_SLICE must be "index/total" with 0 <= index < total, got "${slice}"`);
  }
  const size = Math.ceil(selected.length / n);
  return selected.slice(i * size, (i + 1) * size);
})();
