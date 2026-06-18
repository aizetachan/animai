import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'particle-field', title:'3D Particle Field', cat:'Partículas',
  tags:['partículas','3d','puntos','constelación','fondo','depth'],
  desc:'Campo de puntos proyectado en 3D que rota y reacciona al ratón. El fondo "constelación" bien hecho, sin Three.js.',
  meta:['Canvas 2D','Proyección 3D','~1400 pts'],
  prompt:`Campo de partículas 3D. Puedes usar Three.js (THREE.Points, ~3000 partículas en volumen esférico) o,
si quieres cero dependencias, proyección perspectiva manual en canvas 2D: array de puntos {x,y,z}, rota en Y/X cada frame,
proyecta con factor = fov/(fov+z), dibuja radio y alpha en función de z. Parallax de cámara hacia el ratón con lerp.
Material aditivo, color de acento. Pausa fuera de viewport.`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=1400,pts=[];for(let i=0;i<N;i++){const th=Math.random()*6.283,ph=Math.acos(2*Math.random()-1),r=120+Math.random()*60;pts.push({x:r*Math.sin(ph)*Math.cos(th),y:r*Math.sin(ph)*Math.sin(th),z:r*Math.cos(ph)});}
    let ry=0,rx=0,mx=0,my=0,raf,run=true;
    el.onmousemove=e=>{const b=el.getBoundingClientRect();mx=(e.clientX-b.left)/o.W()-.5;my=(e.clientY-b.top)/o.H()-.5;};
    (function loop(){if(!run)return;ry+=.004;rx+=.0015;const tx=mx*.5,ty=my*.5;const cx=o.W()/2,cy=o.H()/2,fov=260;
      x.clearRect(0,0,o.W(),o.H());x.globalCompositeOperation='lighter';
      const cy1=Math.cos(ry),sy=Math.sin(ry),cx1=Math.cos(rx),sx=Math.sin(rx);
      for(const p of pts){let X=p.x*cy1-p.z*sy,Z=p.x*sy+p.z*cy1,Y=p.y*cx1-Z*sx;Z=p.y*sx+Z*cx1;
        const s=fov/(fov+Z+200);if(s<=0)continue;const px=cx+(X-tx*120)*s,py=cy+(Y-ty*120)*s,a=Math.max(0,Math.min(1,(s-.3)*1.6));
        x.fillStyle='rgba('+(Z>0?123:170)+',108,255,'+a+')';x.beginPath();x.arc(px,py,s*1.7,0,6.283);x.fill();}
      x.globalCompositeOperation='source-over';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
