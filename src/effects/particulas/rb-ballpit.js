import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-ballpit', title:'Ballpit', cat:'Partículas',
  tags:['ballpit','bolas','física','colisión','react bits','rebote','3d'],
  desc:'Piscina de bolas con física y colisiones que rebotan en el contenedor. Juguetón e interactivo.',
  meta:['Canvas 2D','colisión','React Bits'],
  prompt:`Recrea el "Ballpit" de React Bits: una piscina de bolas con física (gravedad opcional, colisiones entre bolas y con las paredes) que rebotan dentro del contenedor, opcionalmente apartándose del cursor.
Cada bola tiene posición, velocidad y radio; resuelve colisiones bola-bola (intercambio de momento) y bola-pared (rebote). Colores variados.
Fondo lúdico para landings con personalidad. Versión pro: Three.js + cannon.`,
  code:`// Ballpit — física simple con colisiones
balls.forEach(b => {
  b.x += b.vx; b.y += b.vy
  if (b.x < b.r || b.x > W - b.r) b.vx *= -0.9   // paredes
  if (b.y < b.r || b.y > H - b.r) b.vy *= -0.9
})
// colisión bola-bola: si dist < r1+r2 -> intercambiar velocidades`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const B=[];const cols=['#7b5cff','#00e0c6','#ff5ca8','#ffd166'];
    function init(){B.length=0;for(let i=0;i<14;i++){const r=8+Math.random()*10;B.push({x:r+Math.random()*(o.W()-2*r),y:r+Math.random()*(o.H()-2*r),vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,r,c:cols[i%cols.length]});}}
    init();let raf,run=true;
    (function loop(){if(!run)return;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      for(let i=0;i<B.length;i++){const b=B[i];b.x+=b.vx;b.y+=b.vy;if(b.x<b.r){b.x=b.r;b.vx*=-.92;}if(b.x>o.W()-b.r){b.x=o.W()-b.r;b.vx*=-.92;}if(b.y<b.r){b.y=b.r;b.vy*=-.92;}if(b.y>o.H()-b.r){b.y=o.H()-b.r;b.vy*=-.92;}
        for(let j=i+1;j<B.length;j++){const c=B[j];const dx=c.x-b.x,dy=c.y-b.y,d=Math.hypot(dx,dy),min=b.r+c.r;if(d<min&&d>0){const nx=dx/d,ny=dy/d,ov=(min-d)/2;b.x-=nx*ov;b.y-=ny*ov;c.x+=nx*ov;c.y+=ny*ov;const tv=b.vx;b.vx=c.vx;c.vx=tv;const tv2=b.vy;b.vy=c.vy;c.vy=tv2;}}
        x.fillStyle=b.c;x.beginPath();x.arc(b.x,b.y,b.r,0,6.28);x.fill();x.fillStyle='rgba(255,255,255,.3)';x.beginPath();x.arc(b.x-b.r*.3,b.y-b.r*.3,b.r*.3,0,6.28);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
