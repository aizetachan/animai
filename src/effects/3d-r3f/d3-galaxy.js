import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-galaxy', title:'Galaxy Spiral', cat:'3D / R3F',
  tags:['galaxy','galaxia','espiral','spiral','partículas','particles','space','estrellas'],
  desc:'Galaxia espiral de miles de partículas que rotan sobre un disco, con brazos curvos y gradiente del núcleo al borde.',
  meta:['canvas','Points','Spiral'],
  prompt:`Crea una galaxia espiral de partículas (estilo el galaxy generator de Bruno Simon en three.js).
Para cada partícula i:
  - radio r = aleatorio·radioMax (preferible distribución con potencia para concentrar el núcleo)
  - rama: branch = (i % nBranches) / nBranches · 2π
  - giro espiral: spinAngle = r · spin (cuanto más lejos, más gira)
  - dispersión: randomness ~ pow(rand, potencia) · r en x,y,z (signo aleatorio) para dar grosor
  - ángulo final = branch + spinAngle; posición x=cos(ang)·r, z=sin(ang)·r, y=randomY
  - color = mezcla entre colorNúcleo (cálido) y colorBorde (frío) según r/radioMax
Anima rotando todo el disco sobre el eje Y a velocidad constante. Proyecta en perspectiva con leve inclinación de cámara. Tamaño/alfa de partícula según profundidad.
En R3F real: BufferGeometry con atributos position+color y un PointsMaterial (additive blending, sizeAttenuation), rotando el <points> en useFrame.`,
  code:`// Galaxy generator — posiciones + colores por partícula
const params = { count:6000, branches:3, radius:5, spin:1.0, randomness:0.2, power:3 };
const inside = new THREE.Color('#ff9e57'), outside = new THREE.Color('#7b5cff');
const pos = new Float32Array(params.count*3), col = new Float32Array(params.count*3);
for(let i=0;i<params.count;i++){
  const i3=i*3;
  const r = Math.random()*params.radius;
  const branch = ((i % params.branches)/params.branches)*Math.PI*2;
  const spin = r*params.spin;
  const rx = Math.pow(Math.random(),params.power)*(Math.random()<.5?1:-1)*params.randomness*r;
  const ry = Math.pow(Math.random(),params.power)*(Math.random()<.5?1:-1)*params.randomness*r;
  const rz = Math.pow(Math.random(),params.power)*(Math.random()<.5?1:-1)*params.randomness*r;
  pos[i3]   = Math.cos(branch+spin)*r + rx;
  pos[i3+1] = ry;
  pos[i3+2] = Math.sin(branch+spin)*r + rz;
  const c = inside.clone().lerp(outside, r/params.radius);
  col[i3]=c.r; col[i3+1]=c.g; col[i3+2]=c.b;
}
// useFrame: points.rotation.y += delta*0.1`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const COUNT=1400, BRANCHES=3, RADIUS=1, SPIN=3.2, RAND=0.22, POW=3;
    const P=[];
    function lerp(a,b,t){return a+(b-a)*t;}
    const inC=[255,158,87], outC=[123,92,255];
    for(let i=0;i<COUNT;i++){
      const r=Math.pow(Math.random(),0.7)*RADIUS;
      const branch=((i%BRANCHES)/BRANCHES)*Math.PI*2;
      const spin=r*SPIN;
      const rx=Math.pow(Math.random(),POW)*(Math.random()<.5?1:-1)*RAND*r;
      const ry=Math.pow(Math.random(),POW)*(Math.random()<.5?1:-1)*RAND*r*0.5;
      const rz=Math.pow(Math.random(),POW)*(Math.random()<.5?1:-1)*RAND*r;
      const ang=branch+spin;
      const tt=r/RADIUS;
      P.push({x:Math.cos(ang)*r+rx, y:ry, z:Math.sin(ang)*r+rz,
        r:Math.round(lerp(inC[0],outC[0],tt)),g:Math.round(lerp(inC[1],outC[1],tt)),b:Math.round(lerp(inC[2],outC[2],tt))});
    }
    let rot=0,raf,run=true;const tilt=0.5;
    (function loop(){if(!run)return;rot+=0.004;
      const W=o.W(),H=o.H();x.fillStyle='#04040c';x.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,sc=Math.min(W,H)*0.42;
      x.globalCompositeOperation='lighter';
      const c=Math.cos(rot),s=Math.sin(rot),ct=Math.cos(tilt),st=Math.sin(tilt);
      const buf=[];
      for(const p of P){
        const rx=p.x*c-p.z*s, rz=p.x*s+p.z*c;
        const sy=p.y*ct - rz*st;
        const depth=p.y*st + rz*ct;
        buf.push({sx:cx+rx*sc, sy:cy+sy*sc, depth, p});
      }
      buf.sort((a,b)=>a.depth-b.depth);
      for(const o2 of buf){
        const a=0.35+0.5*((o2.depth+1)/2);
        const sz=0.7+0.9*((o2.depth+1)/2);
        x.fillStyle='rgba('+o2.p.r+','+o2.p.g+','+o2.p.b+','+a.toFixed(2)+')';
        x.beginPath();x.arc(o2.sx,o2.sy,sz,0,6.283);x.fill();
      }
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
