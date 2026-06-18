/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-swirl-in', title:'Swirl In', cat:'CSS Moderno',
  tags:['css','entrada','rotate','spin','scale','swirl','remolino'],
  desc:'Entrada en remolino: el elemento gira 540 grados mientras crece desde cero hasta su tamano final.',
  meta:['@keyframes','0 JS'],
  prompt:`Crea una animacion de entrada "Swirl In" (remolino).
El elemento parte de scale(0) rotate(-540deg) opacity 0 y termina en scale(1) rotate(0) opacity 1.
Define @keyframes de 0% a 100% interpolando la rotacion completa (giro y medio) y la escala.
Usa transform-origin:center, duracion ~0.8s, easing cubic-bezier(.2,.7,.3,1). Solo CSS.`,
  code:`/* Swirl In - entrada con giro de 540deg */
.swirl {
  animation: am-swirl 0.8s cubic-bezier(.2,.7,.3,1) both;
  transform-origin: center center;
}
@keyframes am-swirl {
  0%   { transform: rotate(-540deg) scale(0); opacity: 0; }
  100% { transform: rotate(0deg) scale(1); opacity: 1; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amSwirl{0%{transform:rotate(-540deg) scale(0);opacity:0}100%{transform:rotate(0) scale(1);opacity:1}}</style><div id="amSwirlEl" style="width:88px;height:88px;border-radius:22px;background:conic-gradient(from 0deg,#7b5cff,#00e0c6,#7b5cff);box-shadow:0 8px 26px rgba(123,92,255,.4)"></div>';
    el.appendChild(s);
    const node=s.querySelector('#amSwirlEl');
    const play=()=>{node.style.animation='none';void node.offsetWidth;node.style.animation='amSwirl .8s cubic-bezier(.2,.7,.3,1) both';};
    play();
    const t=setInterval(play,1900);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
