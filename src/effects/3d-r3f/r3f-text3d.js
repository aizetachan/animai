import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-text3d', title:'Drei Text3D', cat:'3D / R3F',
  tags:['3d','r3f','drei','text3d','tipografía','extruido','titular'],
  desc:'Tipografía 3D extruida con <Text3D> de drei. Titulares con volumen, bisel y material propio.',
  meta:['@react-three/drei','<Text3D>','TextGeometry'],
  prompt:`Crea un titular 3D extruido con <Text3D> de @react-three/drei.
Requiere una fuente en JSON (typeface.json). Acepta props de TextGeometry (size, height, bevelEnabled) más lineHeight, letterSpacing y smooth propios de drei.
Centra con <Center>, dale cualquier material (meshNormalMaterial para arcoíris, o standard con metalness) y envuélvelo en <Float>. Para heros con marca con peso físico.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { Text3D, Center, Float } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <ambientLight intensity={1} />
      <pointLight position={[5, 5, 5]} intensity={2} />
      <Float rotationIntensity={0.4}>
        <Center>
          <Text3D font="/fonts/Inter_Bold.json"
            size={1.2} height={0.3} bevelEnabled bevelSize={0.02}
            letterSpacing={-0.03}>
            NAKAMA
            <meshStandardMaterial color="#7b5cff" metalness={0.6} roughness={0.2} />
          </Text3D>
        </Center>
      </Float>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;const txt='3D';
    (function loop(){if(!run)return;t+=.016;x.clearRect(0,0,o.W(),o.H());x.fillStyle='#0c0c16';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2,tilt=Math.sin(t)*.25,depth=14;
      x.textAlign='center';x.textBaseline='middle';const fs=Math.min(o.W(),o.H())*.5;x.font='800 '+fs+'px Inter,sans-serif';
      // extrusión: copias desplazadas en diagonal
      for(let i=depth;i>=0;i--){const k=i/depth;x.fillStyle='rgba('+Math.round(60+k*20)+','+Math.round(40+k*10)+','+Math.round(120+k*40)+',1)';x.save();x.translate(cx+Math.sin(tilt)*i*1.2,cy+i*1.0);x.transform(1,0,Math.sin(tilt)*.3,1,0,0);x.fillText(txt,0,0);x.restore();}
      x.save();x.translate(cx,cy);x.transform(1,0,Math.sin(tilt)*.3,1,0,0);const g=x.createLinearGradient(-fs/2,0,fs/2,0);g.addColorStop(0,'#9d86ff');g.addColorStop(1,'#00e0c6');x.fillStyle=g;x.fillText(txt,0,0);x.restore();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
