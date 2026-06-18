/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-scroll-driven', title:'Scroll-Driven (CSS)', cat:'CSS Moderno',
  tags:['css','scroll','animation-timeline','view','nativo','2026','reveal'],
  desc:'Reveal al hacer scroll SIN JavaScript, con animation-timeline:view() nativo. La gran novedad CSS de 2026.',
  meta:['animation-timeline','view()','0 JS'],
  prompt:`Anima elementos al entrar en viewport SIN JavaScript usando scroll-driven animations nativas de CSS (2026).
Define @keyframes (opacity/translateY) y aplica animation con animation-timeline: view() y animation-range: entry 0% cover 30%.
El navegador liga el progreso de la animación a la posición de scroll del elemento. Adiós IntersectionObserver para reveals simples. Degrada con @supports.`,
  code:`/* CSS puro — scroll-driven, sin JS (Chrome/Edge/Safari 2026) */
@keyframes reveal {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 35%;
}
/* Fallback si el navegador no lo soporta */
@supports not (animation-timeline: view()) {
  .card { opacity: 1; transform: none; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='overflow:hidden;padding:14px;display:flex;flex-direction:column;gap:10px;justify-content:center';
    el.appendChild(s);let to,run=true;
    (function go(){s.innerHTML='';for(let i=0;i<4;i++){const d=document.createElement('div');d.style.cssText='height:24px;border-radius:7px;background:linear-gradient(90deg,#7b5cff,#00e0c6);opacity:0;transform:translateY(34px);transition:.7s cubic-bezier(.2,.8,.2,1);transition-delay:'+(i*.13)+'s;width:'+(55+i*12)+'%';s.appendChild(d);}
      requestAnimationFrame(()=>requestAnimationFrame(()=>{[...s.children].forEach(c=>{c.style.opacity=1;c.style.transform='none';});}));if(run)to=setTimeout(go,2800);})();
    return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
