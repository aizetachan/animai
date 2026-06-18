import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-bar-race', title:'Bar Chart Race', cat:'Datos / Charts',
  tags:['bar race','ranking','carrera','reordenar','datos','animado','barras'],
  desc:'Barras horizontales que crecen y se reordenan dinámicamente compitiendo por el primer puesto. Bar race.',
  meta:['reorder','FLIP','Viz'],
  prompt:`Crea un "bar chart race": barras horizontales (con etiqueta y valor) que cambian de longitud con el tiempo y se reordenan animadamente cuando una supera a otra, como las visualizaciones de ranking en el tiempo.
Cada frame actualiza valores, reordena por valor y anima la posición Y de cada barra hacia su nuevo rank (FLIP) y su ancho hacia el valor. La barra líder se resalta.
Para datos en evolución: ranking de países, productos, popularidad.`,
  code:`// Bar chart race — actualizar valores, reordenar, animar posición
bars.sort((a,b) => b.value - a.value)
bars.forEach((bar, rank) => {
  bar.targetY = rank * rowHeight       // nueva posición por ranking
  bar.y += (bar.targetY - bar.y) * 0.1 // anima hacia su sitio
  bar.width += (bar.value - bar.width) * 0.1
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const names=['Alfa','Beta','Gamma','Delta','Eps'];const cols=['#7b5cff','#00e0c6','#ff5ca8','#ffd166','#5a9cff'];
    let bars=names.map((n,i)=>({n,c:cols[i],v:20+Math.random()*60,y:i*100,w:0}));let t=0,raf,run=true;
    (function loop(){if(!run)return;t++;if(t%3===0)bars.forEach(b=>{b.v+=(Math.random()-.45)*4;b.v=Math.max(8,Math.min(100,b.v));});
      const sorted=[...bars].sort((a,b)=>b.v-a.v);const pad=14,rowH=(o.H()-pad*2)/bars.length,maxW=o.W()-90;
      sorted.forEach((b,rank)=>{b.ty=pad+rank*rowH;});bars.forEach(b=>{b.y+=(b.ty-b.y)*.12;b.w+=(b.v/100*maxW-b.w)*.12;});
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const lead=sorted[0];
      bars.forEach(b=>{const bh=rowH*.7;x.fillStyle=b.c;x.globalAlpha=b===lead?1:.8;roundRect(x,64,b.y,Math.max(2,b.w),bh,4);x.fill();x.globalAlpha=1;x.fillStyle='#eef0f7';x.font='600 10px Inter';x.textAlign='right';x.textBaseline='middle';x.fillText(b.n,58,b.y+bh/2);x.textAlign='left';x.fillStyle='#8a8ca3';x.fillText(Math.round(b.v),64+Math.max(2,b.w)+5,b.y+bh/2);});
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){r=Math.min(r,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
