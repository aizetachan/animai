import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-sparkles', title:'Drei Sparkles', cat:'3D / R3F',
  tags:['3d','r3f','drei','sparkles','partículas','brillo','magia'],
  desc:'Destellos 3D flotando en el espacio con <Sparkles> de drei. Atmósfera mágica para heros oscuros.',
  meta:['@react-three/drei','<Sparkles>','Volumen'],
  prompt:`Añade destellos volumétricos con <Sparkles> de @react-three/drei.
<Sparkles count={80} scale={6} size={4} speed={0.4} color="#00e0c6" /> dentro del <Canvas>.
Perfecto para heros oscuros, secciones "magia/IA" o como ambiente detrás de un producto. Combínalo con un fondo <color attach="background"> oscuro.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { Sparkles, OrbitControls } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <color attach="background" args={['#07070d']} />
      <Sparkles count={80} scale={6} size={4} speed={0.4} color="#00e0c6" />
      <Sparkles count={40} scale={5} size={6} speed={0.3} color="#7b5cff" />
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=70,sp=[];for(let i=0;i<N;i++)sp.push({x:Math.random(),y:Math.random(),z:Math.random(),ph:Math.random()*6.28,c:Math.random()>.5?'0,224,198':'123,92,255'});
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;x.fillStyle='rgba(7,7,13,1)';x.fillRect(0,0,o.W(),o.H());
      sp.forEach(p=>{const tw=.5+.5*Math.sin(t*2+p.ph);const px=p.x*o.W(),py=(p.y+Math.sin(t*.5+p.ph)*.02)*o.H(),r=(1+p.z*2.5)*tw;x.fillStyle='rgba('+p.c+','+(.3+tw*.6)+')';x.beginPath();x.arc(px,py,r,0,6.28);x.fill();
        if(tw>.8){x.strokeStyle='rgba('+p.c+','+(tw-.8)*2+')';x.lineWidth=1;x.beginPath();x.moveTo(px-r*2,py);x.lineTo(px+r*2,py);x.moveTo(px,py-r*2);x.lineTo(px,py+r*2);x.stroke();}});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
