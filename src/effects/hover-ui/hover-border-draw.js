/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-border-draw', title:'Border Draw Hover', cat:'Hover & UI',
  tags:['border','draw','dibujar','perímetro','svg','stroke','botón'],
  desc:'El borde se dibuja recorriendo el perímetro al hover. Trazo SVG limpio, no glow girando.',
  meta:['SVG','stroke-dashoffset','Hover'],
  prompt:`Crea un botón cuyo borde se dibuja al hover: un rect SVG con stroke-dasharray igual a su perímetro y dashoffset animado de full a 0, de modo que la línea recorre el contorno como si se trazara.
A diferencia del glow girando, aquí es un trazo nítido que "escribe" el marco. Doble trazo (dos esquinas opuestas a la vez) para un acabado más rápido.
Para CTAs minimalistas y elegantes.`,
  code:`/* Border draw — SVG rect con dashoffset animado */
.btn rect {
  stroke-dasharray: 400;          /* ~perímetro */
  stroke-dashoffset: 400;
  transition: stroke-dashoffset 0.6s ease;
}
.btn:hover rect { stroke-dashoffset: 0; }   /* dibuja el marco */`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div style="position:relative;padding:14px 30px"><svg style="position:absolute;inset:0;width:100%;height:100%" preserveAspectRatio="none"><rect id="brd" x="1" y="1" width="98%" height="92%" rx="12" fill="none" stroke="#7b5cff" stroke-width="2"/></svg><span style="position:relative;color:#eef0f7;font-weight:700">Explorar</span></div>';
    el.appendChild(s);const rect=s.querySelector('#brd');const L=rect.getTotalLength?rect.getTotalLength():400;rect.style.strokeDasharray=L;
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.01;const p=(Math.sin(t)*.5+.5);rect.style.strokeDashoffset=L*(1-p);raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
