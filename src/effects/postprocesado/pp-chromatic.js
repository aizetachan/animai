import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-chromatic', title:'Chromatic Aberration', cat:'Postprocesado',
  tags:['chromatic','aberración','rgb','lente','postprocessing','offset'],
  desc:'Separación RGB de lente con <ChromaticAberration>. El defecto óptico premium que da look de cámara.',
  meta:['@react-three/postprocessing','ChromaticAberration','offset'],
  prompt:`Añade aberración cromática de lente con <ChromaticAberration> de @react-three/postprocessing.
Prop offset={[0.002, 0.002]} desplaza los canales R y B respecto al G, más fuerte en los bordes (como una lente real).
Sutil da look premium de cámara; fuerte da glitch/psicodélico. Combínalo con Bloom para el combo "neon dream".`,
  code:`// npm install @react-three/postprocessing postprocessing
import { EffectComposer, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

<EffectComposer>
  <ChromaticAberration
    blendFunction={BlendFunction.NORMAL}
    offset={[0.002, 0.002]} radialModulation modulationOffset={0.5} />
</EffectComposer>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;const off=4+Math.sin(t)*3;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2;x.textAlign='center';x.textBaseline='middle';x.font='800 '+Math.min(o.W(),o.H())*.32+'px Inter,sans-serif';
      x.globalCompositeOperation='lighter';x.fillStyle='rgba(255,0,80,.8)';x.fillText('RGB',cx-off,cy);x.fillStyle='rgba(0,255,160,.8)';x.fillText('RGB',cx,cy);x.fillStyle='rgba(40,120,255,.8)';x.fillText('RGB',cx+off,cy);x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
