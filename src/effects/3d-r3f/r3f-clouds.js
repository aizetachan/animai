import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-clouds', title:'Drei Clouds', cat:'3D / R3F',
  tags:['3d','r3f','drei','clouds','nubes','volumétrico','atmósfera'],
  desc:'Nubes volumétricas con <Cloud> de drei. Atmósfera soñadora para heros y fondos etéreos.',
  meta:['@react-three/drei','<Clouds>','Volumétrico'],
  prompt:`Añade nubes volumétricas con <Clouds> y <Cloud> de @react-three/drei.
<Cloud segments={40} bounds={[10,2,2]} volume={10} color="#7b5cff" />. Usa material MeshBasicMaterial internamente; ajusta opacity, growth y speed.
Combínalo con luz suave y fog para una atmósfera etérea. Perfecto para landings de bienestar, música ambient o IA "soñadora".`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={1} />
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={40} bounds={[10, 2, 2]} volume={10}
          color="#7b5cff" opacity={0.5} speed={0.2} />
        <Cloud seed={2} bounds={[8, 2, 2]} volume={8}
          color="#00e0c6" opacity={0.3} speed={0.3} />
      </Clouds>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const puffs=[];for(let i=0;i<28;i++)puffs.push({x:Math.random(),y:.3+Math.random()*.5,r:20+Math.random()*40,sp:.0003+Math.random()*.0006,c:Math.random()>.5?'123,92,255':'0,224,198',a:.05+Math.random()*.12});
    let raf,run=true;
    (function loop(){if(!run)return;x.fillStyle='#0a0a16';x.fillRect(0,0,o.W(),o.H());x.globalCompositeOperation='lighter';
      puffs.forEach(p=>{p.x+=p.sp;if(p.x>1.2)p.x=-.2;const px=p.x*o.W(),py=p.y*o.H();const g=x.createRadialGradient(px,py,0,px,py,p.r);g.addColorStop(0,'rgba('+p.c+','+p.a+')');g.addColorStop(1,'rgba('+p.c+',0)');x.fillStyle=g;x.beginPath();x.arc(px,py,p.r,0,6.28);x.fill();});
      x.globalCompositeOperation='source-over';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
