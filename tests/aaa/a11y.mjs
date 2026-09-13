import { chromium } from '@playwright/test';
import { BASE, PAGES } from './pages.mjs';
import { AUDIT } from './audit.mjs';
const b=await chromium.launch(); let n=0; let unmeasured=0; const fails=[];
for(const scheme of ['light','dark']){
  const ctx=await b.newContext({colorScheme:scheme});const p=await ctx.newPage();
  await p.setViewportSize({width:1280,height:900});
  for(const path of PAGES){
    await p.goto(BASE+path,{waitUntil:'domcontentloaded'});
    const r=await p.evaluate(AUDIT); n++;
    unmeasured += r._unmeasured.length; delete r._unmeasured;
    for(const k of Object.keys(r)) r[k].forEach(m=>fails.push(`${scheme} ${path} [${k}] ${m}`));
  }
  await ctx.close();
}
await b.close();
console.log(`a11y: ${n} page renders audited (${PAGES.length} pages x 2 colour schemes)`);
// Not a pass and not a failure: text on a background-image cannot be reduced
// to a single ground here. contrast.py checks those stops against the tokens.
if(unmeasured) console.log(`note: ${unmeasured} text runs sit on a background-image and were not measured here`);
if(fails.length){console.log(`FAIL ${fails.length}:`);(process.env.AAA_ALL?fails:fails.slice(0,20)).forEach(f=>console.log('  '+f));process.exit(1)}
console.log('PASS — AAA contrast, 44px targets, heading order, landmarks, names');
