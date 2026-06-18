import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-ribbons', title:'Ribbons', cat:'Shaders WebGL',
  tags:['ribbons','cintas','flow','react bits','ondas','seda','flujo'],
  desc:'Cintas de luz que serpentean fluidamente por la pantalla. Las Ribbons de React Bits.',
  meta:['Canvas 2D','flow','React Bits'],
  prompt:`Recrea "Ribbons" de React Bits: varias cintas/líneas gruesas que serpentean por la pantalla siguiendo trayectorias onduladas suaves, con gradiente y un leve glow, como listones de seda al viento.
Cada cinta es una curva definida por senos desfasados que se desplazan con el tiempo; dibújala como una polilínea gruesa con gradiente. Colores de marca.
Fondo elegante y dinámico para heros creativos.`,
  code:`// Ribbons (React Bits) — cintas onduladas con gradiente
ribbons.forEach(r => {
  ctx.beginPath()
  for (let x = 0; x <= W; x += 8) {
    const y = H/2 + Math.sin(x*0.01 + r.phase + t)*r.amp
                  + Math.sin(x*0.02 - t)*r.amp*0.4
    ctx.lineTo(x, y)
  }
  ctx.strokeStyle = r.gradient; ctx.lineWidth = r.width; ctx.stroke()
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const R=[{ph:0,amp:30,w:10,c:'#7b5cff'},{ph:2,amp:24,w:8,c:'#00e0c6'},{ph:4,amp:36,w:6,c:'#ff5ca8'}];
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;x.fillStyle='#0a0a16';x.fillRect(0,0,o.W(),o.H());x.lineCap='round';
      R.forEach((r,i)=>{x.beginPath();const cy=o.H()*(.35+i*.15);for(let xx=0;xx<=o.W();xx+=8){const yy=cy+Math.sin(xx*.012+r.ph+t)*r.amp+Math.sin(xx*.025-t)*r.amp*.4;xx===0?x.moveTo(xx,yy):x.lineTo(xx,yy);}x.strokeStyle=r.c;x.globalAlpha=.85;x.lineWidth=r.w;x.shadowBlur=12;x.shadowColor=r.c;x.stroke();x.shadowBlur=0;});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
