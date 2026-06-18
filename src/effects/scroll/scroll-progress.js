/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-progress', title:'Reading Progress', cat:'Scroll',
  tags:['progreso','scroll','barra','indicador','ui','header'],
  desc:'Indicador de progreso de lectura que se rellena con gradiente. Imprescindible en artículos y docs.',
  meta:['Scroll %','CSS var','Minimal'],
  prompt:`Barra de progreso de lectura fija arriba.
porcentaje = scrollTop / (scrollHeight - innerHeight); pásalo a una CSS var --p y úsala para el width (o scaleX).
Rellena con gradiente de marca y leve glow. Throttle con rAF. Bonus: cambia de acento al llegar al 100%.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;gap:18px';
    s.innerHTML='<div style="width:78%;height:8px;background:#16162a;border-radius:99px;overflow:hidden"><div id="pb" style="height:100%;width:0;background:linear-gradient(90deg,#7b5cff,#00e0c6);border-radius:99px;box-shadow:0 0 12px #7b5cff"></div></div><div id="pt" style="font-size:13px;color:#8a8ca3;font-family:monospace">0%</div>';
    el.appendChild(s);const pb=s.querySelector('#pb'),pt=s.querySelector('#pt');let p=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;p+=dir*.7;if(p>=100){p=100;dir=-1;}if(p<=0){p=0;dir=1;}pb.style.width=p+'%';pt.textContent=Math.round(p)+'%';pt.style.color=p>=99?'#00e0c6':'#8a8ca3';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
