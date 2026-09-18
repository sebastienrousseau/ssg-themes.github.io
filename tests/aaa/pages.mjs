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
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
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
  return pages;
})();
