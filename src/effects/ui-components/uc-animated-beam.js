/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-animated-beam', title:'Animated Beam', cat:'UI Components',
  tags:['beam','haz','connect','svg','gradient','nodes','flow'],
  desc:'Un haz con gradiente luminoso viaja a lo largo de una curva SVG conectando dos nodos en bucle.',
  meta:['SVG path','linearGradient','CSS animation'],
  prompt:`Crea un "Animated Beam" estilo Magic UI: un haz de luz que recorre una curva conectando dos nodos.
Elementos: dos nodos (círculos/cajas) en los extremos y un <svg> con un <path> curvo (curva Bézier) que los une. El path base es tenue (gris). Encima, otro path idéntico pintado con stroke="url(#grad)" donde el gradiente lineal es transparente -> acento -> transparente.
Técnica del haz: usa stroke-dasharray y stroke-dashoffset animados para que un segmento corto y brillante viaje de un nodo a otro a lo largo del trazo (dasharray = [largo del haz, largo total]; anima dashoffset de total a 0). Alternativa: animar las coordenadas del linearGradient.
Animación: el haz viaja del nodo A al B continuamente. Los nodos pulsan suavemente. Colores acento #7b5cff y secundario #00e0c6.
Timings: viaje del haz ~2s linear infinite; pulso de nodos ~2s ease-in-out.`,
  code:`<div class="beam">
  <svg viewBox="0 0 240 120" width="240" height="120">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7b5cff" stop-opacity="0"/>
        <stop offset=".5" stop-color="#00e0c6"/>
        <stop offset="1" stop-color="#7b5cff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="M30 60 C100 10,140 110,210 60" stroke="#2a2a3a" stroke-width="2" fill="none"/>
    <path d="M30 60 C100 10,140 110,210 60" stroke="url(#bg)" stroke-width="3" fill="none"
      stroke-linecap="round" stroke-dasharray="40 260" class="ray"/>
  </svg>
</div>
<style>
.ray{animation:beamMove 2s linear infinite}
@keyframes beamMove{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes ucabMove{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}'
      +'@keyframes ucabPulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.18);opacity:1}}'
      +'.ucab{position:relative;width:240px;height:120px}'
      +'.ucab svg{position:absolute;inset:0}'
      +'.ucab .ray{animation:ucabMove 2s linear infinite}'
      +'.ucab .node{position:absolute;top:50%;width:34px;height:34px;margin-top:-17px;border-radius:50%;background:#12121c;border:1px solid rgba(255,255,255,.1);display:grid;place-items:center;font:600 13px system-ui;color:#e8e8f0;transform-origin:center}'
      +'.ucab .a{left:14px;color:#7b5cff;animation:ucabPulse 2s ease-in-out infinite}'
      +'.ucab .b{right:14px;color:#00e0c6;animation:ucabPulse 2s ease-in-out infinite;animation-delay:1s}'
      +'</style>'
      +'<div class="ucab">'
      +'<svg viewBox="0 0 240 120" width="240" height="120">'
      +'<defs><linearGradient id="ucabGrad" x1="0" y1="0" x2="1" y2="0">'
      +'<stop offset="0" stop-color="#7b5cff" stop-opacity="0"/>'
      +'<stop offset=".5" stop-color="#00e0c6"/>'
      +'<stop offset="1" stop-color="#7b5cff" stop-opacity="0"/></linearGradient></defs>'
      +'<path d="M40 60 C105 12,135 108,200 60" stroke="#2a2a3a" stroke-width="2" fill="none"/>'
      +'<path d="M40 60 C105 12,135 108,200 60" stroke="url(#ucabGrad)" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="40 260" class="ray"/>'
      +'</svg>'
      +'<div class="node a">A</div><div class="node b">B</div>'
      +'</div>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
