/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-heartbeat', title:'Heartbeat', cat:'CSS Moderno',
  tags:['css','heartbeat','latido','pulse','pulso','scale','0 js'],
  desc:'Doble pulso de escala que imita el latido de un corazón, con una pausa entre cada par de pulsos.',
  meta:['transform','keyframes','0 JS'],
  prompt:`Crea un efecto "heartbeat" (latido) solo con CSS.
Anima la propiedad transform:scale para producir dos pulsos seguidos y luego reposo: 0% scale(1), 14% scale(1.3), 28% scale(1), 42% scale(1.3), 70% scale(1), 100% scale(1).
Usa animation con duración ~1.3s, ease-in-out e infinite, de modo que tras el doble latido haya una pausa antes de repetir. Sin JS.`,
  code:`.heartbeat {
  animation: am-heartbeat 1.3s ease-in-out infinite;
}
@keyframes am-heartbeat {
  0%   { transform: scale(1); }
  14%  { transform: scale(1.3); }
  28%  { transform: scale(1); }
  42%  { transform: scale(1.3); }
  70%  { transform: scale(1); }
  100% { transform: scale(1); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amHeart{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}100%{transform:scale(1)}}</style><div style="font-size:72px;line-height:1;filter:drop-shadow(0 6px 16px rgba(255,70,120,.5));animation:amHeart 1.3s ease-in-out infinite">❤️</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
