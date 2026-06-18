import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-torus-knot', title:'Torus Knot Spin', cat:'3D / R3F',
  tags:['torus','knot','nudo','toro','wireframe','3d','gradiente','girar'],
  desc:'Un nudo de toro 3D en wireframe que gira en el espacio con un gradiente vivo a lo largo de la curva.',
  meta:['three.js','TorusKnotGeometry','Wireframe'],
  prompt:`Crea un nudo de toro (torus knot) 3D en wireframe rotando.
Curva paramétrica (p=2,q=3): para t en [0,2π], r = cos(q·t)+2; x = r·cos(p·t); y = r·sin(p·t); z = -sin(q·t). Muestrea muchos puntos, rótalos con matrices YX y proyéctalos en perspectiva. Dibuja la polilínea con el color interpolado por t (gradiente HSL o entre #7b5cff y #00e0c6) y grosor según profundidad z.
En producción usa <mesh><torusKnotGeometry args={[1,0.3,128,16,2,3]} /> con material wireframe o MeshNormalMaterial y rota en useFrame.
Para loaders premium, logos abstractos o decoración hero hipnótica.`,
  code:`// npm install three @react-three/fiber
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function Knot() {
  const ref = useRef()
  useFrame((_, d) => { ref.current.rotation.x += d*0.3; ref.current.rotation.y += d*0.5 })
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
      <meshNormalMaterial wireframe />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Knot />
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let ry=0,raf,run=true;
    const p=2,q=3,STEP=240,pts=[];
    for(let i=0;i<=STEP;i++){const t=i/STEP*6.283;const r=Math.cos(q*t)+2.2;pts.push([r*Math.cos(p*t),r*Math.sin(p*t),-Math.sin(q*t)*1.4]);}
    (function loop(){if(!run)return;ry+=.012;const rx=.5+Math.sin(ry*.3)*.3;
      const cx=o.W()/2,cy=o.H()/2,sc=Math.min(o.W(),o.H())*.13;
      x.fillStyle='#070710';x.fillRect(0,0,o.W(),o.H());
      const cosY=Math.cos(ry),sinY=Math.sin(ry),cosX=Math.cos(rx),sinX=Math.sin(rx);
      const P=pts.map(v=>{let[a,b,c]=v;let z1=a*cosY-c*sinY,x1=a*sinY+c*cosY;let y2=b*cosX-z1*sinX,z2=b*sinX+z1*cosX;const pz=6/(7+z2);return{x:cx+x1*sc*pz,y:cy-y2*sc*pz,z:z2};});
      x.lineCap='round';
      for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];const tt=i/P.length;
        const h=Math.round(170+tt*120);const dep=(a.z+4)/8;
        x.strokeStyle='hsla('+h+',85%,'+(45+dep*25)+'%,'+(.5+dep*.5)+')';
        x.lineWidth=(.8+dep*2.6);x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
