/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-draw', title:'Draw SVG Stroke', cat:'SVG',
  tags:['svg','stroke','draw','línea','trazo','drawsvg','gsap'],
  desc:'Un trazo se dibuja solo, como con DrawSVGPlugin de GSAP. Para logos, firmas e ilustraciones lineales.',
  meta:['SVG','stroke-dashoffset','getTotalLength'],
  prompt:`Anima un trazo SVG que se "dibuja" solo (técnica de DrawSVG de GSAP, sin plugin).
Pon stroke-dasharray = longitud del path (getTotalLength()) y anima stroke-dashoffset de longitud->0.
Hazlo con @keyframes CSS o con JS al entrar en viewport. Úsalo para logos, firmas o iconos lineales que aparecen.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="0 0 200 120" width="78%" style="overflow:visible"><path id="dp" d="M20 90 C 50 10, 90 10, 100 60 S 160 110, 185 30" fill="none" stroke="#7b5cff" stroke-width="4" stroke-linecap="round"/></svg>';
    el.appendChild(s);const p=s.querySelector('#dp');const L=p.getTotalLength();p.style.strokeDasharray=L;
    let t=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;t+=dir*.012;if(t>=1.25)dir=-1;if(t<=-.25)dir=1;const k=Math.max(0,Math.min(1,t));p.style.strokeDashoffset=L*(1-k);p.setAttribute('stroke',k>=1?'#00e0c6':'#7b5cff');raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
