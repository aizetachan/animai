import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-progress-rings', title:'Activity Rings', cat:'Datos / Charts',
  tags:['rings','anillos','apple','actividad','progreso','concéntrico','fitness'],
  desc:'Anillos concéntricos que se completan como los anillos de actividad de Apple Watch. Multi-métrica.',
  meta:['concentric','sweep','Viz'],
  prompt:`Crea los "activity rings" estilo Apple Watch: varios anillos concéntricos de distinto color que se rellenan cada uno hasta su porcentaje, con extremos redondeados y un leve overshoot al cerrarse el círculo (puede pasar de 100%).
Cada anillo anima su barrido desde 0 hasta su valor con stagger; gradiente por anillo y glow en la punta.
Para paneles de fitness, objetivos múltiples, métricas combinadas.`,
  code:`// Activity rings (Apple Watch)
rings.forEach((ring, i) => {
  const sweep = ring.value * Math.PI*2 * progress
  ctx.beginPath()
  ctx.arc(cx, cy, ring.radius, -Math.PI/2, -Math.PI/2 + sweep)
  ctx.strokeStyle = ring.color; ctx.lineCap = 'round'; ctx.stroke()
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const rings=[{v:.85,c:'#ff5ca8'},{v:.7,c:'#00e0c6'},{v:.6,c:'#7b5cff'}];let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.014;if(t>=1){t=1;hold=45;}}const e=1-Math.pow(2,-10*Math.min(1,t));
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,baseR=Math.min(o.W(),o.H())*.36,lw=Math.min(o.W(),o.H())*.07;
      rings.forEach((r,i)=>{const R=baseR-i*(lw+3);x.strokeStyle=r.c+'33';x.lineWidth=lw;x.beginPath();x.arc(cx,cy,R,0,6.28);x.stroke();x.strokeStyle=r.c;x.lineCap='round';const sweep=r.v*6.283*e;x.beginPath();x.arc(cx,cy,R,-1.5708,-1.5708+sweep);x.stroke();const ex=cx+Math.cos(-1.5708+sweep)*R,ey=cy+Math.sin(-1.5708+sweep)*R;x.fillStyle=r.c;x.shadowBlur=8;x.shadowColor=r.c;x.beginPath();x.arc(ex,ey,lw/2,0,6.28);x.fill();x.shadowBlur=0;});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
