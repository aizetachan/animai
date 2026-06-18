import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-pixelation', title:'Pixelation', cat:'Postprocesado',
  tags:['pixel','pixelado','retro','8bit','postprocessing','mosaico'],
  desc:'Pixelado retro de toda la escena con <Pixelation>. Estética 8-bit/mosaico para gaming o transiciones.',
  meta:['@react-three/postprocessing','<Pixelation>','granularity'],
  prompt:`Pixela toda la escena con <Pixelation granularity={6}> de @react-three/postprocessing.
Sube granularity para bloques más grandes (más retro). Anímalo (de alto a 0) para una transición "des-pixelado" al cargar.
Estética 8-bit/arcade. No se puede combinar con efectos de convolución.`,
  code:`// npm install @react-three/postprocessing postprocessing
import { EffectComposer, Pixelation } from '@react-three/postprocessing'

<EffectComposer>
  <Pixelation granularity={6} />
</EffectComposer>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;const px=6+Math.sin(t)*4;const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.3;
      // dibuja un disco con gradiente, pixelado por celdas
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const cell=Math.max(4,px);for(let yy=0;yy<o.H();yy+=cell)for(let xx=0;xx<o.W();xx+=cell){const dx=xx+cell/2-cx,dy=yy+cell/2-cy,d=Math.hypot(dx,dy);if(d<R){const k=1-d/R;const ang=Math.atan2(dy,dx)+t;const r=Math.round(80+k*100+Math.sin(ang*3)*40),g=Math.round(60+k*120),b=255;x.fillStyle='rgb('+r+','+g+','+b+')';x.fillRect(xx,yy,cell-1,cell-1);}}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
