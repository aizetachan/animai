/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-boing-in', title:'Boing In', cat:'CSS Moderno',
  tags:['css','entrada','boing','escala','elastico','overshoot','0 js'],
  desc:'Entrada elástica: el elemento crece con un rebote de overshoot antes de asentarse en su tamaño.',
  meta:['transform:scale','cubic-bezier','0 JS'],
  prompt:`Crea una animación de entrada "boing in" elástica solo con CSS.
El elemento parte de scale(0) con opacity:0 y crece pasándose de tamaño (overshoot) antes de volver a scale(1).
Define @keyframes boingIn con pasos: 0% { transform:scale(0); opacity:0 } 55% { transform:scale(1.18) } 75% { transform:scale(.92) } 90% { transform:scale(1.05) } 100% { transform:scale(1); opacity:1 }.
Aplica animation: boingIn .8s ease-out both. Sin JS.`,
  code:`/* Boing In: escala con overshoot elástico */
.boing-in {
  animation: boingIn 0.8s ease-out both;
}
@keyframes boingIn {
  0%   { transform: scale(0);    opacity: 0; }
  55%  { transform: scale(1.18); opacity: 1; }
  75%  { transform: scale(0.92); }
  90%  { transform: scale(1.05); }
  100% { transform: scale(1);    opacity: 1; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amBoingIn{0%{transform:scale(0);opacity:0}55%{transform:scale(1.18);opacity:1}75%{transform:scale(.92)}90%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}</style><div style="padding:18px 28px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#07070d;font:700 20px/1 system-ui,sans-serif;letter-spacing:.5px;will-change:transform;animation:amBoingIn 1.8s ease-out infinite">Boing In</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
