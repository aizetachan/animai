import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-terrain', title:'Procedural Terrain', cat:'3D / R3F',
  tags:['terreno','heightmap','procedural','wireframe','ruido','noise','malla','rotación'],
  desc:'Terreno procedural a partir de un heightmap de ruido, dibujado como malla wireframe que rota.',
  meta:['canvas','heightmap','wireframe'],
  prompt:`Genera un terreno procedural a partir de un heightmap. La altura de cada vértice de una grilla NxN se obtiene de ruido (ej. FBM: suma de varias octavas de ruido seno/Perlin a distintas frecuencias y amplitudes decrecientes).
En three.js parte de un PlaneGeometry segmentado, desplaza la coordenada Z de cada vértice según el heightmap y renderiza con un MeshBasicMaterial wireframe; rota lentamente la malla sobre su eje.
Para la preview vanilla se construye la grilla, se calcula la altura con una FBM barata, se aplica rotación 3D (yaw) y proyección en perspectiva, y se dibujan las aristas de cada celda con color en función de la altura. Parámetros: tamaño de grilla, octavas/amplitud del ruido, escala de altura, velocidad de rotación.`,
  code:`// Terreno procedural wireframe en three.js
const SEG = 80
const geo = new THREE.PlaneGeometry(10, 10, SEG, SEG)
const pos = geo.attributes.position
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i), y = pos.getY(i)
  pos.setZ(i, fbm(x * 0.3, y * 0.3) * 2.0) // heightmap
}
geo.computeVertexNormals()
const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x7b5cff, wireframe: true }))
mesh.rotation.x = -Math.PI / 2.4
useFrame(() => { mesh.rotation.z += 0.003 })

// fbm: suma de octavas de ruido
function fbm(x, y){ let v=0, a=0.5, f=1
  for (let o=0;o<4;o++){ v += a*noise(x*f, y*f); f*=2; a*=0.5 }
  return v }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const SEG=22;
    // pseudo ruido determinista
    function hash(i,j){const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s);}
    function vnoise(px,py){
      const xi=Math.floor(px),yi=Math.floor(py),xf=px-xi,yf=py-yi;
      const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
      const a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);
      return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;
    }
    function fbm(px,py){let val=0,amp=.5,f=1;for(let oo=0;oo<4;oo++){val+=amp*vnoise(px*f,py*f);f*=2;amp*=.5;}return val;}
    // precalcular heights base; animaremos con offset
    let rot=.5,raf,run=true,t=0;
    (function loop(){if(!run)return;
      const W=o.W(),H=o.H();rot+=.004;t+=.008;
      x.fillStyle='#070710';x.fillRect(0,0,W,H);
      const cr=Math.cos(rot),sr=Math.sin(rot);
      const tiltC=Math.cos(1.05),tiltS=Math.sin(1.05);
      const cx=W/2,cy=H/2,sc=Math.min(W,H)*1.1;
      const grid=[];
      for(let j=0;j<=SEG;j++){grid[j]=[];for(let i=0;i<=SEG;i++){
        const gx=i/SEG-0.5,gz=j/SEG-0.5;
        const h=(fbm((i)*0.35+t*2,(j)*0.35)-0.5)*0.55;
        // yaw
        let X=gx*cr-gz*sr, Z=gx*sr+gz*cr, Y=h;
        // tilt (pitch) para vista isométrica
        const Y2=Y*tiltC-Z*tiltS, Z2=Y*tiltS+Z*tiltC;
        const persp=2.0/(2.0+Z2);
        grid[j][i]={sx:cx+X*sc*persp,sy:cy+Y2*sc*persp-H*0.02,h};
      }}
      x.lineWidth=1;
      for(let j=0;j<=SEG;j++)for(let i=0;i<=SEG;i++){
        const p=grid[j][i];
        const tH=(p.h+0.3)/0.6;
        const cR=Math.round(123+(0-123)*tH),cG=Math.round(92+(224-92)*tH),cB=Math.round(255+(198-255)*tH);
        x.strokeStyle='rgba('+cR+','+cG+','+cB+','+(.35+tH*.5)+')';
        if(i<SEG){const q=grid[j][i+1];x.beginPath();x.moveTo(p.sx,p.sy);x.lineTo(q.sx,q.sy);x.stroke();}
        if(j<SEG){const q=grid[j+1][i];x.beginPath();x.moveTo(p.sx,p.sy);x.lineTo(q.sx,q.sy);x.stroke();}
      }
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
