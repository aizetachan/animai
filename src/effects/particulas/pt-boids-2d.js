import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pt-boids-2d', title:'Boids Flocking', cat:'Partículas',
  tags:['boids','flocking','bandada','swarm','separación','alineación','cohesión'],
  desc:'Una bandada 2D que se mueve como un solo organismo: separación, alineación y cohesión.',
  meta:['Canvas 2D','boids','flocking'],
  prompt:`Implementa el algoritmo de Boids de Craig Reynolds en canvas 2D con tres reglas por vecino dentro de un radio de percepción:
1) Separación: huir de vecinos muy cercanos (suma de vectores -(pos_otro-pos) normalizados por distancia).
2) Alineación: igualar la velocidad promedio de los vecinos.
3) Cohesión: dirigirse hacia el centro de masa de los vecinos.
Cada regla produce una fuerza de "steering" = desired - velocity, limitada por maxForce; suma las tres con pesos y limita la velocidad a maxSpeed. Wrap en bordes. Dibuja cada boid como un triángulo orientado a su velocidad. Marca: #7b5cff / #00e0c6.`,
  code:`// Boids — separación + alineación + cohesión
const R=42, maxS=2.4, maxF=0.05;
boids.forEach(b=>{
  let sx=0,sy=0, ax=0,ay=0, cx=0,cy=0, n=0;
  boids.forEach(o=>{ if(o===b) return;
    const dx=b.x-o.x, dy=b.y-o.y, d=Math.hypot(dx,dy);
    if(d>0 && d<R){
      sx+=dx/d; sy+=dy/d;          // separación
      ax+=o.vx; ay+=o.vy;          // alineación
      cx+=o.x;  cy+=o.y;  n++;     // cohesión
    }
  });
  if(n>0){
    b.ax += steer(sx,sy,b)*1.5;            // pesos
    b.ax += steer(ax/n,ay/n,b)*1.0;
    b.ax += steer(cx/n-b.x,cy/n-b.y,b)*1.0;
  }
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=46, B=[];
    for(let i=0;i<N;i++){const a=Math.random()*6.283;B.push({x:Math.random()*o.W(),y:Math.random()*o.H(),vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5});}
    const R=40,maxS=2.3,maxF=0.06;let raf,run=true;
    function steer(dx,dy,b){const m=Math.hypot(dx,dy);if(m<1e-4)return{x:0,y:0};
      const dvx=dx/m*maxS,dvy=dy/m*maxS;let fx=dvx-b.vx,fy=dvy-b.vy;
      const fm=Math.hypot(fx,fy);if(fm>maxF){fx=fx/fm*maxF;fy=fy/fm*maxF;}return{x:fx,y:fy};}
    (function loop(){if(!run)return;
      x.fillStyle='#070710';x.fillRect(0,0,o.W(),o.H());
      const W=o.W(),H=o.H();
      B.forEach(b=>{let sx=0,sy=0,ax=0,ay=0,cx=0,cy=0,n=0;
        B.forEach(t=>{if(t===b)return;const dx=b.x-t.x,dy=b.y-t.y,d=Math.hypot(dx,dy);
          if(d>0&&d<R){sx+=dx/d;sy+=dy/d;ax+=t.vx;ay+=t.vy;cx+=t.x;cy+=t.y;n++;}});
        let fx=0,fy=0;
        if(n>0){const s1=steer(sx,sy,b);fx+=s1.x*1.6;fy+=s1.y*1.6;
          const s2=steer(ax/n,ay/n,b);fx+=s2.x;fy+=s2.y;
          const s3=steer(cx/n-b.x,cy/n-b.y,b);fx+=s3.x;fy+=s3.y;}
        b.vx+=fx;b.vy+=fy;const sp=Math.hypot(b.vx,b.vy);
        if(sp>maxS){b.vx=b.vx/sp*maxS;b.vy=b.vy/sp*maxS;}
        b.x+=b.vx;b.y+=b.vy;
        if(b.x<0)b.x=W;if(b.x>W)b.x=0;if(b.y<0)b.y=H;if(b.y>H)b.y=0;
        const ang=Math.atan2(b.vy,b.vx);
        x.save();x.translate(b.x,b.y);x.rotate(ang);
        x.fillStyle=n>3?'#00e0c6':'#7b5cff';
        x.beginPath();x.moveTo(6,0);x.lineTo(-4,3);x.lineTo(-4,-3);x.closePath();x.fill();
        x.restore();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
