/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-blur-slide-in', title:'Blur Slide In', cat:'CSS Moderno',
  tags:['css','entrada','blur','slide','translate','desenfoque','reveal'],
  desc:'Blur direccional combinado con translate: el elemento entra deslizándose desde un lado mientras pasa de desenfocado a nítido.',
  meta:['filter blur','0 JS'],
  prompt:`Crea una animación de entrada "Blur Slide In" solo con CSS.
Un elemento arranca desplazado a un lado (transform: translateX(-40px) o desde abajo translateY), transparente (opacity:0) y desenfocado (filter: blur(12px)). Termina en su posición (translate(0)), opaco (opacity:1) y nítido (filter: blur(0)).
Define @keyframes interpolando esas tres propiedades a la vez. Usa una curva cubic-bezier suave tipo ease-out, duración ~0.7s, animation-fill-mode both. Sin JS.`,
  code:`.blur-slide-in {
  animation: bsi-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes bsi-in {
  0%   { opacity: 0; transform: translateX(-40px); filter: blur(12px); }
  100% { opacity: 1; transform: translateX(0);     filter: blur(0); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amBlurSlide{0%{opacity:0;transform:translateX(-46px);filter:blur(12px)}100%{opacity:1;transform:translateX(0);filter:blur(0)}}</style><div class="amBlurBox" style="padding:18px 26px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#fff;font:700 18px/1 system-ui;letter-spacing:.5px;box-shadow:0 8px 30px rgba(0,224,198,.35)">Blur&nbsp;Slide</div>';
    el.appendChild(s);
    const box=s.querySelector('.amBlurBox');
    let t=null;
    const run=()=>{box.style.animation='none';void box.offsetWidth;box.style.animation='amBlurSlide .7s cubic-bezier(.22,1,.36,1) both';};
    run();
    t=setInterval(run,1600);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
