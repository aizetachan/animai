/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-comet', title:'Comet Spinner', cat:'Loaders',
  tags:['css','loader','cometa','comet','estela','conic','mask','0 js'],
  desc:'Cometa con estela en gradiente cónico orbitando un aro circular, recortado con máscara radial.',
  meta:['conic-gradient','mask','0 JS'],
  prompt:`Crea un loader de cometa orbitando un aro solo con CSS.
Un div circular con background:conic-gradient(from 0deg, transparent 0%, color1 60%, color2 95%, transparent 100%) para simular la estela que se desvanece. Recórtalo a un aro con -webkit-mask y mask radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0).
Añade la "cabeza" del cometa como un pseudo-elemento o div: un punto brillante con box-shadow (glow) posicionado al inicio del arco. Anímalo con @keyframes de rotate 0 a 360deg ~1s linear infinite. Sin SVG ni JS.`,
  code:`.comet {
  position: relative; width: 56px; aspect-ratio: 1; border-radius: 50%;
  background: conic-gradient(from 0deg, #0000 0%, #7b5cff 60%, #00e0c6 95%, #0000 100%);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 6px), #000 0);
          mask: radial-gradient(farthest-side, #0000 calc(100% - 6px), #000 0);
  animation: comet-spin 1s linear infinite;
}
.comet::after {
  content:''; position:absolute; top:0; left:50%;
  width:6px; height:6px; border-radius:50%; background:#00e0c6;
  transform: translate(-50%,-1px);
  box-shadow: 0 0 8px 2px #00e0c6;
}
@keyframes comet-spin { to { transform: rotate(360deg); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes ldComet{to{transform:rotate(360deg)}}'
      +'.ldCometRing::after{content:"";position:absolute;top:0;left:50%;width:7px;height:7px;border-radius:50%;background:#00e0c6;transform:translate(-50%,-1px);box-shadow:0 0 9px 2px #00e0c6}'
      +'</style>'
      +'<div class="ldCometRing" style="position:relative;width:64px;aspect-ratio:1;border-radius:50%;background:conic-gradient(from 0deg,#0000 0%,#7b5cff 60%,#00e0c6 95%,#0000 100%);-webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 6px),#000 0);mask:radial-gradient(farthest-side,#0000 calc(100% - 6px),#000 0);animation:ldComet 1s linear infinite"></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
