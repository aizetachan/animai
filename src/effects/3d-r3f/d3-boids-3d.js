import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-boids-3d', title:'Boids Flocking 3D', cat:'3D / R3F',
  tags:['boids','flocking','bandada','enjambre','swarm','perspectiva','reynolds'],
  desc:'Una bandada de boids vuela en 3D con cohesión, separación y alineación, proyectada en perspectiva.',
  meta:['canvas','boids','flocking'],
  prompt:`Implementa el algoritmo de Boids de Reynolds en 3D. Cada boid tiene posición y velocidad (vec3) y aplica tres reglas sobre sus vecinos dentro de un radio:
1) Separación: huir de vecinos muy cercanos. 2) Alineación: igualar la velocidad media de los vecinos. 3) Cohesión: dirigirse al centro de masa de los vecinos.
Suma las tres fuerzas (con pesos), limita la velocidad máxima y envuelve las posiciones dentro de un cubo. En three.js renderiza cada boid como un cono/instancia orientado a su velocidad.
Para la preview se proyecta cada boid con perspectiva 1/(z) sobre canvas 2D, ordenando por profundidad y escalando el tamaño con la cercanía. Parámetros: nº de boids, radio de percepción, pesos de cada regla, velocidad máxima.`,
  code:`// Boids 3D — reglas de Reynolds
function flock(b, boids){
  const sep=[0,0,0], ali=[0,0,0], coh=[0,0,0]; let n=0
  for(const o of boids){ if(o===b) continue
    const dx=o.x-b.x, dy=o.y-b.y, dz=o.z-b.z
    const d=Math.hypot(dx,dy,dz); if(d>PERCEPTION) continue
    n++
    if(d<SEP_DIST){ sep[0]-=dx/d; sep[1]-=dy/d; sep[2]-=dz/d }
    ali[0]+=o.vx; ali[1]+=o.vy; ali[2]+=o.vz
    coh[0]+=o.x;  coh[1]+=o.y;  coh[2]+=o.z
  }
  if(n>0){
    b.vx += sep[0]*1.5 + (ali[0]/n - b.vx)*0.05 + ((coh[0]/n)-b.x)*0.005
    b.vy += sep[1]*1.5 + (ali[1]/n - b.vy)*0.05 + ((coh[1]/n)-b.y)*0.005
    b.vz += sep[2]*1.5 + (ali[2]/n - b.vz)*0.05 + ((coh[2]/n)-b.z)*0.005
  }
  // limitar velocidad + integrar + wrap dentro del cubo
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=70,R=2.0,boids=[];
    const rnd=(a,b)=>a+Math.random()*(b-a);
    for(let i=0;i<N;i++)boids.push({x:rnd(-R,R),y:rnd(-R,R),z:rnd(-R,R),vx:rnd(-.02,.02),vy:rnd(-.02,.02),vz:rnd(-.02,.02)});
    const PERC=1.1,SEP=.5,MAX=.045;
    let rot=0,raf,run=true;
    (function loop(){if(!run)return;
      const W=o.W(),H=o.H();rot+=.004;
      x.fillStyle='#070710';x.fillRect(0,0,W,H);
      for(const b of boids){
        let sx=0,sy=0,sz=0,ax=0,ay=0,az=0,cx2=0,cy2=0,cz2=0,n=0;
        for(const ot of boids){if(ot===b)continue;
          const dx=ot.x-b.x,dy=ot.y-b.y,dz=ot.z-b.z,d=Math.hypot(dx,dy,dz)||.001;
          if(d>PERC)continue;n++;
          if(d<SEP){sx-=dx/d;sy-=dy/d;sz-=dz/d;}
          ax+=ot.vx;ay+=ot.vy;az+=ot.vz;cx2+=ot.x;cy2+=ot.y;cz2+=ot.z;}
        if(n>0){
          b.vx+=sx*.02+(ax/n-b.vx)*.05+((cx2/n)-b.x)*.004;
          b.vy+=sy*.02+(ay/n-b.vy)*.05+((cy2/n)-b.y)*.004;
          b.vz+=sz*.02+(az/n-b.vz)*.05+((cz2/n)-b.z)*.004;}
        // atracción suave al centro para que no se dispersen
        b.vx-=b.x*.0008;b.vy-=b.y*.0008;b.vz-=b.z*.0008;
        const sp=Math.hypot(b.vx,b.vy,b.vz)||.001;if(sp>MAX){b.vx=b.vx/sp*MAX;b.vy=b.vy/sp*MAX;b.vz=b.vz/sp*MAX;}
        b.x+=b.vx;b.y+=b.vy;b.z+=b.vz;
      }
      const cr=Math.cos(rot),sr=Math.sin(rot),cx=W/2,cy=H/2,sc=Math.min(W,H)*.34;
      const proj=boids.map(b=>{const xx=b.x*cr-b.z*sr,zz=b.x*sr+b.z*cr;const persp=3/(3+zz+R);
        return{sx:cx+xx*sc*persp,sy:cy+b.y*sc*persp,z:zz,persp,
          vx:b.vx*cr-b.vz*sr,vy:b.vy};}).sort((a,b)=>a.z-b.z);
      proj.forEach(p=>{
        const ang=Math.atan2(p.vy,p.vx),s=2.4*p.persp;
        const col=p.z<0?'0,224,198':'123,92,255';
        x.fillStyle='rgba('+col+','+(.45+p.persp*.4)+')';
        x.beginPath();
        x.moveTo(p.sx+Math.cos(ang)*s*1.8,p.sy+Math.sin(ang)*s*1.8);
        x.lineTo(p.sx+Math.cos(ang+2.5)*s,p.sy+Math.sin(ang+2.5)*s);
        x.lineTo(p.sx+Math.cos(ang-2.5)*s,p.sy+Math.sin(ang-2.5)*s);
        x.closePath();x.fill();
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
