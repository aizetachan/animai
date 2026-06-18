import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-kinetic-type', title:'Kinetic Type Loop', cat:'Texto',
  tags:['kinetic','tipografía','codrops','repetir','escala','loop','hipnótico'],
  desc:'Una palabra repetida que escala desde el infinito en bucle hipnótico. Kinetic typography de Codrops.',
  meta:['nested scale','loop','Kinetic'],
  prompt:`Recrea una "kinetic typography" tipo túnel: la misma palabra repetida en capas concéntricas que escalan desde el centro hacia fuera (o al revés) en bucle infinito, dando un efecto de zoom hipnótico/túnel.
Dibuja N copias del texto a escalas crecientes con opacidad decreciente; incrementa todas las escalas con el tiempo y resetea la que sale de cuadro al centro.
Para intros impactantes y secciones audiovisuales.`,
  code:`// Kinetic type tunnel — capas de texto que escalan en loop
layers.forEach((L, i) => {
  L.scale = ((baseScale + i + t) % maxLayers) / maxLayers * maxScale
  L.opacity = 1 - L.scale / maxScale
  drawText(word, L.scale, L.opacity)
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=6,word='MOTION';let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.012;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2;x.textAlign='center';x.textBaseline='middle';
      for(let i=0;i<N;i++){const prog=((t+i/N)%1);const sc=.2+prog*2.4;const op=1-prog;x.font='900 '+(28*sc)+'px Inter,sans-serif';x.fillStyle='rgba('+(i%2?'0,224,198':'123,92,255')+','+op*.8+')';x.fillText(word,cx,cy);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
