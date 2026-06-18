import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-fluid-particles', title:'GPU Fluid Particles', cat:'3D / R3F',
  tags:['partículas','fluido','flujo','3D','curl','noise','points'],
  desc:'Una nube de miles de partículas 3D fluye como un fluido siguiendo un campo de ruido curl rotado en el espacio.',
  meta:['Points','curl noise','3D'],
  prompt:`Crea una nube de partículas en 3D que se mueve como un fluido. Cada partícula tiene posición (x,y,z) y avanza siguiendo un campo de velocidad derivado de ruido tipo "curl noise": deriva dos ángulos del ruido en la posición y el tiempo, y úsalos como dirección de flujo 3D (esférica). Esto da un movimiento turbulento sin divergencia, parecido a humo o agua.
Reincorpora las partículas que salen del volumen reapareciendo por el lado opuesto (wrap). Rota toda la nube lentamente sobre Y y proyecta a 2D con perspectiva (factor f/(f+z)); colorea por profundidad (z>0 turquesa, z<0 violeta) y tamaño según cercanía.
En R3F se implementa con un shader sobre un BufferGeometry de Points o con FBO/GPGPU para miles de partículas a 60fps.`,
  code:`// Fluid particles — campo de velocidad tipo curl noise en 3D
function flow(p, t){
  const a = noise(p.x*0.6 + t, p.y*0.6, p.z*0.6) * Math.PI * 2   // azimut
  const b = noise(p.y*0.6, p.z*0.6 + t, p.x*0.6) * Math.PI       // inclinación
  return {
    x: Math.sin(b)*Math.cos(a),
    y: Math.cos(b),
    z: Math.sin(b)*Math.sin(a)
  }
}
useFrame((_, dt) => {
  for (let i=0;i<count;i++){
    const v = flow(particle[i], t)
    pos[i*3]   += v.x*speed; pos[i*3+1] += v.y*speed; pos[i*3+2] += v.z*speed
    // wrap dentro del volumen [-1,1]
  }
  geometry.attributes.position.needsUpdate = true
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=260, R=1.2;
    const ps=[];
    for(let i=0;i<N;i++)ps.push({x:(Math.random()*2-1)*R,y:(Math.random()*2-1)*R,z:(Math.random()*2-1)*R});
    function noise(a,b,c){
      return (Math.sin(a*1.7+b*0.9+c*1.3)+Math.cos(a*2.1-b*1.5+c*0.7)+Math.sin(b*1.1-c*2.3))*0.3333;
    }
    let t=0,rot=0,raf,run=true;
    (function loop(){if(!run)return;t+=0.008;rot+=0.004;
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,sc=Math.min(W,H)*0.32,f=4;
      const cr=Math.cos(rot),sr=Math.sin(rot);
      // ordenar por z para dibujar de atrás a adelante
      const drawn=[];
      for(const p of ps){
        const a=noise(p.x*0.7+t,p.y*0.7,p.z*0.7)*6.283;
        const b=noise(p.y*0.7,p.z*0.7+t,p.x*0.7)*3.141;
        const sb=Math.sin(b);
        p.x+=sb*Math.cos(a)*0.02; p.y+=Math.cos(b)*0.02; p.z+=sb*Math.sin(a)*0.02;
        if(p.x> R)p.x-=2*R; if(p.x<-R)p.x+=2*R;
        if(p.y> R)p.y-=2*R; if(p.y<-R)p.y+=2*R;
        if(p.z> R)p.z-=2*R; if(p.z<-R)p.z+=2*R;
        const xx=p.x*cr-p.z*sr, zz=p.x*sr+p.z*cr;
        drawn.push({xx,yy:p.y,zz});
      }
      drawn.sort((a,b)=>a.zz-b.zz);
      for(const d of drawn){
        const persp=f/(f+d.zz);
        const sx=cx+d.xx*sc*persp, sy=cy+d.yy*sc*persp;
        const rad=Math.max(0.6,1.8*persp);
        const front=d.zz>0;
        const alpha=0.35+persp*0.45;
        x.fillStyle=front?'rgba(0,224,198,'+alpha+')':'rgba(123,92,255,'+alpha+')';
        x.beginPath();x.arc(sx,sy,rad,0,6.283);x.fill();
      }
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
