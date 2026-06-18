/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-mask-wipe', title:'Mask Wipe Reveal', cat:'SVG',
  tags:['svg','mask','máscara','wipe','reveal','revelado','barrido'],
  desc:'Revelado de contenido con una máscara SVG que barre la superficie de lado a lado.',
  meta:['SVG','mask','clip wipe'],
  prompt:`Revela contenido usando una <mask> SVG que barre.
Define un <mask> con un rectángulo blanco (visible) cuyo borde (x o ancho) se anima para descubrir progresivamente el contenido enmascarado.
Aplica mask="url(#m)" al grupo de contenido. Anima el ancho del rect de 0 al total (wipe lineal) o usa un borde inclinado/gradiente blanco-negro para un barrido suave. Útil para reveals de imágenes, texto y secciones.`,
  code:`// Mask wipe: anima el ancho del rect blanco de la máscara
const W = 200
function loop(p){ // p en [0..1]
  maskRect.setAttribute('width', W * p)
}
// SVG:
// <mask id="m"><rect x="0" y="0" width="0" height="120" fill="#fff"/></mask>
// <g mask="url(#m)">...contenido...</g>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML=`<svg viewBox="0 0 200 120" width="86%" style="overflow:visible">
      <defs>
        <linearGradient id="mwg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0c6"/>
        </linearGradient>
        <mask id="mwm"><rect id="mwr" x="0" y="0" width="0" height="120" fill="#fff"/></mask>
      </defs>
      <rect x="10" y="20" width="180" height="80" rx="12" fill="#161622"/>
      <g mask="url(#mwm)">
        <rect x="10" y="20" width="180" height="80" rx="12" fill="url(#mwg)"/>
        <text x="100" y="68" text-anchor="middle" font-size="26" font-weight="800" fill="#0a0a14" font-family="system-ui,sans-serif">REVEAL</text>
      </g>
    </svg>`;
    el.appendChild(s);
    const r=s.querySelector('#mwr');
    let t=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;t+=dir*.012;if(t>=1.25)dir=-1;if(t<=-.25)dir=1;
      const k=Math.max(0,Math.min(1,t));const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
      r.setAttribute('width',(200*e).toFixed(2));
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
