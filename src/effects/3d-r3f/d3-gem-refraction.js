import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-gem-refraction', title:'Gem Refraction', cat:'3D / R3F',
  tags:['gema','gem','diamante','diamond','refracción','facetas','sparkle','3d'],
  desc:'Una gema 3D facetada que gira lanzando destellos de luz y reflejos por cada cara.',
  meta:['three.js','MeshRefractionMaterial','Facetas'],
  prompt:`Crea una gema/diamante 3D facetado: un poliedro (octaedro o bipirámide) cuyas facetas reciben sombreado por su normal proyectada hacia la luz, generando brillos.
Algoritmo de preview: define vértices de una bipirámide (ápices arriba/abajo + anillo ecuatorial). Roteala con matrices YX. Cada cara triangular se ordena por profundidad (painter) y se colorea según el ángulo entre su normal y una luz fija; añade destellos puntuales (sparkles) que parpadean en los vértices visibles.
En producción real usa <MeshRefractionMaterial> de @react-three/drei con un envMap (cubeTexture) para refracción/dispersión física, bounces y aberración cromática.
Para joyas, logos premium, badges de lujo o decoración hero brillante.`,
  code:`// npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber'
import { MeshRefractionMaterial, Environment } from '@react-three/drei'
import { CubeTextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'

function Gem() {
  const envMap = useLoader(CubeTextureLoader, [/* px,nx,py,ny,pz,nz */])
  return (
    <mesh rotation={[0.3, 0, 0]}>
      <octahedronGeometry args={[1.2, 0]} />
      <MeshRefractionMaterial
        envMap={envMap}
        bounces={3} aberrationStrength={0.02}
        ior={2.4} fresnel={1} fastChroma />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <Environment preset="sunset" />
      <Gem />
    </Canvas>
  )
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let ry=0,raf,run=true;
    // bipirámide: ápice top, ápice bottom, anillo de 6
    const N=6,ring=[];for(let i=0;i<N;i++){const a=i/N*6.283;ring.push([Math.cos(a),0,Math.sin(a)]);}
    const V=[[0,1.5,0],...ring.map(p=>[p[0],0,p[2]]),[0,-1.5,0]];
    const bot=V.length-1;
    const faces=[];
    for(let i=0;i<N;i++){const n=(i+1)%N;faces.push([0,1+i,1+n]);faces.push([bot,1+n,1+i]);}
    const light=[ .4,.7,.6];const lm=Math.hypot(...light);const L=light.map(v=>v/lm);
    (function loop(){if(!run)return;ry+=.018;const rx=.45;
      const cx=o.W()/2,cy=o.H()/2,sc=Math.min(o.W(),o.H())*.28;
      x.fillStyle='#080812';x.fillRect(0,0,o.W(),o.H());
      const cosY=Math.cos(ry),sinY=Math.sin(ry),cosX=Math.cos(rx),sinX=Math.sin(rx);
      const P=V.map(v=>{let[a,b,c]=v;let z1=a*cosY-c*sinY,x1=a*sinY+c*cosY;let y2=b*cosX-z1*sinX,z2=b*sinX+z1*cosX;const pz=4/(4.2+z2);return{x:cx+x1*sc*pz,y:cy-y2*sc*pz,z:z2,X:x1,Y:y2,Z:z2};});
      const tris=faces.map(f=>{const z=(P[f[0]].z+P[f[1]].z+P[f[2]].z)/3;
        const a=P[f[0]],b=P[f[1]],c=P[f[2]];
        const ux=b.X-a.X,uy=b.Y-a.Y,uz=b.Z-a.Z,vx=c.X-a.X,vy=c.Y-a.Y,vz=c.Z-a.Z;
        let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const nm=Math.hypot(nx,ny,nz)||1;nx/=nm;ny/=nm;nz/=nm;
        const dif=Math.max(0,nx*L[0]+ny*L[1]+nz*L[2]);return{f,z,dif};}).sort((p,q)=>p.z-q.z);
      tris.forEach(({f,dif})=>{const a=P[f[0]],b=P[f[1]],c=P[f[2]];
        x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.lineTo(c.x,c.y);x.closePath();
        const sh=.18+dif*.82;const r=Math.round(123*sh+60*dif),g=Math.round(160*sh+80*dif),bl=Math.round(255*sh);
        x.fillStyle='rgb('+r+','+g+','+bl+')';x.fill();
        x.strokeStyle='rgba(255,255,255,'+(.25+dif*.4)+')';x.lineWidth=1;x.stroke();});
      // destellos en vértices visibles frontales
      x.globalCompositeOperation='lighter';
      P.forEach((p,i)=>{if(p.z<0.2)return;const tw=Math.max(0,Math.sin(ry*3+i*1.7));if(tw<.5)return;const s=(tw-.5)*2;const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,10*s);g.addColorStop(0,'rgba(0,224,198,'+(s*.9)+')');g.addColorStop(1,'rgba(0,224,198,0)');x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,10*s,0,6.28);x.fill();});
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
