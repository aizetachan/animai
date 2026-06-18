import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-motion-blur', title:'Motion Blur', cat:'Postprocesado',
  tags:['motion blur','desenfoque','movimiento','velocidad','speed','postprocessing','estela'],
  desc:'Desenfoque de movimiento direccional sobre un objeto que se desplaza rápido, integrando su trayectoria por frame.',
  meta:['canvas','motion-blur','velocity'],
  prompt:`Simula motion blur direccional acumulando muestras del objeto a lo largo de su vector de velocidad.
Técnica: en cada frame calcula la velocidad v = posActual - posPrevia. Dibuja N copias del objeto (samples) interpolando linealmente entre posPrevia y posActual, cada una con alpha = baseAlpha / N usando blending aditivo ('lighter'). El resultado es una estela continua en la dirección del movimiento, más larga cuanto mayor sea |v|.
Parámetros clave: samples (8-16), intensidad del alpha, factor de longitud (puedes extrapolar más allá de la posición para exagerar). En WebGL/postpro real se hace con un velocity buffer y un blur a lo largo del vector por píxel.`,
  code:`// Motion blur por integración de la trayectoria (canvas 2D)
let prev = {x:cx, y:cy};
function frame(pos){           // pos = posición actual del objeto
  const samples = 12;
  ctx.globalCompositeOperation = 'lighter';
  for(let i=0;i<samples;i++){
    const k = i/(samples-1);                 // 0..1 a lo largo del recorrido
    const px = prev.x + (pos.x-prev.x)*k;
    const py = prev.y + (pos.y-prev.y)*k;
    ctx.globalAlpha = 0.9/samples;            // cada copia muy tenue
    drawObject(px, py);
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  prev = pos;
}
// En postpro real: render a velocity buffer y blur por píxel a lo largo del vector v.`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    let prev=null;
    function drawBall(px,py,a){
      x.beginPath();x.arc(px,py,11,0,6.283);
      x.fillStyle='rgba(123,92,255,'+a+')';x.fill();
      x.beginPath();x.arc(px,py,5,0,6.283);
      x.fillStyle='rgba(0,224,198,'+a+')';x.fill();
    }
    (function loop(){if(!run)return;t+=.018;
      x.fillStyle='#070710';x.fillRect(0,0,o.W(),o.H());
      const W=o.W(),H=o.H();
      // trayectoria: figura de ocho horizontal
      const cx=W/2+Math.sin(t*2.2)*(W*0.34);
      const cy=H/2+Math.sin(t*4.4)*(H*0.22);
      const cur={x:cx,y:cy};
      if(!prev)prev=cur;
      const samples=14;
      x.globalCompositeOperation='lighter';
      for(let i=0;i<samples;i++){
        const k=i/(samples-1);
        const px=prev.x+(cur.x-prev.x)*k;
        const py=prev.y+(cur.y-prev.y)*k;
        drawBall(px,py,0.85/samples);
      }
      x.globalCompositeOperation='source-over';
      drawBall(cur.x,cur.y,1);
      prev=cur;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
