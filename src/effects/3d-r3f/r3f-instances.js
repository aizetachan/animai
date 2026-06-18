import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-instances', title:'Instanced Mesh', cat:'3D / R3F',
  tags:['3d','r3f','drei','instances','instancing','grid','performance'],
  desc:'Miles de objetos en una sola draw call con <Instances>/<Instance> de drei. Rejillas 3D performantes.',
  meta:['@react-three/drei','<Instances>','1 draw call'],
  prompt:`Renderiza cientos/miles de objetos 3D eficientemente con <Instances limit={1000}> e <Instance> de @react-three/drei.
Defines la geometría y material una vez; cada <Instance> ajusta position/scale/rotation/color y comparte la draw call.
useFrame puede animarlos en bloque (olas, grids reactivas). Esencial para campos de cubos, puntos de datos o fondos densos sin matar el rendimiento.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas, useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import { useRef } from 'react'

function Grid() {
  const items = []
  for (let x = -5; x <= 5; x++)
    for (let z = -5; z <= 5; z++) items.push([x, z])
  return (
    <Instances limit={items.length}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#7b5cff" />
      {items.map(([x, z], i) => <Cube key={i} x={x} z={z} />)}
    </Instances>
  )
}
function Cube({ x, z }) {
  const ref = useRef()
  useFrame((s) => {
    ref.current.position.y = Math.sin(s.clock.elapsedTime + x + z) * 0.5
  })
  return <Instance ref={ref} position={[x, 0, z]} />
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    const pts=[];for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++)pts.push({i,j});
    (function loop(){if(!run)return;t+=.03;x.clearRect(0,0,o.W(),o.H());x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2,sp=Math.min(o.W(),o.H())*.07;
      const cells=pts.map(p=>{const y=Math.sin(t+p.i*.5+p.j*.5)*.8;const iso_x=(p.i-p.j)*sp*.9,iso_y=(p.i+p.j)*sp*.5-y*sp;return{x:cx+iso_x,y:cy+iso_y,d:p.i+p.j,h:y};}).sort((a,b)=>a.d-b.d);
      cells.forEach(c=>{const a=Math.max(.3,Math.min(1,.7+c.h*.3));x.fillStyle='rgba(123,92,255,'+a+')';x.fillRect(c.x-sp*.35,c.y-sp*.35,sp*.7,sp*.7);x.strokeStyle='rgba(0,224,198,.3)';x.strokeRect(c.x-sp*.35,c.y-sp*.35,sp*.7,sp*.7);});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
