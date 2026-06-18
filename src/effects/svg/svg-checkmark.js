/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-checkmark', title:'Animated Checkmark', cat:'SVG',
  tags:['svg','check','éxito','success','draw','tick','confirmación'],
  desc:'Un check de éxito que se dibuja dentro de un círculo. El feedback de "completado" universal.',
  meta:['SVG','stroke-dashoffset','Éxito'],
  prompt:`Crea un checkmark de éxito animado en SVG: primero el círculo se dibuja (stroke-dashoffset) y luego el tick aparece dibujándose dentro, con un pequeño pop final.
Usa getTotalLength() en cada path y anima dashoffset de L a 0, el tick con un pequeño retardo respecto al círculo.
Para confirmaciones (pago ok, formulario enviado, tarea completada). Verde de éxito.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="0 0 100 100" width="40%"><circle id="cc" cx="50" cy="50" r="42" fill="none" stroke="#00e0c6" stroke-width="5"/><path id="tk" d="M30 52 L45 67 L72 36" fill="none" stroke="#00e0c6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    el.appendChild(s);const cc=s.querySelector('#cc'),tk=s.querySelector('#tk');const Lc=cc.getTotalLength(),Lt=tk.getTotalLength();cc.style.strokeDasharray=Lc;tk.style.strokeDasharray=Lt;
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.012;const p=t%2;const kc=Math.min(1,p*1.5),kt=Math.max(0,Math.min(1,(p-.7)*2));cc.style.strokeDashoffset=Lc*(1-kc);tk.style.strokeDashoffset=Lt*(1-kt);const sc=kt>=1?1+Math.sin((p-1.2)*6)*.04:1;s.querySelector('svg').style.transform='scale('+(p>1.2&&p<1.5?sc:1)+')';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
