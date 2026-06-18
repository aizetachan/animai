/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-tada', title:'Tada', cat:'CSS Moderno',
  tags:['css','tada','celebracion','scale','rotate','attention','animate.css'],
  desc:'Animacion celebratoria "tada": el elemento se encoge, gira de lado a lado y crece con un final festivo.',
  meta:['transform scale rotate','0 JS'],
  prompt:`Crea un efecto "Tada" celebratorio, estilo Animate.css.
Con @keyframes combina scale3d y rotate. Pasos: 0% scale(1) rotate(0); 10%-20% scale(0.9) rotate(-3deg); 30%,50%,70%,90% scale(1.1) rotate(3deg); 40%,60%,80% scale(1.1) rotate(-3deg); 100% scale(1) rotate(0).
transform-origin:center, duracion ~1s, repeticion infinita con pequeno retardo. Sin JS.`,
  code:`/* Tada attention seeker (Animate.css style) */
.tada {
  animation: am-tada 1s infinite both;
  transform-origin: center;
}
@keyframes am-tada {
  0% { transform: scale3d(1, 1, 1); }
  10%, 20% { transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg); }
  30%, 50%, 70%, 90% { transform: scale3d(1.1, 1.1, 1.1) rotate(3deg); }
  40%, 60%, 80% { transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg); }
  100% { transform: scale3d(1, 1, 1); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amTada{0%{transform:scale3d(1,1,1)}10%,20%{transform:scale3d(.9,.9,.9) rotate(-3deg)}30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1) rotate(3deg)}40%,60%,80%{transform:scale3d(1.1,1.1,1.1) rotate(-3deg)}100%{transform:scale3d(1,1,1)}}</style><div style="font:800 34px/1 system-ui,sans-serif;color:#fff;padding:14px 20px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);transform-origin:center;animation:amTada 1.6s 0.3s infinite both">Tada</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
