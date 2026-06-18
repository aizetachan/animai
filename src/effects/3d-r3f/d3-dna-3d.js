import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-dna-3d', title:'DNA Strand 3D', cat:'3D / R3F',
  tags:['dna','adn','hélice','helix','doble','biotech','3d','base-pairs'],
  desc:'Una doble hélice de ADN 3D que rota sobre su eje, con esferas en las hebras y pares de bases conectores.',
  meta:['three.js','Helix','Base pairs'],
  prompt:`Crea una doble hélice de ADN 3D rotando sobre el eje vertical.
Algoritmo: a lo largo de y (de -1 a 1) coloca dos hebras desfasadas π: hebra A en (cos(θ), y, sin(θ)) y hebra B en (cos(θ+π), y, sin(θ+π)), con θ = y·vueltas + tiempo. Conecta cada par con un "peldaño" (base pair). Rota toda la estructura, proyecta en perspectiva y dibuja por profundidad (painter): peldaños primero, luego esferas con radio y brillo según z; las hebras alternan colores #7b5cff / #00e0c6.
En producción usa instancedMesh de esferas + cilindros en three/R3F y anima la fase en useFrame.
Para secciones biotech, ciencia, salud o heros tecnológicos.`,
  code:`// npm install three @react-three/fiber
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function DNA() {
  const ref = useRef()
  useFrame((_, d) => { ref.current.rotation.y += d*0.6 })
  const n = 24
  return (
    <group ref={ref}>
      {Array.from({ length: n }).map((_, i) => {
        const y = (i / (n - 1) - 0.5) * 4
        const a = i * 0.5
        const A = [Math.cos(a), y, Math.sin(a)]
        const B = [Math.cos(a + Math.PI), y, Math.sin(a + Math.PI)]
        return (
          <group key={i}>
            <mesh position={A}><sphereGeometry args={[0.12]} /><meshStandardMaterial color="#7b5cff" /></mesh>
            <mesh position={B}><sphereGeometry args={[0.12]} /><meshStandardMaterial color="#00e0c6" /></mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <ambientLight /><pointLight position={[5, 5, 5]} />
      <DNA />
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let ph=0,raf,run=true;const N=26,TURNS=3.2;
    (function loop(){if(!run)return;ph+=.02;
      const cx=o.W()/2,cy=o.H()/2,scX=Math.min(o.W(),o.H())*.32,scY=o.H()*.42;
      x.fillStyle='#06070f';x.fillRect(0,0,o.W(),o.H());
      const nodes=[];
      for(let i=0;i<N;i++){const fy=i/(N-1)-.5;const y=fy*2;const th=fy*TURNS*6.283+ph;
        const ax=Math.cos(th),az=Math.sin(th);const bx=Math.cos(th+Math.PI),bz=Math.sin(th+Math.PI);
        nodes.push({y,ax,az,bx,bz,i});}
      const proj=(px,py,pz)=>{const sc=4/(4.5+pz);return{x:cx+px*scX*sc,y:cy-py*scY,z:pz,r:sc};};
      // recolecta peldaños y esferas, ordena por z global
      const items=[];
      nodes.forEach(n=>{const A=proj(n.ax,n.y,n.az),B=proj(n.bx,n.y,n.bz);
        items.push({type:'rung',A,B,z:(A.z+B.z)/2,i:n.i});
        items.push({type:'ball',p:A,z:A.z,col:'123,92,255'});
        items.push({type:'ball',p:B,z:B.z,col:'0,224,198'});});
      items.sort((a,b)=>a.z-b.z);
      items.forEach(it=>{
        if(it.type==='rung'){const dep=(it.A.z+it.B.z)/2;const al=.25+(dep+4)/8*.4;
          x.strokeStyle=(it.i%2?'rgba(255,209,102,':'rgba(180,180,255,')+al+')';x.lineWidth=1+ (it.A.r+it.B.r);
          x.beginPath();x.moveTo(it.A.x,it.A.y);x.lineTo(it.B.x,it.B.y);x.stroke();
        } else {const p=it.p;const dep=(p.z+4)/8;const rad=3+p.r*6;
          const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,rad);g.addColorStop(0,'rgba('+it.col+','+(.5+dep*.5)+')');g.addColorStop(1,'rgba('+it.col+',0)');
          x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,rad,0,6.28);x.fill();
          x.fillStyle='rgba('+it.col+','+(.7+dep*.3)+')';x.beginPath();x.arc(p.x,p.y,rad*.45,0,6.28);x.fill();}
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
