import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-scrollcontrols', title:'R3F ScrollControls', cat:'3D / R3F',
  tags:['3d','r3f','drei','scroll','scrollcontrols','useScroll','cámara'],
  desc:'Escena 3D que avanza y reacciona al scroll con <ScrollControls> + useScroll de drei. Scrollytelling 3D.',
  meta:['@react-three/drei','ScrollControls','useScroll'],
  prompt:`Liga una escena 3D al scroll con <ScrollControls pages={3}> de @react-three/drei.
Dentro, un componente lee useScroll() y en useFrame usa data.offset (0->1) y data.range(start,length) para animar cámara, rotaciones u opacidades.
Mete contenido DOM sincronizado con <Scroll html>. Es la base del "scrollytelling" 3D tipo Apple/Igloo.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { useRef } from 'react'

function Item() {
  const ref = useRef()
  const data = useScroll()
  useFrame(() => {
    ref.current.rotation.y = data.offset * Math.PI * 4
    ref.current.position.y = -data.offset * 6
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#7b5cff" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas>
      <ambientLight /><pointLight position={[5, 5, 5]} />
      <ScrollControls pages={3} damping={0.2}>
        <Item />
        <Scroll html>
          <h1 style={{ top: '100vh' }}>Scroll down</h1>
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let p=0,dir=1,raf,run=true;
    const V=[[0,1,0],[0.89,0.45,0],[0.28,0.45,0.85],[-0.72,0.45,0.53],[-0.72,0.45,-0.53],[0.28,0.45,-0.85],[0.72,-0.45,0.53],[-0.28,-0.45,0.85],[-0.89,-0.45,0],[-0.28,-0.45,-0.85],[0.72,-0.45,-0.53],[0,-1,0]];
    (function loop(){if(!run)return;p+=dir*.004;if(p>=1){dir=-1;}if(p<=0){dir=1;}
      const cx=o.W()/2,cy=o.H()*(.2+p*.6),sz=Math.min(o.W(),o.H())*.22,ang=p*Math.PI*4,ca=Math.cos(ang),sa=Math.sin(ang);
      x.clearRect(0,0,o.W(),o.H());x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      // barra de scroll lateral
      x.fillStyle='#16162a';x.fillRect(o.W()-8,0,4,o.H());x.fillStyle='#7b5cff';x.fillRect(o.W()-8,p*(o.H()-40),4,40);
      const pr=V.map(([X,Y,Z])=>{const x1=X*ca-Z*sa,z1=X*sa+Z*ca;const f=3/(3+z1);return[cx+x1*sz*f,cy+Y*sz*f,z1];});
      pr.forEach((pt,i)=>{x.fillStyle='rgba(123,92,255,'+Math.max(.3,.7-pt[2]*.3)+')';x.beginPath();x.arc(pt[0],pt[1],4,0,6.28);x.fill();for(let j=i+1;j<pr.length;j++){const d=Math.hypot(pt[0]-pr[j][0],pt[1]-pr[j][1]);if(d<sz*1.1){x.strokeStyle='rgba(0,224,198,'+(1-d/(sz*1.1))*.35+')';x.beginPath();x.moveTo(pt[0],pt[1]);x.lineTo(pr[j][0],pr[j][1]);x.stroke();}}});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
