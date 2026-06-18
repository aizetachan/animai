/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-pulse', title:'Pulse', cat:'Hover & UI',
  tags:['pulse','hover.css','latido','escala','botón','atención'],
  desc:'Latido continuo que escala el elemento en bucle. Clásico de Hover.css para llamar la atención.',
  meta:['Hover.css','@keyframes','Loop'],
  prompt:`Recrea el efecto "Pulse" de Hover.css: el elemento late escalando suavemente en bucle (scale 1 -> 1.1 -> 1) con @keyframes infinite.
Útil para iconos de notificación o CTAs que deben atraer la mirada. En Hover.css se activa al hover; puedes dejarlo siempre activo para un badge "live".`,
  code:`/* Hover.css — Pulse */
@keyframes pulse {
  25% { transform: scale(1.1); }
  75% { transform: scale(0.9); }
}
.hvr-pulse:hover { animation: pulse 1s linear infinite; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes plz{25%{transform:scale(1.12)}75%{transform:scale(.92)}}</style><div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#7b5cff,#5a3fd6);display:grid;place-items:center;color:#fff;font-size:24px;animation:plz 1s linear infinite">♥</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
