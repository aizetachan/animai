import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-dof', title:'Depth of Field', cat:'Postprocesado',
  tags:['dof','bokeh','profundidad','desenfoque','cine','postprocessing'],
  desc:'Desenfoque de profundidad con bokeh usando <DepthOfField>. El foco cinematográfico de cámara real.',
  meta:['@react-three/postprocessing','<DepthOfField>','Bokeh'],
  prompt:`Da profundidad de campo cinematográfica con <DepthOfField> de @react-three/postprocessing.
Props: focusDistance (qué plano está enfocado), focalLength, bokehScale (intensidad del desenfoque).
Lo que esté fuera del plano focal se vuelve bokeh. Úsalo para dirigir la atención a un producto/objeto y dar look de cámara real.`,
  code:`// npm install @react-three/postprocessing postprocessing
import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing'

<EffectComposer>
  <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
  <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
  <Vignette eskil={false} offset={0.1} darkness={1.1} />
</EffectComposer>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    const dots=[];for(let i=0;i<40;i++)dots.push({x:Math.random(),y:Math.random(),z:Math.random(),ph:Math.random()*6.28});
    (function loop(){if(!run)return;t+=.01;x.fillStyle='#08080f';x.fillRect(0,0,o.W(),o.H());x.globalCompositeOperation='lighter';
      dots.forEach(p=>{const focus=.5;const blur=Math.abs(p.z-focus)*30;const px=(p.x+Math.sin(t+p.ph)*.02)*o.W(),py=p.y*o.H();const r=4+blur;const a=blur<3?.9:.25;x.fillStyle='rgba('+(p.z>.5?'0,224,198':'123,92,255')+','+a+')';x.beginPath();x.arc(px,py,r,0,6.28);x.fill();});
      x.globalCompositeOperation='source-over';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
