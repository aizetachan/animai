import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-trail', title:'Drei Trail', cat:'3D / R3F',
  tags:['3d','r3f','drei','trail','estela','rastro','movimiento'],
  desc:'Estela luminosa que sigue a un objeto en movimiento con <Trail> de drei. Cometas y partículas con rastro.',
  meta:['@react-three/drei','<Trail>','Estela'],
  prompt:`Añade una estela a un objeto en movimiento con <Trail> de @react-three/drei.
<Trail width={1} length={6} color="#00e0c6" attenuation={(w)=>w}> envuelve el mesh que se mueve (anímalo en órbita con useFrame).
Crea cometas, cursores 3D o partículas guía con rastro luminoso. Sube el length para estelas más largas.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas, useFrame } from '@react-three/fiber'
import { Trail, Float } from '@react-three/drei'
import { useRef } from 'react'

function Comet() {
  const ref = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    ref.current.position.set(Math.sin(t) * 2, Math.cos(t * 1.5) * 1, 0)
  })
  return (
    <Trail width={1.5} length={6} color="#00e0c6" attenuation={(w) => w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#00e0c6" toneMapped={false} />
      </mesh>
    </Trail>
  )
}

export default function App() {
  return <Canvas><Comet /></Canvas>
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;const trail=[];
    (function loop(){if(!run)return;t+=.03;x.fillStyle='rgba(7,7,13,.25)';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.3;const px=cx+Math.sin(t)*R,py=cy+Math.cos(t*1.5)*R*.6;
      trail.push({x:px,y:py});if(trail.length>26)trail.shift();
      x.globalCompositeOperation='lighter';trail.forEach((p,i)=>{const k=i/trail.length;x.fillStyle='rgba(0,224,198,'+k*.6+')';x.beginPath();x.arc(p.x,p.y,k*6,0,6.28);x.fill();});
      x.fillStyle='#7ffff0';x.beginPath();x.arc(px,py,5,0,6.28);x.fill();x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
