import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-photo-flythrough', title:'Photo Fly-Through', cat:'Scroll',
  tags:['fly-through','photos','3d','profundidad','scroll','perspectiva','z-travel'],
  desc:'Una nube de fotos distribuidas en profundidad por la que se vuela hacia delante al hacer scroll.',
  meta:['canvas','scroll','3d'],
  prompt:`Crea un "photo fly-through": una nube de fotos colocadas en el espacio 3D (x,y,z) por las que la cámara avanza al hacer scroll.
Estructura de datos: array de fotos {x, y, z, color} con z desde cerca a lejos. Cámara con focal f.
Algoritmo: el progreso de scroll p mueve la cámara camZ = p * profundidadTotal. Para cada foto, zRel = z - camZ; si zRel<=0 se recicla al fondo (z += profundidadTotal). Proyección perspectiva: scale = f/zRel; sx = cx + x*scale; sy = cy + y*scale; tamaño = base*scale. Alpha de entrada/salida con fade según zRel (fade-in al aparecer lejos, fade-out al pasar muy cerca). Dibuja ordenando de lejos a cerca (painter's algorithm).
Timings: avance proporcional al scroll. Para la demo, anima p en bucle simulando el scroll continuo.
Ideal para galerías inmersivas, intros de portfolio y storytelling visual.`,
  code:`// Photo fly-through — cámara que avanza por una nube de fotos en profundidad
const f = 260, DEPTH = 2000, base = 60;
function project(ph, camZ){
  const zRel = ph.z - camZ;
  const s = f / zRel;                       // perspectiva
  return { sx: cx + ph.x*s, sy: cy + ph.y*s, size: base*s, zRel };
}
function draw(p){                            // p = progreso de scroll 0..1
  const camZ = p * DEPTH;
  photos.forEach(ph=>{ if(ph.z - camZ <= 1) ph.z += DEPTH; });   // reciclar
  photos.sort((a,b)=> b.z - a.z);            // pintar de lejos a cerca
  photos.forEach(ph=>{
    const q = project(ph, camZ);
    ctx.globalAlpha = Math.min(1, q.zRel/600) * Math.min(1,(DEPTH-q.zRel)/1500);
    ctx.fillStyle = ph.color;
    ctx.fillRect(q.sx-q.size/2, q.sy-q.size/2, q.size, q.size);
  });
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const f=260,DEPTH=2000,base=42,N=34;let raf,run=true,p=0;
    const cols=['#7b5cff','#00e0c6','#9d7bff','#3de0c6','#b8a0ff','#5fe0d0'];
    const photos=[];for(let i=0;i<N;i++)photos.push({x:(Math.random()-.5)*260,y:(Math.random()-.5)*200,z:40+Math.random()*DEPTH,color:cols[i%cols.length]});
    (function loop(){if(!run)return;const W=o.W(),H=o.H(),cx=W/2,cy=H/2;
      p+=.0035;if(p>1)p-=1;const camZ=p*DEPTH;
      x.fillStyle='#06060f';x.fillRect(0,0,W,H);
      photos.forEach(ph=>{if(ph.z-camZ<=1)ph.z+=DEPTH;});
      const order=photos.slice().sort((a,b)=>b.z-a.z);
      order.forEach(ph=>{const zRel=ph.z-camZ;const s=f/zRel;const sx=cx+ph.x*s,sy=cy+ph.y*s,size=base*s;
        const a=Math.min(1,zRel/600)*Math.min(1,(DEPTH-zRel)/1400);if(a<=0||size<1)return;
        x.globalAlpha=a;
        x.save();x.shadowColor=ph.color;x.shadowBlur=size*.25;x.fillStyle=ph.color;
        x.fillRect(sx-size/2,sy-size/2,size,size);x.restore();
        x.globalAlpha=a*.9;x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=Math.max(.5,size*.03);x.strokeRect(sx-size/2,sy-size/2,size,size);
      });
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
