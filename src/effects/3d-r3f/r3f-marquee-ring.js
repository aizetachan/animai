import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-marquee-ring', title:'3D Marquee Ring', cat:'3D / R3F',
  tags:['marquee','ring','anillo','3d','logos','cards','girar','carrusel'],
  desc:'Un anillo de tarjetas/logos girando en 3D. Carrusel circular con perspectiva real.',
  meta:['transform 3d','rotateY','Carrusel'],
  prompt:`Crea un anillo 3D de tarjetas (logos, clientes, fotos) que gira sobre su eje vertical.
Posiciona N tarjetas con rotateY(i*360/N) translateZ(radio) dentro de un contenedor con preserve-3d, y rota el contenedor en bucle. Las tarjetas de atrás se ven más pequeñas/oscuras por la perspectiva.
Para secciones de "logos de clientes" o galería circular envolvente.`,
  code:`/* 3D marquee ring (preserve-3d) */
.ring { transform-style: preserve-3d; animation: spin 16s linear infinite; }
.card {
  position: absolute;
  transform: rotateY(calc(var(--i) * 45deg)) translateZ(200px);
}
@keyframes spin { to { transform: rotateY(360deg); } }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=8;let rot=0,raf,run=true;
    (function loop(){if(!run)return;rot+=.012;x.fillStyle='#0a0a16';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.32;
      const cards=[];for(let i=0;i<N;i++){const a=i/N*6.283+rot;const z=Math.cos(a),sx=Math.sin(a);cards.push({z,x:sx*R,a,i});}
      cards.sort((p,q)=>p.z-q.z);cards.forEach(c=>{const pz=(c.z+2)/3;const w=46*pz,h=30*pz;const px=cx+c.x*pz;const hue=250+c.i*14;x.fillStyle='hsla('+hue+','+(60)+'%,'+(55*pz)+'%,'+(.5+pz*.5)+')';x.fillRect(px-w/2,cy-h/2,w,h);x.fillStyle='rgba(255,255,255,'+(pz*.8)+')';x.font='bold '+(10*pz)+'px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText('Logo',px,cy);});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
