import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-points-waves', title:'Points Waves', cat:'3D / R3F',
  tags:['puntos','onda','wave','rejilla','grid','seno','points'],
  desc:'Una rejilla de puntos 3D recorrida por una onda senoidal radial, vista en perspectiva isométrica.',
  meta:['Points','sin wave','grid'],
  prompt:`Crea una rejilla regular de puntos en el plano XZ (cols x rows). La altura Y de cada punto se calcula con una onda senoidal: y = sin(distancia_al_centro * freq - t*velocidad) * amplitud, opcionalmente combinando varias ondas para un efecto de interferencia.
Rota la rejilla a una vista isométrica (rotación sobre X e Y) y proyecta a 2D con perspectiva ligera. Dibuja cada punto con radio y brillo proporcionales a su altura y profundidad, interpolando el color entre violeta (valles) y turquesa (crestas).
En R3F: un BufferGeometry de Points con un vertex shader que desplaza la Y por sin(length(pos.xz)-time); barato y muy vistoso para fondos de hero.`,
  code:`// Points waves — desplazamiento senoidal de una rejilla (vertex shader)
const vertex = \`
  uniform float uTime;
  void main(){
    vec3 p = position;
    float d = length(p.xz);
    p.y = sin(d*2.0 - uTime*2.0) * 0.4 + sin(p.x*1.5 + uTime)*0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = 4.0;
  }\`
// JS equivalente para cada punto de la grid:
y = Math.sin(dist*freq - t*speed) * amp`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const COLS=22, ROWS=22;
    const ax=-0.62, ay=0.0; // rotación X (tilt), Y se anima
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=0.03;
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,sc=Math.min(W,H)*0.5,f=5;
      const cax=Math.cos(ax),sax=Math.sin(ax);
      const yrot=Math.sin(t*0.12)*0.5;
      const cay=Math.cos(yrot),say=Math.sin(yrot);
      const pts=[];
      for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
        let px=(c/(COLS-1))*2-1;
        let pz=(r/(ROWS-1))*2-1;
        const d=Math.hypot(px,pz);
        const h=Math.sin(d*4.0-t*2.0)*0.32+Math.sin(px*3.0+t)*0.08;
        // rotación Y
        let rx=px*cay-pz*say, rz=px*say+pz*cay, ry=h;
        // rotación X (tilt)
        let fy=ry*cax-rz*sax, fz=ry*sax+rz*cax;
        pts.push({x:rx,y:fy,z:fz,h});
      }
      pts.sort((a,b)=>a.z-b.z);
      for(const p of pts){
        const persp=f/(f+p.z+1.6);
        const sx=cx+p.x*sc*persp, sy=cy+p.y*sc*persp;
        const k=Math.max(0,Math.min(1,(p.h+0.4)/0.8));
        const cr=Math.round(123+(0-123)*k);
        const cg=Math.round(92+(224-92)*k);
        const cb=Math.round(255+(198-255)*k);
        const rad=Math.max(0.7,(1.4+k*1.6)*persp);
        x.fillStyle='rgba('+cr+','+cg+','+cb+','+(0.45+persp*0.5).toFixed(3)+')';
        x.beginPath();x.arc(sx,sy,rad,0,6.283);x.fill();
      }
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
