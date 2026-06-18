/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-swoop-in', title:'Swoop In', cat:'CSS Moderno',
  tags:['css','entrada','curva','scale','translate','swoop','esquina'],
  desc:'Entrada curva que aparece desde la esquina inferior derecha estirandose y asentandose con escala.',
  meta:['@keyframes','0 JS'],
  prompt:`Crea una animacion de entrada "Swoop In" (barrido curvo).
El elemento entra desde la esquina inferior derecha: 0% transform scale(0) translate(100%,100%) con transform-origin:right bottom y opacity 0;
en pasos intermedios crece y se desplaza hacia su sitio describiendo una curva;
100% scale(1) translate(0,0) opacity 1.
Usa transform-origin:right bottom y easing cubic-bezier(.5,0,.3,1.2), duracion ~0.7s. Solo CSS.`,
  code:`/* Swoop In - entrada curva desde la esquina */
.swoop {
  animation: am-swoop 0.7s cubic-bezier(.5,0,.3,1.2) both;
  transform-origin: right bottom;
}
@keyframes am-swoop {
  0%   { transform: scale(0) translate(100%, 100%); opacity: 0; }
  60%  { transform: scale(0.8) translate(-6%, -6%); opacity: 1; }
  100% { transform: scale(1) translate(0, 0); opacity: 1; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amSwoop{0%{transform:scale(0) translate(100%,100%);opacity:0}60%{transform:scale(.8) translate(-6%,-6%);opacity:1}100%{transform:scale(1) translate(0,0);opacity:1}}</style><div id="amSwoopEl" style="width:96px;height:84px;border-radius:18px;background:linear-gradient(135deg,#00e0c6,#7b5cff);box-shadow:0 10px 28px rgba(0,224,198,.38);transform-origin:right bottom"></div>';
    el.appendChild(s);
    const node=s.querySelector('#amSwoopEl');
    const play=()=>{node.style.animation='none';void node.offsetWidth;node.style.animation='amSwoop .7s cubic-bezier(.5,0,.3,1.2) both';};
    play();
    const t=setInterval(play,1800);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
