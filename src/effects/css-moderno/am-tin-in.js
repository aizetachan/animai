/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-tin-in', title:'Tin In', cat:'CSS Moderno',
  tags:['css','entrada','steps','robot','animacion','tin','escalonado'],
  desc:'Entrada robótica a pasos rígidos: el elemento aparece dando saltos de escala con timing steps().',
  meta:['steps()','0 JS'],
  prompt:`Crea una animación de entrada "Tin In" con aspecto robótico, solo CSS.
Un elemento (caja o texto) que arranca invisible (opacity:0) y muy pequeño (scale 0). Define @keyframes que aumenten la escala por tramos (0, .4, .7, 1.1, 1) y opacidad de 0 a 1.
La clave es usar animation-timing-function: steps(5, end) o steps en cada tramo para que el movimiento sea a "saltos" rígidos, no suave, simulando un mecanismo. Duración ~0.9s. Sin JS.`,
  code:`.tin-in {
  animation: tin-in 0.9s steps(5, end) both;
}
@keyframes tin-in {
  0%   { opacity: 0; transform: scale(0.1) rotate(-8deg); }
  40%  { opacity: 1; transform: scale(0.55) rotate(4deg); }
  70%  { transform: scale(0.85) rotate(-2deg); }
  85%  { transform: scale(1.12) rotate(1deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amTinIn{0%{opacity:0;transform:scale(.1) rotate(-8deg)}40%{opacity:1;transform:scale(.55) rotate(4deg)}70%{transform:scale(.85) rotate(-2deg)}85%{transform:scale(1.12) rotate(1deg)}100%{opacity:1;transform:scale(1) rotate(0)}}</style><div class="amTinBox" style="width:96px;height:96px;border-radius:16px;background:linear-gradient(135deg,#7b5cff,#00e0c6);display:grid;place-items:center;color:#fff;font:700 14px/1 system-ui;letter-spacing:1px;box-shadow:0 8px 30px rgba(123,92,255,.4)">TIN</div>';
    el.appendChild(s);
    const box=s.querySelector('.amTinBox');
    let t=null;
    const run=()=>{box.style.animation='none';void box.offsetWidth;box.style.animation='amTinIn .9s steps(5,end) both';};
    run();
    t=setInterval(run,1800);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
