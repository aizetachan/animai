/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-infinity', title:'Infinity Loop', cat:'Loaders',
  tags:['css','loader','infinity','motion-path','infinito','0 js'],
  desc:'Un punto que recorre una trayectoria en forma de ∞ usando offset-path (motion path).',
  meta:['offset-path','offset-distance','0 JS'],
  prompt:`Crea un loader donde un punto recorre un símbolo de infinito.
Define un offset-path con un path SVG en forma de 8/∞ y anima offset-distance de 0% a 100% (loop). El punto deja una estela opcional con un segundo elemento desfasado. Dibuja la pista de fondo con el mismo path en un SVG tenue.`,
  code:`.inf { width:80px; height:40px; position:relative; }
.inf .dot {
  width:12px; height:12px; border-radius:50%; background:#7b5cff;
  offset-path: path('M 10 20 C 10 5, 35 5, 40 20 C 45 35, 70 35, 70 20 C 70 5, 45 5, 40 20 C 35 35, 10 35, 10 20 Z');
  animation: inf 1.6s linear infinite;
}
@keyframes inf { to { offset-distance: 100%; } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const p="M 12 24 C 12 6, 40 6, 48 24 C 56 42, 84 42, 84 24 C 84 6, 56 6, 48 24 C 40 42, 12 42, 12 24 Z";
    s.innerHTML=`<style>@keyframes ldInf{to{offset-distance:100%}}</style>`+
      `<div style="width:96px;height:48px;position:relative">`+
      `<svg width="96" height="48" style="position:absolute;inset:0"><path d="${p}" fill="none" stroke="rgba(123,92,255,.2)" stroke-width="3"/></svg>`+
      `<div style="position:absolute;width:13px;height:13px;margin:-6.5px;border-radius:50%;background:#7b5cff;box-shadow:0 0 10px #7b5cff;offset-path:path('${p}');animation:ldInf 1.6s linear infinite"></div>`+
      `<div style="position:absolute;width:13px;height:13px;margin:-6.5px;border-radius:50%;background:#00e0c6;offset-path:path('${p}');animation:ldInf 1.6s linear infinite;animation-delay:-.2s;opacity:.5"></div>`+
      `</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
