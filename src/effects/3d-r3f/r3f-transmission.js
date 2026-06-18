import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-transmission', title:'Glass Transmission', cat:'3D / R3F',
  tags:['3d','r3f','drei','glass','cristal','transmission','refracción','vidrio'],
  desc:'Cristal real con refracción y aberración cromática usando <MeshTransmissionMaterial> de drei. El vidrio premium 3D.',
  meta:['@react-three/drei','MeshTransmissionMaterial','Refracción'],
  prompt:`Crea un objeto de cristal físicamente realista con <MeshTransmissionMaterial> de @react-three/drei.
Props clave: transmission={1}, thickness, roughness, chromaticAberration (~0.03), distortion, temporalDistortion.
Necesita un <Environment> detrás para que el cristal tenga qué refractar. Úsalo para logos de cristal, joyas, botellas o decoración premium de hero.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment, Float } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <Environment preset="city" />
      <Float speed={1.5} rotationIntensity={2}>
        <mesh>
          <torusGeometry args={[1, 0.4, 32, 64]} />
          <MeshTransmissionMaterial
            transmission={1} thickness={0.5} roughness={0.1}
            chromaticAberration={0.06} distortion={0.2}
            temporalDistortion={0.1} ior={1.5} />
        </mesh>
      </Float>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.014;const cx=o.W()/2,cy=o.H()/2+Math.sin(t)*5,R=Math.min(o.W(),o.H())*.3;
      // fondo "environment" para refractar
      const bg=x.createLinearGradient(0,0,o.W(),o.H());bg.addColorStop(0,'#1a1330');bg.addColorStop(.5,'#3a2a7a');bg.addColorStop(1,'#0a0a12');x.fillStyle=bg;x.fillRect(0,0,o.W(),o.H());
      for(let i=0;i<5;i++){x.fillStyle='rgba(123,92,255,.08)';x.beginPath();x.arc((i*o.W()/4),o.H()*.3,30,0,6.28);x.fill();}
      // toro de cristal: anillo con aberración cromática
      const rot=t*.6;for(let ch=0;ch<3;ch++){const off=(ch-1)*3;const cols=['255,90,168','0,224,198','123,92,255'];x.strokeStyle='rgba('+cols[ch]+',.5)';x.lineWidth=R*.36;x.beginPath();
        for(let a=0;a<=64;a++){const ang=a/64*6.283;const rr=R*(1+Math.sin(ang*2+rot)*.04);const px=cx+Math.cos(ang)*rr+off,py=cy+Math.sin(ang)*rr*.7+off;a===0?x.moveTo(px,py):x.lineTo(px,py);}x.stroke();}
      // highlight de cristal
      x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(cx-R*.3,cy-R*.25,R*.16,R*.07,-.5,0,6.28);x.fill();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
