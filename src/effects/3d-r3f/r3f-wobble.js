import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-wobble', title:'Wobble Material', cat:'3D / R3F',
  tags:['3d','r3f','drei','wobble','jelly','gelatina','deformar'],
  desc:'Sólido que se menea como gelatina con <MeshWobbleMaterial> de drei. Más rígido y rítmico que el distort.',
  meta:['@react-three/drei','MeshWobbleMaterial','Jelly'],
  prompt:`Usa <MeshWobbleMaterial factor={1} speed={2}> de @react-three/drei sobre una geometría para darle un meneo tipo gelatina.
A diferencia de MeshDistortMaterial (ruido orgánico), el wobble deforma con ondas más regulares y rítmicas.
Bueno para mascotas/blobs juguetones, botones 3D o elementos lúdicos de marca.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { MeshWobbleMaterial, Environment } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <Environment preset="dawn" />
      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <MeshWobbleMaterial factor={0.6} speed={2}
          color="#00e0c6" roughness={0.3} metalness={0.2} />
      </mesh>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.03;const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.3;
      x.clearRect(0,0,o.W(),o.H());x.fillStyle='#0e1116';x.fillRect(0,0,o.W(),o.H());
      x.fillStyle='#00e0c6';x.beginPath();const n=48;
      for(let i=0;i<=n;i++){const a=i/n*6.283;const wob=1+Math.sin(a*4+t*2)*.14*Math.sin(t);const r=R*wob;const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i===0?x.moveTo(px,py):x.lineTo(px,py);}
      x.closePath();x.fill();
      x.fillStyle='rgba(255,255,255,.2)';x.beginPath();x.arc(cx-R*.3,cy-R*.3,R*.2,0,6.28);x.fill();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
