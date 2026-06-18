import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-stars', title:'Drei Stars Field', cat:'3D / R3F',
  tags:['3d','r3f','drei','stars','estrellas','espacio','fondo'],
  desc:'Campo estelar 3D con rotación con <Stars> de drei. Fondo espacial instantáneo en una línea.',
  meta:['@react-three/drei','<Stars>','1 línea'],
  prompt:`Fondo de estrellas 3D con una sola línea usando <Stars> de @react-three/drei.
<Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />.
Gíralo lentamente con useFrame o <OrbitControls autoRotate>. Es el fondo espacial más rápido de montar para un hero. Pon <color attach="background"> oscuro detrás.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <color attach="background" args={['#05050f']} />
      <Stars radius={100} depth={50} count={5000}
        factor={4} saturation={0} fade speed={1} />
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=600,st=[];for(let i=0;i<N;i++){const th=Math.random()*6.283,ph=Math.acos(2*Math.random()-1),r=60+Math.random()*120;st.push({x:r*Math.sin(ph)*Math.cos(th),y:r*Math.sin(ph)*Math.sin(th),z:r*Math.cos(ph)});}
    let ry=0,raf,run=true;
    (function loop(){if(!run)return;ry+=.0015;const cx=o.W()/2,cy=o.H()/2,fov=200,ca=Math.cos(ry),sa=Math.sin(ry);
      x.fillStyle='#05050f';x.fillRect(0,0,o.W(),o.H());
      for(const p of st){const X=p.x*ca-p.z*sa,Z=p.x*sa+p.z*ca;const f=fov/(fov+Z+140);if(f<=0)continue;const px=cx+X*f,py=cy+p.y*f,a=Math.max(0,Math.min(1,(f-.4)*1.8));x.fillStyle='rgba(255,255,255,'+a+')';x.beginPath();x.arc(px,py,f*1.1,0,6.28);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
