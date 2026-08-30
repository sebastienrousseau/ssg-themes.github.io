import { chromium } from '@playwright/test';
const BASE='http://127.0.0.1:8732';
const PAGES=['/lucid/','/lucid/installation/','/lucid/configuration/','/lucid/accessibility/',
  '/lucid/fr/','/lucid/fr/installation/','/lucid/fr/configuration/','/lucid/fr/accessibilite/'];
const AUDIT = () => {
  const lum=c=>{const m=c.match(/[\d.]+/g).map(Number);const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(m[0])+0.7152*f(m[1])+0.0722*f(m[2])};
  const ratio=(a,b)=>{const s=[lum(a),lum(b)].sort((p,q)=>q-p);return (s[0]+0.05)/(s[1]+0.05)};
  const bg=el=>{let e=el;while(e){const c=getComputedStyle(e).backgroundColor;if(c&&!/rgba\(0, 0, 0, 0\)|transparent/.test(c))return c;e=e.parentElement}return 'rgb(255,255,255)'};
  const skip=e=>e.closest('#ssg-search-widget');
  const out={contrast:[],targets:[],headings:[],misc:[]};
  for(const e of document.querySelectorAll('body *')){
    if(skip(e)||!e.offsetParent&&getComputedStyle(e).position!=='fixed')continue;
    if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1))continue;
    const cs=getComputedStyle(e);const r=ratio(cs.color,bg(e));
    const px=parseFloat(cs.fontSize),bold=parseInt(cs.fontWeight)>=700;
    const need=(px>=24||(px>=18.66&&bold))?4.5:7;
    if(r<need-0.005)out.contrast.push(`${e.tagName}.${(''+e.className).slice(0,20)} "${e.textContent.trim().slice(0,20)}" ${r.toFixed(2)}<${need}`);
  }
  // WCAG 2.5.5 Target Size (Enhanced) exempts a target that sits "in a
  // sentence or block of text". A link inside a prose paragraph, list item
  // or table cell is exactly that, and enlarging it would break the line
  // box it lives in. Navigation links are not exempt and are still checked.
  const inlineExempt = e => {
    const p = e.parentElement;
    return !!(p && e.closest('.prose') && ['P','LI','TD','TH'].includes(p.tagName));
  };
  for(const e of document.querySelectorAll('a,button,input,select,[tabindex]:not([tabindex="-1"])')){
    if(skip(e)||!e.offsetParent||inlineExempt(e))continue;const b=e.getBoundingClientRect();
    if(b.width<44||b.height<44)out.targets.push(`${e.tagName} "${(e.textContent||'').trim().slice(0,20)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
  }
  // 1.4.8 Visual Presentation (AAA): paragraph spacing at least 1.5x the
  // line spacing. Declared spacing is not enough — a wrapper element the
  // generator introduces can leave the rule matching nothing, which is
  // exactly what happened once.
  const paras=[...document.querySelectorAll('.prose p')];
  for(const p of paras){
    const prev=p.previousElementSibling;
    if(!prev||!['P','UL','OL','PRE','TABLE','BLOCKQUOTE'].includes(prev.tagName))continue;
    const lh=parseFloat(getComputedStyle(p).lineHeight);
    const gap=p.getBoundingClientRect().top-prev.getBoundingClientRect().bottom;
    if(gap+0.5<lh*1.5)out.misc.push(`paragraph gap ${gap.toFixed(1)}px < ${(lh*1.5).toFixed(1)}px (1.4.8)`);
  }
  const hs=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>+h.tagName[1]);
  for(let i=1;i<hs.length;i++) if(hs[i]-hs[i-1]>1) out.headings.push(`skip h${hs[i-1]}->h${hs[i]}`);
  if(document.querySelectorAll('h1').length!==1)out.misc.push('h1 count '+document.querySelectorAll('h1').length);
  if(!document.documentElement.lang)out.misc.push('no html lang');
  if(!document.querySelector('main'))out.misc.push('no main landmark');
  if(!document.querySelector('.skip-link'))out.misc.push('no skip link');
  for(const i of document.images) if(!skip(i)&&!i.hasAttribute('alt')) out.misc.push('img without alt');
  for(const a of document.querySelectorAll('a')) if(!skip(a)&&!a.textContent.trim()&&!a.getAttribute('aria-label')) out.misc.push('link with no accessible name');
  return out;
};
const b=await chromium.launch(); let n=0; const fails=[];
for(const scheme of ['light','dark']){
  const ctx=await b.newContext({colorScheme:scheme});const p=await ctx.newPage();
  await p.setViewportSize({width:1280,height:900});
  for(const path of PAGES){
    await p.goto(BASE+path,{waitUntil:'domcontentloaded'});
    const r=await p.evaluate(AUDIT); n++;
    for(const k of Object.keys(r)) r[k].forEach(m=>fails.push(`${scheme} ${path} [${k}] ${m}`));
  }
  await ctx.close();
}
await b.close();
console.log(`a11y: ${n} page renders audited (8 pages x 2 colour schemes)`);
if(fails.length){console.log(`FAIL ${fails.length}:`);fails.slice(0,20).forEach(f=>console.log('  '+f));process.exit(1)}
console.log('PASS — AAA contrast, 44px targets, heading order, landmarks, names');
