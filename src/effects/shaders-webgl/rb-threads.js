import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-threads', title:'Threads', cat:'Shaders WebGL',
  tags:['threads','hilos','líneas','react bits','onda','flow','minimal'],
  desc:'Hilos horizontales finos que ondulan en patrón de interferencia. Las Threads minimalistas de React Bits.',
  meta:['Canvas 2D','lines','React Bits'],
  prompt:`Recrea "Threads" de React Bits: muchas líneas horizontales finas que ondulan suavemente formando un patrón de interferencia/onda, opcionalmente reaccionando al cursor.
Dibuja N líneas; cada una ondula con un seno cuya amplitud y fase varían por índice y tiempo, creando un tejido de hilos en movimiento. Minimalista, monocromo.
Fondo sofisticado y discreto para secciones de texto.`,
  code:`// Threads (React Bits) — líneas que ondulan en interferencia
for (let i = 0; i < lineCount; i++) {
  const baseY = (i / lineCount) * H
  ctx.beginPath()
  for (let x = 0; x <= W; x += 6) {
    const y = baseY + Math.sin(x*0.02 + i*0.3 + t) * (4 + i*0.2)
    ctx.lineTo(x, y)
  }
  ctx.stroke()
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=22;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;x.fillStyle='#0a0a12';x.fillRect(0,0,o.W(),o.H());
      for(let i=0;i<N;i++){const baseY=(i+.5)/N*o.H();x.beginPath();for(let xx=0;xx<=o.W();xx+=6){const yy=baseY+Math.sin(xx*.02+i*.3+t)*(3+i*.25)+Math.sin(xx*.01-t*.7)*4;xx===0?x.moveTo(xx,yy):x.lineTo(xx,yy);}x.strokeStyle='rgba(123,92,255,'+(.2+i/N*.5)+')';x.lineWidth=1;x.stroke();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
