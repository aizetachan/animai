import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-marching-cubes', title:'Marching Cubes', cat:'3D / R3F',
  tags:['metaballs','isosuperficie','marching cubes','blobs','3D','campo escalar','orgánico'],
  desc:'Metaballs 3D unidos como una isosuperficie orgánica que late y se funde.',
  meta:['canvas','metaballs','isosurface'],
  prompt:`Implementa metaballs 3D como una isosuperficie (algoritmo Marching Cubes en three.js, ej. MarchingCubes de drei/examples).
Define un campo escalar f(p)=Σ r_i^2 / |p - c_i|^2 sumando la influencia de varias esferas móviles. Marching Cubes muestrea una grilla 3D y poligoniza la superficie donde f(p) cruza un umbral (isovalue), generando una malla continua que funde los blobs cuando se acercan.
Para la preview vanilla en canvas 2D se aproxima proyectando cada metaball como una esfera con sombreado Lambert y orden por profundidad; los blobs orbitan y se solapan creando uniones suaves. Parámetros: nº de blobs, radios, velocidad orbital, isovalue, resolución de grilla.`,
  code:`// Marching Cubes metaballs con three.js (drei / examples)
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js'

const resolution = 48
const mc = new MarchingCubes(resolution, material, true, true, 100000)
mc.isolation = 80 // umbral de la isosuperficie

useFrame((state) => {
  const t = state.clock.elapsedTime
  mc.reset()
  for (let i = 0; i < 6; i++) {
    const x = 0.5 + Math.sin(t * 0.7 + i) * 0.28
    const y = 0.5 + Math.cos(t * 0.5 + i * 1.7) * 0.28
    const z = 0.5 + Math.sin(t * 0.6 + i * 2.3) * 0.28
    mc.addBall(x, y, z, 1.2, 12) // strength, subtract
  }
  mc.update()
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=6,balls=[];
    for(let i=0;i<N;i++)balls.push({ph:i*1.7,r:.30+Math.random()*.12,sp:.5+Math.random()*.5});
    let t=0,rot=0,raf,run=true;
    (function loop(){if(!run)return;
      const W=o.W(),H=o.H();t+=.016;rot+=.006;
      x.fillStyle='#070710';x.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,sc=Math.min(W,H)*.5;
      const cr=Math.cos(rot),sr=Math.sin(rot);
      const proj=balls.map((b,i)=>{
        let px=Math.sin(t*0.7*b.sp+b.ph)*.55;
        let py=Math.cos(t*0.5*b.sp+b.ph*1.7)*.55;
        let pz=Math.sin(t*0.6*b.sp+b.ph*2.3)*.55;
        const xx=px*cr-pz*sr, zz=px*sr+pz*cr;
        const persp=2.4/(2.4+zz);
        return{sx:cx+xx*sc*persp,sy:cy+py*sc*persp,rad:b.r*sc*persp,z:zz,i};
      }).sort((a,b)=>a.z-b.z);
      // unión suave: dibujamos gradientes radiales solapados (metaball look)
      x.globalCompositeOperation='lighter';
      proj.forEach(p=>{
        const hue=p.z<0?'0,224,198':'123,92,255';
        const g=x.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,p.rad*1.4);
        const a=.55+(0.5-p.z)*.2;
        g.addColorStop(0,'rgba('+hue+','+Math.min(1,a)+')');
        g.addColorStop(.55,'rgba('+hue+',0.35)');
        g.addColorStop(1,'rgba('+hue+',0)');
        x.fillStyle=g;x.beginPath();x.arc(p.sx,p.sy,p.rad*1.4,0,6.28);x.fill();
      });
      x.globalCompositeOperation='source-over';
      // brillo especular por blob (lambert aprox)
      proj.forEach(p=>{
        const sh=x.createRadialGradient(p.sx-p.rad*.3,p.sy-p.rad*.3,0,p.sx,p.sy,p.rad);
        sh.addColorStop(0,'rgba(255,255,255,'+(.18+(0.5-p.z)*.12)+')');
        sh.addColorStop(.4,'rgba(255,255,255,0)');
        x.fillStyle=sh;x.beginPath();x.arc(p.sx,p.sy,p.rad,0,6.28);x.fill();
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
