import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-bloom', title:'Postprocessing Bloom', cat:'3D / R3F',
  tags:['3d','r3f','postprocessing','bloom','glow','neon','efectos'],
  desc:'Resplandor neón con <Bloom> de react-postprocessing. El glow cinematográfico sobre objetos emisivos.',
  meta:['@react-three/postprocessing','<Bloom>','Emisivo'],
  prompt:`Añade glow cinematográfico con react-postprocessing.
npm install @react-three/postprocessing postprocessing. Mete un <EffectComposer> con <Bloom mipmapBlur intensity={1.5} luminanceThreshold={0.2} />.
Los objetos con material emisivo (emissive + emissiveIntensity alto) brillarán. Combina con fondo oscuro para máximo efecto neón. Ideal para gaming/música/IA.`,
  code:`// npm install @react-three/postprocessing postprocessing
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <color attach="background" args={['#05050a']} />
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshStandardMaterial color="#00e0c6"
          emissive="#00e0c6" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <EffectComposer>
        <Bloom mipmapBlur intensity={1.5} luminanceThreshold={0.2} />
      </EffectComposer>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.015;const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.26;
      x.fillStyle='#05050a';x.fillRect(0,0,o.W(),o.H());x.globalCompositeOperation='lighter';
      // torus knot fake: lazo paramétrico con glow
      x.lineWidth=3;for(let pass=0;pass<3;pass++){x.strokeStyle='rgba(0,224,198,'+(pass===0?.9:.18)+')';x.lineWidth=pass===0?2.5:8+pass*6;x.beginPath();
        for(let i=0;i<=200;i++){const u=i/200*6.283*2;const r=R*(1+.4*Math.cos(3*u+t));const px=cx+Math.cos(2*u+t*.5)*r,py=cy+Math.sin(3*u+t*.5)*r*.6;i===0?x.moveTo(px,py):x.lineTo(px,py);}x.stroke();}
      x.globalCompositeOperation='source-over';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
