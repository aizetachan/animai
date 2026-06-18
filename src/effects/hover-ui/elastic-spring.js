/** @type {import('../types.js').Effect} */
const effect = {
  id:'elastic-spring', title:'Spring Pop', cat:'Hover & UI',
  tags:['spring','elastic','físicas','pop','bounce','microinteracción'],
  desc:'Elementos que aparecen con rebote elástico tipo muelle. Da carácter físico a las microinteracciones.',
  meta:['cubic-bezier','spring','Pop'],
  prompt:`Microinteracción "spring/pop" con físicas de muelle.
En CSS, una cubic-bezier con overshoot (p.ej. cubic-bezier(.34,1.56,.64,1)) sobre transform:scale para que el elemento sobrepase y vuelva.
Para muelle real usa linear() easing (soportado en navegadores 2026) o una librería como Motion/React Spring. Úsalo en aparición de toasts, badges, botones de like.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:flex;gap:14px;align-items:center;justify-content:center';
    el.appendChild(s);let to,run=true;
    (function go(){s.innerHTML='';['❤','★','✓'].forEach((g,i)=>{const d=document.createElement('div');d.textContent=g;d.style.cssText='width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#5a3fd6);display:grid;place-items:center;color:#fff;font-size:22px;transform:scale(0);transition:transform .6s cubic-bezier(.34,1.56,.64,1);transition-delay:'+(i*.12)+'s';s.appendChild(d);});
      requestAnimationFrame(()=>requestAnimationFrame(()=>{[...s.children].forEach(c=>c.style.transform='scale(1)');}));if(run)to=setTimeout(go,2200);})();
    return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
