/** @type {import('../types.js').Effect} */
const effect = {
  id:'sticky-scale', title:'Sticky Scale-Up', cat:'Scroll',
  tags:['sticky','scroll','zoom','escala','pin','apple','scrolltrigger'],
  desc:'Un elemento queda fijo (pin) y escala mientras scrolleas. El "zoom de Apple" (pin de ScrollTrigger).',
  meta:['position:sticky','scroll %','Cinematic'],
  prompt:`Recrea el "zoom de Apple": contenedor alto con un media sticky dentro (o usa ScrollTrigger con pin).
Mientras se scrollea, calcula progreso 0->1 y aplica scale() y border-radius interpolados (de pequeño-redondeado a fullbleed).
Añade crossfade de texto sincronizado en los últimos %.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div id="zo" style="width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);display:grid;place-items:center;color:#fff;font-weight:800;font-size:11px;overflow:hidden">ZOOM</div>';
    el.appendChild(s);const zo=s.querySelector('#zo');let p=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;p+=dir*.008;if(p>=1){p=1;dir=-1;}if(p<=0){p=0;dir=1;}const sz=50+p*150,rad=14*(1-p*.85);zo.style.width=zo.style.height=sz+'px';zo.style.borderRadius=rad+'px';zo.style.fontSize=(11+p*9)+'px';zo.style.margin=(-(sz-50)/2)+'px 0';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
