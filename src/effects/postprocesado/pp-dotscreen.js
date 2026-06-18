import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-dotscreen', title:'Dot Screen', cat:'Postprocesado',
  tags:['dots','halftone','semitono','postprocessing','print','retro'],
  desc:'Trama de puntos tipo semitono de imprenta con <DotScreen>. Look editorial/cómic sobre la escena.',
  meta:['@react-three/postprocessing','<DotScreen>','Halftone'],
  prompt:`Aplica una trama de puntos (halftone) a la escena con <DotScreen> de @react-three/postprocessing.
Props: angle (ángulo del patrón), scale (densidad). El tamaño de cada punto depende del brillo del píxel, como en impresión offset.
Estética editorial, cómic o risografía. Combínalo con un look monocromo para máximo efecto print.`,
  code:`// npm install @react-three/postprocessing postprocessing
import { EffectComposer, DotScreen } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

<EffectComposer>
  <DotScreen blendFunction={BlendFunction.NORMAL}
    angle={Math.PI * 0.5} scale={1.0} />
</EffectComposer>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;x.fillStyle='#0a0a12';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.34,step=7;
      for(let yy=step/2;yy<o.H();yy+=step)for(let xx=step/2;xx<o.W();xx+=step){const dx=xx-cx,dy=yy-cy,d=Math.hypot(dx,dy);const bright=Math.max(0,1-d/R)*(.6+.4*Math.sin(d*.1-t*2));const rad=bright*step*.6;if(rad>.3){x.fillStyle=d<R?'#7b5cff':'#1a1a2a';x.beginPath();x.arc(xx,yy,rad,0,6.28);x.fill();}}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
