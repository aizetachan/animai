import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-reflector', title:'Reflector Floor', cat:'3D / R3F',
  tags:['3d','r3f','drei','reflector','suelo','espejo','reflejo'],
  desc:'Suelo espejo que refleja la escena con <MeshReflectorMaterial> de drei. El piso pulido de los showrooms 3D.',
  meta:['@react-three/drei','MeshReflectorMaterial','Mirror'],
  prompt:`Crea un suelo reflectante con <MeshReflectorMaterial> de @react-three/drei sobre un <planeGeometry> rotado.
Props: mirror={0.75}, blur, mixBlur, mixStrength, roughness, depthScale para un reflejo realista y borroso.
Coloca tu objeto encima y un <Environment> para que haya algo que reflejar. Estética showroom/producto premium.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { MeshReflectorMaterial, Environment, Float } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 1, 5] }}>
      <Environment preset="night" />
      <Float><mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#00e0c6" metalness={0.8} roughness={0.1} />
      </mesh></Float>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial mirror={0.75} blur={[300, 100]}
          resolution={1024} mixBlur={1} mixStrength={1.5}
          roughness={0.4} depthScale={1} color="#101018" metalness={0.6} />
      </mesh>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;x.fillStyle='#0a0a12';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,horizon=o.H()*.55,R=Math.min(o.W(),o.H())*.16,by=horizon-R-10+Math.sin(t)*6;
      // objeto
      const g=x.createRadialGradient(cx-R*.3,by-R*.3,R*.1,cx,by,R);g.addColorStop(0,'#5ff5e2');g.addColorStop(1,'#00a892');x.fillStyle=g;x.beginPath();x.arc(cx,by,R,0,6.28);x.fill();
      // suelo
      const fg=x.createLinearGradient(0,horizon,0,o.H());fg.addColorStop(0,'#1a1a28');fg.addColorStop(1,'#0a0a12');x.fillStyle=fg;x.fillRect(0,horizon,o.W(),o.H()-horizon);
      // reflejo borroso
      x.save();x.globalAlpha=.4;x.scale(1,-1);x.filter='blur(3px)';const ry=-(horizon+(horizon-by));x.fillStyle=g;x.beginPath();x.arc(cx,ry,R,0,6.28);x.fill();x.restore();x.filter='none';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
