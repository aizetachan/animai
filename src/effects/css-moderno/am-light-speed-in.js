/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-light-speed-in', title:'Light Speed In', cat:'CSS Moderno',
  tags:['css','light speed','entrada','skew','sesgo','animate','entrance'],
  desc:'Entrada con estela sesgada desde la derecha: el elemento llega skew y se endereza acelerando como un destello.',
  meta:['transform','0 JS'],
  prompt:`Crea el efecto "Light Speed In" solo con CSS, estilo animate.css.
El elemento entra desde la derecha con un sesgo (skewX) pronunciado y opacidad 0, luego se reduce el skew en pasos hasta enderezarse.
Define @keyframes: 0% translateX(100%) skewX(-30deg) opacity 0; 60% translateX(0) skewX(20deg) opacity 1; 80% skewX(-5deg); 100% translateX(0) skewX(0). Usa animation-timing-function:ease-out. Para el loop de preview alterna entrada/salida o repite con un pequeño delay. Sin JS.`,
  code:`.light-speed-in {
  animation: am-lsi 1s ease-out;
}
@keyframes am-lsi {
  0%   { transform: translateX(100%) skewX(-30deg); opacity: 0; }
  60%  { transform: translateX(0) skewX(20deg);     opacity: 1; }
  80%  { transform: translateX(0) skewX(-5deg);     opacity: 1; }
  100% { transform: translateX(0) skewX(0);         opacity: 1; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden';
    s.innerHTML='<style>@keyframes amLsi{0%{transform:translateX(120px) skewX(-30deg);opacity:0}60%{transform:translateX(0) skewX(20deg);opacity:1}80%{transform:translateX(0) skewX(-5deg);opacity:1}100%{transform:translateX(0) skewX(0);opacity:1}}</style><div style="animation:amLsi 1.6s ease-out infinite;padding:14px 22px;border-radius:12px;background:linear-gradient(90deg,#7b5cff,#00e0c6);color:#fff;font:700 15px system-ui;box-shadow:0 8px 30px rgba(0,224,198,.35)">Light Speed</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
