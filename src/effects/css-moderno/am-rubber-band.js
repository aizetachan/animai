/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-rubber-band', title:'Rubber Band', cat:'CSS Moderno',
  tags:['css','rubber band','goma','elastica','scale','attention','animate.css'],
  desc:'Estiramiento tipo goma elástica: el elemento se alarga en horizontal, rebota en vertical y vuelve a su tamaño.',
  meta:['transform scale','0 JS'],
  prompt:`Crea un efecto "Rubber Band" (goma elástica), estilo Animate.css.
Con @keyframes anima transform:scale3d variando scaleX/scaleY de forma opuesta para simular estiramiento y compresión.
Pasos: 0% sin escala; 30% scale(1.25,0.75); 40% scale(0.75,1.25); 50% scale(1.15,0.85); 65% scale(0.95,1.05); 75% scale(1.05,0.95); 100% scale(1,1).
transform-origin:center, duración ~1s, repetición infinita. Sin JS.`,
  code:`/* Rubber Band attention seeker (Animate.css style) */
.rubber-band {
  animation: am-rubber 1s infinite both;
  transform-origin: center;
}
@keyframes am-rubber {
  0% { transform: scale3d(1, 1, 1); }
  30% { transform: scale3d(1.25, 0.75, 1); }
  40% { transform: scale3d(0.75, 1.25, 1); }
  50% { transform: scale3d(1.15, 0.85, 1); }
  65% { transform: scale3d(0.95, 1.05, 1); }
  75% { transform: scale3d(1.05, 0.95, 1); }
  100% { transform: scale3d(1, 1, 1); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amRubber{0%{transform:scale3d(1,1,1)}30%{transform:scale3d(1.25,.75,1)}40%{transform:scale3d(.75,1.25,1)}50%{transform:scale3d(1.15,.85,1)}65%{transform:scale3d(.95,1.05,1)}75%{transform:scale3d(1.05,.95,1)}100%{transform:scale3d(1,1,1)}}</style><div style="font:800 28px/1 system-ui,sans-serif;color:#07070d;padding:16px 22px;border-radius:14px;background:linear-gradient(135deg,#00e0c6,#7b5cff);transform-origin:center;animation:amRubber 1.4s 0.3s infinite both">Rubber</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
