/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-vanish-in', title:'Vanish In', cat:'CSS Moderno',
  tags:['css','entrada','vanish','blur','fade','aparecer','0 js'],
  desc:'Entrada en la que el elemento se materializa desde un desenfoque fuerte hasta quedar nítido.',
  meta:['filter:blur','opacity','0 JS'],
  prompt:`Crea una animación de entrada "vanish in" solo con CSS.
El elemento empieza con filter:blur(20px) y opacity:0, también puede escalar ligeramente desde scale(1.05), y termina en blur(0), opacity:1 y scale(1).
Define @keyframes vanishIn con 0% { filter:blur(20px); opacity:0 } y 100% { filter:blur(0); opacity:1 }.
Aplica animation: vanishIn .6s cubic-bezier(.39,.575,.565,1) both. Sin JS.`,
  code:`/* Vanish In: blur(20px) a 0 con fade */
.vanish-in {
  animation: vanishIn 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
@keyframes vanishIn {
  0%   { filter: blur(20px); opacity: 0; transform: scale(1.05); }
  100% { filter: blur(0px);  opacity: 1; transform: scale(1); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amVanishIn{0%{filter:blur(20px);opacity:0;transform:scale(1.05)}100%{filter:blur(0);opacity:1;transform:scale(1)}}</style><div style="padding:18px 28px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#07070d;font:700 20px/1 system-ui,sans-serif;letter-spacing:.5px;will-change:transform,filter;animation:amVanishIn 1.8s cubic-bezier(.39,.575,.565,1) infinite">Vanish In</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
