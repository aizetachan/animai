import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-orbit', title:'OrbitControls Showcase', cat:'3D / R3F',
  tags:['orbit','controls','3d','rotar','interactivo','r3f','drei'],
  desc:'Un objeto 3D que el usuario rota y hace zoom con el ratón. Controles de órbita reales.',
  meta:['drei','<OrbitControls>','Interactivo'],
  prompt:`Muestra un objeto 3D con <OrbitControls> de drei para que el usuario lo rote, haga pan y zoom con el ratón.
Props útiles: enableZoom, autoRotate, autoRotateSpeed, enableDamping (inercia), minDistance/maxDistance. Combínalo con un material bonito y luz suave.
Para visores de producto 3D, configuradores o un hero explorable. La inercia (damping) es clave para que se sienta premium.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

<Canvas camera={{ position: [0, 0, 4] }}>
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 5, 5]} />
  <mesh>
    <icosahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color="#7b5cff" flatShading />
  </mesh>
  <OrbitControls enableDamping autoRotate autoRotateSpeed={0.6} />
</Canvas>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let rx=.4,ry=0,vrx=0,vry=.01,raf,run=true,drag=false,px,py;
    const V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    el.onmousedown=e=>{drag=true;px=e.clientX;py=e.clientY;};
    el.onmousemove=e=>{if(drag){vry=(e.clientX-px)*.002;vrx=(e.clientY-py)*.002;px=e.clientX;py=e.clientY;}};
    window.addEventListener('mouseup',()=>drag=false);
    (function loop(){if(!run)return;if(!drag){vry*=.95;vrx*=.95;if(Math.abs(vry)<.002)vry=.01;}rx+=vrx;ry+=vry;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,sc=Math.min(o.W(),o.H())*.22;
      const cosX=Math.cos(rx),sinX=Math.sin(rx),cosY=Math.cos(ry),sinY=Math.sin(ry);
      const P=V.map(v=>{let[a,b,c]=v;let z1=a*cosY-c*sinY,x1=a*sinY+c*cosY;let y2=b*cosX-z1*sinX,z2=b*sinX+z1*cosX;const pz=4/(4+z2);return[cx+x1*sc*pz,cy+y2*sc*pz];});
      x.strokeStyle='#7b5cff';x.lineWidth=2;E.forEach(([a,b])=>{x.beginPath();x.moveTo(P[a][0],P[a][1]);x.lineTo(P[b][0],P[b][1]);x.stroke();});
      x.fillStyle='#00e0c6';P.forEach(p=>{x.beginPath();x.arc(p[0],p[1],3,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
