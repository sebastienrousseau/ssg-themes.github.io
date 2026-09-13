/* The page audit itself, evaluated inside the browser.
 *
 * It lives apart from the runner so selftest.mjs can drive it over
 * fixtures whose correct answers are known. A gate that has never been
 * checked against a known answer is not evidence of anything: this one
 * once read `color(srgb 1 1 1 / 0.82)` as near-black and reported a
 * 16.8:1 header as 1.24:1. */
export const AUDIT = () => {
  /* Colour handling.
   *
   * The naive version of this read every colour with /[\d.]+/ and treated the
   * numbers as 0-255. CSS Color 4 broke that: `color(srgb 1 1 1 / 0.82)` came
   * back as [1,1,1], so pure white was measured as near-black and a perfectly
   * legible header was reported at 1.24:1. It also stopped at the first
   * non-transparent background, which is wrong whenever that layer is
   * translucent - what the eye sees is the composite.
   *
   * So: parse to gamma-encoded sRGB, composite alpha the way the browser does
   * (in gamma space, source-over), and only then linearise for WCAG. */
  const toLin=v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);
  const toGam=v=>v<=0.0031308?v*12.92:1.055*Math.pow(v,1/2.4)-0.055;
  const clamp=v=>Math.min(1,Math.max(0,v));
  const parse=c=>{
    if(!c||c==='transparent')return{r:0,g:0,b:0,a:0};
    const fn=c.match(/^color\(\s*([\w-]+)\s+([^)]*)\)/);
    if(fn){
      const v=(fn[2].match(/-?[\d.]+/g)||[]).map(Number);
      const a=v.length>3?v[3]:1;
      if(fn[1]==='display-p3'){
        // linear P3 -> linear sRGB (D65), then re-encode; out-of-gamut clamps.
        const R=toLin(v[0]),G=toLin(v[1]),B=toLin(v[2]);
        return{r:toGam(clamp( 1.2249401*R-0.2249401*G)),
               g:toGam(clamp(-0.0420569*R+1.0420569*G)),
               b:toGam(clamp(-0.0196376*R-0.0786361*G+1.0982736*B)),a};
      }
      return{r:clamp(v[0]),g:clamp(v[1]),b:clamp(v[2]),a};
    }
    const v=(c.match(/-?[\d.]+/g)||[]).map(Number);
    return{r:clamp(v[0]/255),g:clamp(v[1]/255),b:clamp(v[2]/255),a:v.length>3?v[3]:1};
  };
  const over=(f,b)=>{
    const a=f.a+b.a*(1-f.a);
    if(a===0)return{r:0,g:0,b:0,a:0};
    return{r:(f.r*f.a+b.r*b.a*(1-f.a))/a,
           g:(f.g*f.a+b.g*b.a*(1-f.a))/a,
           b:(f.b*f.a+b.b*b.a*(1-f.a))/a,a};
  };
  const lum=c=>0.2126*toLin(c.r)+0.7152*toLin(c.g)+0.0722*toLin(c.b);
  const ratio=(fg,ground)=>{
    const f=over(parse(fg),ground);
    const s=[lum(f),lum(ground)].sort((p,q)=>q-p);
    return (s[0]+0.05)/(s[1]+0.05);
  };
  /* Returns the composited opaque ground, or null when a background-image
   * intervenes - a gradient or photo cannot be reduced to one colour, and
   * guessing would be worse than saying so. Those are reported separately
   * rather than counted as passes. */
  const bg=el=>{
    let e=el,acc={r:0,g:0,b:0,a:0};
    while(e){
      const cs=getComputedStyle(e);
      if(cs.backgroundImage&&cs.backgroundImage!=='none')return null;
      acc=over(acc,parse(cs.backgroundColor));
      if(acc.a>=0.999)return acc;
      e=e.parentElement;
    }
    return over(acc,{r:1,g:1,b:1,a:1});
  };
  const skip=e=>e.closest('#ssg-search-widget');
  const out={contrast:[],targets:[],headings:[],misc:[]};const unmeasured=[];
  for(const e of document.querySelectorAll('body *')){
    if(skip(e)||!e.offsetParent&&getComputedStyle(e).position!=='fixed')continue;
    if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1))continue;
    const cs=getComputedStyle(e);const ground=bg(e);
    if(!ground){unmeasured.push(`${e.tagName}.${(''+e.className).slice(0,20)}`);continue}
    const r=ratio(cs.color,ground);
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
  /* A visually hidden input whose label is the visible control: the label is
   * what a finger lands on, so that is the target to measure. The exemption is
   * conditional on the label itself clearing 44x44 - it is not a way to hide a
   * small control behind a small label. */
  const labelIsTarget = e => {
    if(e.tagName!=='INPUT')return false;
    const lab=e.closest('label')||(e.id&&document.querySelector(`label[for="${CSS.escape(e.id)}"]`));
    if(!lab)return false;
    const r=lab.getBoundingClientRect();
    return r.width>=44&&r.height>=44;
  };
  for(const e of document.querySelectorAll('a,button,input,select,[tabindex]:not([tabindex="-1"])')){
    if(skip(e)||!e.offsetParent||inlineExempt(e)||labelIsTarget(e))continue;const b=e.getBoundingClientRect();
    if(b.width<44||b.height<44){
      // The class is what makes a failure actionable: 300 identical "17px tall"
      // lines across a site are usually one rule, and the name says which.
      const where=e.closest('[class]')?.className||'';
      out.targets.push(`${e.tagName}${e.className?'.'+(''+e.className).trim().split(/\s+/)[0]:''} "${(e.textContent||'').trim().slice(0,20)}" ${Math.round(b.width)}x${Math.round(b.height)} in ${(''+where).trim().split(/\s+/)[0]||'-'}`);
    }
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
  return {...out, _unmeasured: unmeasured};
};
