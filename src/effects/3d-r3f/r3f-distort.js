import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-distort', title:'Distort Material', cat:'3D / R3F',
  tags:['3d','r3f','drei','distort','blob','material','organico'],
  desc:'Esfera orgánica que se deforma como gel con <MeshDistortMaterial> de drei. El blob 3D de moda.',
  meta:['@react-three/drei','MeshDistortMaterial','Noise'],
  prompt:`Crea un blob orgánico animado con <MeshDistortMaterial> de @react-three/drei sobre una esfera de alta resolución.
<sphereGeometry args={[1, 64, 64]} /> + <MeshDistortMaterial distort={0.5} speed={2} color="#7b5cff" />.
Envuélvelo en <Float> para que además flote. Es el "blob gradiente 3D" típico de landings de IA/SaaS. Añade <Environment> para reflejos.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <Environment preset="sunset" />
      <Float speed={2} floatIntensity={1.5}>
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial distort={0.5} speed={2}
            color="#7b5cff" roughness={0.1} metalness={0.4} />
        </mesh>
      </Float>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;const cx=o.W()/2,cy=o.H()/2+Math.sin(t)*6,R=Math.min(o.W(),o.H())*.3;
      x.clearRect(0,0,o.W(),o.H());
      const g=x.createRadialGradient(cx-R*.3,cy-R*.3,R*.1,cx,cy,R*1.3);g.addColorStop(0,'#9d86ff');g.addColorStop(.6,'#7b5cff');g.addColorStop(1,'#3a2a7a');
      x.fillStyle=g;x.beginPath();const n=60;
      for(let i=0;i<=n;i++){const a=i/n*6.283;const def=1+Math.sin(a*3+t*2)*.12+Math.sin(a*5-t*1.5)*.08+Math.cos(a*2+t)*.06;const r=R*def;const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i===0?x.moveTo(px,py):x.lineTo(px,py);}
      x.closePath();x.fill();
      x.fillStyle='rgba(255,255,255,.25)';x.beginPath();x.arc(cx-R*.35,cy-R*.35,R*.18,0,6.28);x.fill();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
