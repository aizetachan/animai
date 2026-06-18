import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-cloth', title:'Cloth Simulation', cat:'3D / R3F',
  tags:['tela','bandera','cloth','verlet','simulación','física','flag'],
  desc:'Una bandera de tela 3D ondea al viento simulada con integración de Verlet y restricciones de distancia.',
  meta:['Verlet','cloth','física'],
  prompt:`Simula una tela/bandera con física de Verlet sobre una rejilla de partículas (cols x rows).
Cada partícula guarda su posición actual y la anterior; integra con Verlet: nuevaPos = pos + (pos - posPrev) * damping + aceleración*dt². La aceleración incluye gravedad y una fuerza de viento oscilante (seno del tiempo + offset por columna) sobre el eje Z.
Conecta vecinos (derecha y abajo) con restricciones de distancia (constraints): en varias iteraciones, corrige las posiciones para mantener la distancia de reposo. Fija (pin) la columna izquierda al mástil.
Proyecta los puntos 3D a 2D con perspectiva simple (factor = f/(f+z)) y dibuja la malla como quads sombreados según su profundidad. Ideal para banderas, capas o telas interactivas en R3F.`,
  code:`// Cloth — integración de Verlet + restricciones de distancia
const GRAV = {x:0, y:0.4, z:0}
function integrate(p, dt){
  const vx=(p.x-p.px)*0.98, vy=(p.y-p.py)*0.98, vz=(p.z-p.pz)*0.98
  p.px=p.x; p.py=p.y; p.pz=p.z
  p.x += vx + GRAV.x*dt*dt
  p.y += vy + GRAV.y*dt*dt
  p.z += vz + wind(p)*dt*dt   // viento oscilante en Z
}
function satisfy(a, b, rest){           // restricción de distancia
  const dx=b.x-a.x, dy=b.y-a.y, dz=b.z-a.z
  const d=Math.hypot(dx,dy,dz)||1e-6, diff=(d-rest)/d*0.5
  if(!a.pin){a.x+=dx*diff; a.y+=dy*diff; a.z+=dz*diff}
  if(!b.pin){b.x-=dx*diff; b.y-=dy*diff; b.z-=dz*diff}
}
// cada frame: integrate(todas) ; for(k iters) satisfy(todas las constraints)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const COLS=14, ROWS=10, REST=1, ITER=4;
    const pts=[];
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
      const px=c*REST, py=r*REST;
      pts.push({x:px,y:py,z:0,px:px,py:py,pz:0,pin:c===0});
    }
    const cons=[];
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
      const i=r*COLS+c;
      if(c<COLS-1)cons.push([i,i+1,REST]);
      if(r<ROWS-1)cons.push([i,i+COLS,REST]);
    }
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=1;
      const W=o.W(),H=o.H();
      // física
      for(const p of pts){
        if(p.pin)continue;
        const vx=(p.x-p.px)*0.98,vy=(p.y-p.py)*0.98,vz=(p.z-p.pz)*0.96;
        p.px=p.x;p.py=p.y;p.pz=p.z;
        const col=p.x;
        const wind=Math.sin(t*0.05+col*0.6)*0.5+Math.sin(t*0.09)*0.25;
        p.x+=vx; p.y+=vy+0.012; p.z+=vz+wind*0.04;
      }
      for(let k=0;k<ITER;k++)for(const cn of cons){
        const a=pts[cn[0]],b=pts[cn[1]],rest=cn[2];
        const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
        const d=Math.hypot(dx,dy,dz)||1e-6,diff=(d-rest)/d*0.5;
        if(!a.pin){a.x+=dx*diff;a.y+=dy*diff;a.z+=dz*diff;}
        if(!b.pin){b.x-=dx*diff;b.y-=dy*diff;b.z-=dz*diff;}
      }
      // render
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const sc=Math.min(W/(COLS*REST),H/(ROWS*REST))*0.78;
      const offx=W*0.18,offy=H*0.22,f=6;
      function proj(p){const persp=f/(f+p.z);return[offx+p.x*sc*persp,offy+p.y*sc*persp];}
      for(let r=0;r<ROWS-1;r++)for(let c=0;c<COLS-1;c++){
        const p0=pts[r*COLS+c],p1=pts[r*COLS+c+1],p2=pts[(r+1)*COLS+c+1],p3=pts[(r+1)*COLS+c];
        const a0=proj(p0),a1=proj(p1),a2=proj(p2),a3=proj(p3);
        const zavg=(p0.z+p1.z+p2.z+p3.z)*0.25;
        const lum=0.55+Math.max(-0.4,Math.min(0.4,zavg*0.18));
        const useTeal=((r+c)%2)===0;
        const base=useTeal?[0,224,198]:[123,92,255];
        x.fillStyle='rgba('+Math.round(base[0]*lum)+','+Math.round(base[1]*lum)+','+Math.round(base[2]*lum)+',0.92)';
        x.beginPath();x.moveTo(a0[0],a0[1]);x.lineTo(a1[0],a1[1]);x.lineTo(a2[0],a2[1]);x.lineTo(a3[0],a3[1]);x.closePath();x.fill();
        x.strokeStyle='rgba(255,255,255,0.06)';x.lineWidth=0.5;x.stroke();
      }
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
