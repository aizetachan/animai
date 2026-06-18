import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-box', title:'R3F Spinning Box', cat:'3D / R3F',
  tags:['3d','r3f','three','react','cubo','hover','interactivo'],
  desc:'El "hola mundo" de React Three Fiber: una malla que gira, escala al click y cambia de color al hover.',
  meta:['@react-three/fiber','useFrame','JSX'],
  prompt:`Escena base de React Three Fiber (renderer de React para three.js).
npm install three @react-three/fiber. Monta un <Canvas> con luces (ambientLight + spotLight) y un componente <mesh> con boxGeometry + meshStandardMaterial.
Usa useFrame para rotarlo cada frame, useState para hover/active, y eventos onPointerOver/onClick. Cambia color en hover y scale en active.`,
  code:`// npm install three @react-three/fiber
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

function Box(props) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((_, delta) => (ref.current.rotation.x += delta))
  return (
    <mesh {...props} ref={ref} scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#00e0c6' : '#7b5cff'} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Box position={[0, 0, 0]} />
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    // cubo isométrico que gira (proyección manual) imitando el resultado de R3F
    let ang=0,raf,run=true,hover=false,scale=1,target=1;
    el.onmouseenter=()=>hover=true;el.onmouseleave=()=>hover=false;
    el.onclick=()=>{target=target>1?1:1.4;};
    const V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const F=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];
    (function loop(){if(!run)return;ang+=.012;scale+=(target-scale)*.1;const cx=o.W()/2,cy=o.H()/2,sz=Math.min(o.W(),o.H())*.22*scale;
      const ca=Math.cos(ang),sa=Math.sin(ang),cb=Math.cos(.5),sb=Math.sin(.5);
      const pr=V.map(([X,Y,Z])=>{let x1=X*ca-Z*sa,z1=X*sa+Z*ca;let y1=Y*cb-z1*sb,z2=Y*sb+z1*cb;const f=3/(3+z2);return[cx+x1*sz*f,cy+y1*sz*f,z2];});
      x.clearRect(0,0,o.W(),o.H());
      const col=hover?'0,224,198':'123,92,255';
      F.map(f=>({f,z:(pr[f[0]][2]+pr[f[1]][2]+pr[f[2]][2]+pr[f[3]][2])/4})).sort((a,b)=>b.z-a.z).forEach(({f,z})=>{
        x.beginPath();x.moveTo(pr[f[0]][0],pr[f[0]][1]);for(let i=1;i<4;i++)x.lineTo(pr[f[i]][0],pr[f[i]][1]);x.closePath();
        const sh=Math.max(.25,Math.min(1,.7-z*.18));x.fillStyle='rgba('+col+','+sh+')';x.fill();x.strokeStyle='rgba(255,255,255,.15)';x.stroke();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
