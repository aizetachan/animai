import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-css-cube', title:'CSS 3D Cube', cat:'3D / R3F',
  tags:['cube','cubo','3d','css','rotar','caras','preserve-3d'],
  desc:'Un cubo 3D sólido de 6 caras que rota en el espacio. Cubo real en CSS puro, sin librerías.',
  meta:['preserve-3d','translateZ','0 JS'],
  prompt:`Crea un cubo 3D real en CSS puro: 6 caras posicionadas con rotateX/rotateY + translateZ dentro de un contenedor con transform-style:preserve-3d y perspective, rotando en bucle.
Cada cara es un div semitransparente de color; el contenedor anima rotateX+rotateY infinito. Las caras traseras se ven a través por la transparencia.
Para logos 3D, loaders con volumen o decoración hero.`,
  code:`/* CSS 3D cube */
.cube { transform-style: preserve-3d; animation: rotate 8s linear infinite; }
.face { position: absolute; width: 100px; height: 100px; }
.front  { transform: translateZ(50px); }
.back   { transform: rotateY(180deg) translateZ(50px); }
.right  { transform: rotateY(90deg) translateZ(50px); }
/* ...left, top, bottom; @keyframes rotate { to { transform: rotateX(360deg) rotateY(360deg) } } */`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let rx=.5,ry=.5,raf,run=true;
    const V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const faces=[[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[4,5,1,0],[3,2,6,7]];
    const fc=['rgba(123,92,255,.55)','rgba(0,224,198,.55)','rgba(255,92,168,.55)','rgba(255,209,102,.55)','rgba(90,156,255,.55)','rgba(157,107,255,.55)'];
    (function loop(){if(!run)return;rx+=.012;ry+=.016;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,sc=Math.min(o.W(),o.H())*.22;
      const cosX=Math.cos(rx),sinX=Math.sin(rx),cosY=Math.cos(ry),sinY=Math.sin(ry);
      const P=V.map(v=>{let[a,b,c]=v;let z1=a*cosY-c*sinY,x1=a*sinY+c*cosY;let y2=b*cosX-z1*sinX,z2=b*sinX+z1*cosX;const pz=4/(4+z2);return{x:cx+x1*sc*pz,y:cy+y2*sc*pz,z:z2};});
      const order=faces.map((f,i)=>({f,i,z:(P[f[0]].z+P[f[1]].z+P[f[2]].z+P[f[3]].z)/4})).sort((a,b)=>b.z-a.z);
      order.forEach(({f,i})=>{x.beginPath();f.forEach((vi,k)=>{k?x.lineTo(P[vi].x,P[vi].y):x.moveTo(P[vi].x,P[vi].y);});x.closePath();x.fillStyle=fc[i];x.fill();x.strokeStyle='rgba(255,255,255,.3)';x.lineWidth=1.5;x.stroke();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
