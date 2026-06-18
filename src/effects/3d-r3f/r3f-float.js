import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-float', title:'Drei Float', cat:'3D / R3F',
  tags:['3d','r3f','drei','float','flotar','idle','suave'],
  desc:'Objetos que flotan suavemente en el aire con el helper <Float> de drei. Idle elegante para mockups 3D.',
  meta:['@react-three/drei','<Float>','Idle'],
  prompt:`Usa el helper <Float> de @react-three/drei para que un objeto 3D flote con movimiento idle natural.
npm install @react-three/drei. Envuelve tu mesh en <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>.
Combínalo con <Environment preset="city"> de drei para iluminación realista. Ideal para presentar un producto o logo 3D que respira.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Environment preset="city" />
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#7b5cff" roughness={0.2} metalness={0.6} />
        </mesh>
      </Float>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    const V=[[0,1,0],[0.89,0.45,0],[0.28,0.45,0.85],[-0.72,0.45,0.53],[-0.72,0.45,-0.53],[0.28,0.45,-0.85],[0.72,-0.45,0.53],[-0.28,-0.45,0.85],[-0.89,-0.45,0],[-0.28,-0.45,-0.85],[0.72,-0.45,-0.53],[0,-1,0]];
    (function loop(){if(!run)return;t+=.016;const cx=o.W()/2,cy=o.H()/2+Math.sin(t*1.5)*10,sz=Math.min(o.W(),o.H())*.3,ang=t*.5,tilt=Math.sin(t*.8)*.3;
      const ca=Math.cos(ang),sa=Math.sin(ang),cb=Math.cos(tilt),sb=Math.sin(tilt);
      x.clearRect(0,0,o.W(),o.H());
      const pr=V.map(([X,Y,Z])=>{let x1=X*ca-Z*sa,z1=X*sa+Z*ca;let y1=Y*cb-z1*sb,z2=Y*sb+z1*cb;const f=3/(3+z2);return[cx+x1*sz*f,cy+y1*sz*f,z2];});
      pr.forEach((p,i)=>{const a=Math.max(.2,Math.min(1,.6-p[2]*.3));x.fillStyle='rgba(123,92,255,'+a+')';x.beginPath();x.arc(p[0],p[1],4,0,6.28);x.fill();
        for(let j=i+1;j<pr.length;j++){const d=Math.hypot(p[0]-pr[j][0],p[1]-pr[j][1]);if(d<sz*1.05){x.strokeStyle='rgba(0,224,198,'+(1-d/(sz*1.05))*.4+')';x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(pr[j][0],pr[j][1]);x.stroke();}}});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
