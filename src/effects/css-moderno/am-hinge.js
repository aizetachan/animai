/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-hinge', title:'Hinge', cat:'CSS Moderno',
  tags:['css','hinge','bisagra','caida','salida','animate','exit'],
  desc:'El elemento se balancea colgando de una bisagra en la esquina superior izquierda y finalmente se desprende y cae.',
  meta:['transform-origin','0 JS'],
  prompt:`Crea el efecto "Hinge" de salida solo con CSS, estilo animate.css.
El elemento cuelga de una bisagra fijando transform-origin en la esquina superior izquierda (top left) y se balancea con rotaciones alternas, luego se desprende cayendo con translateY y opacity a 0.
Define @keyframes: 0% rotate(0); 20%,60% rotate(80deg); 40%,80% rotate(60deg) con opacity 1; 100% translate3d(0,700px,0) opacity 0. Duración ~2s ease-in-out. Para la preview repite en bucle reiniciando arriba. Sin JS.`,
  code:`.hinge {
  transform-origin: top left;
  animation: am-hinge 2s ease-in-out;
}
@keyframes am-hinge {
  0%        { transform: rotate(0); }
  20%, 60%  { transform: rotate(80deg); }
  40%, 80%  { transform: rotate(60deg); opacity: 1; }
  100%      { transform: translate3d(0, 700px, 0); opacity: 0; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden';
    s.innerHTML='<style>@keyframes amHinge{0%{transform:rotate(0);animation-timing-function:ease-in-out}20%,60%{transform:rotate(80deg);animation-timing-function:ease-in-out}40%,80%{transform:rotate(60deg);opacity:1;animation-timing-function:ease-in-out}90%{opacity:1}100%{transform:translate3d(0,220px,0);opacity:0}}</style><div style="transform-origin:top left;animation:amHinge 2.4s ease-in-out infinite;width:62px;height:62px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);box-shadow:0 10px 22px rgba(123,92,255,.4);display:grid;place-items:center;color:#fff;font:700 13px system-ui">Hinge</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
