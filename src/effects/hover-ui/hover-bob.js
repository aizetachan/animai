/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-bob', title:'Bob Float', cat:'Hover & UI',
  tags:['bob','hover.css','flotar','arriba','abajo','icono','idle'],
  desc:'El elemento sube y baja suavemente como flotando. El "bob" de Hover.css para iconos juguetones.',
  meta:['translateY','@keyframes','Idle'],
  prompt:`Recrea el efecto "Bob" de Hover.css: el elemento se mueve arriba y abajo suavemente en bucle (translateY) como flotando en agua.
Primero un pequeño salto y luego oscilación infinita. Ideal para iconos, mascotas o badges que quieres que se sientan vivos sin ser intrusivos.`,
  code:`/* Hover.css — Bob */
@keyframes bob {
  0% { transform: translateY(-6px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(-6px); }
}
.hvr-bob:hover { animation: bob 1.2s ease-in-out infinite; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes bobf{0%{transform:translateY(-8px)}50%{transform:translateY(4px)}100%{transform:translateY(-8px)}}</style><div style="width:58px;height:58px;border-radius:16px;background:linear-gradient(135deg,#ff5ca8,#7b5cff);display:grid;place-items:center;color:#fff;font-size:26px;animation:bobf 1.6s ease-in-out infinite">🎈</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
