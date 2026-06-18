/** @type {import('../types.js').Effect} */
const effect = {
  id:'magnetic-btn', title:'Magnetic Button', cat:'Hover & UI',
  tags:['botón','magnético','hover','cta','microinteracción','cursor'],
  desc:'El botón se inclina hacia el cursor antes de pulsarlo. Pasa el ratón por la preview.',
  meta:['Transform','Lerp','CTA'],
  prompt:`Botón magnético para CTAs.
En mousemove dentro del botón, calcula el offset del cursor respecto al centro y mueve el botón una fracción (~0.3) con lerp.
En mouseleave vuelve a 0 con transición elástica. Usa transform:translate, nada de left/top. Mantén :focus-visible claro.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<button id="mb" style="background:linear-gradient(90deg,#7b5cff,#5a3fd6);color:#fff;border:none;padding:15px 30px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;transition:transform .25s cubic-bezier(.2,.8,.2,1);box-shadow:0 10px 30px -8px #7b5cff">Empezar gratis →</button>';
    el.appendChild(s);const b=s.querySelector('#mb');let a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const r=b.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);b.style.transform='translate('+dx*.35+'px,'+dy*.35+'px) scale(1.05)';};
    el.onmouseleave=()=>{hover=false;b.style.transform='none';};
    (function loop(){if(!run)return;if(!hover){a+=.03;b.style.transform='translate('+Math.cos(a)*10+'px,'+Math.sin(a*1.4)*6+'px)';}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
