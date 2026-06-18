import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-coverflow', title:'Coverflow Carousel', cat:'3D / R3F',
  tags:['coverflow','carrusel','3d','itunes','tarjetas','perspectiva','girar'],
  desc:'Carrusel 3D estilo Cover Flow: las tarjetas laterales se inclinan en perspectiva. El clásico de iTunes.',
  meta:['rotateY','perspective','Carrusel'],
  prompt:`Recrea el "Cover Flow" de iTunes: un carrusel 3D donde la tarjeta central está de frente y las laterales se inclinan (rotateY) alejándose en perspectiva, más pequeñas y oscuras cuanto más lejos del centro.
Posiciona cada tarjeta según su offset al índice activo: translateX + translateZ + rotateY proporcionales. Al cambiar de activa, todas se reordenan con transición.
Para galerías de portfolio, álbumes, productos destacados.`,
  code:`// Coverflow — cada tarjeta según offset al centro
cards.forEach((card, i) => {
  const offset = i - active
  const rotateY = Math.max(-60, Math.min(60, -offset * 50))
  const z = -Math.abs(offset) * 100
  card.style.transform = \`translateX(\${offset*120}px) translateZ(\${z}px) rotateY(\${rotateY}deg)\`
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=5;let active=2,raf,run=true,t=0,curAct=2;
    (function loop(){if(!run)return;t++;if(t%70===0)active=(active+1)%N;curAct+=(active-curAct)*.12;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2;
      const order=[];for(let i=0;i<N;i++)order.push({i,off:i-curAct});order.sort((a,b)=>Math.abs(b.off)-Math.abs(a.off));
      order.forEach(({i,off})=>{const ry=Math.max(-1,Math.min(1,-off*.5));const z=1-Math.abs(off)*.18;const px=cx+off*46*z;const w=54*z,h=54*z;const skew=ry*.5;
        x.save();x.translate(px,cy);x.transform(1,skew*.3,0,1,0,0);x.fillStyle='hsl('+(250+i*20)+',60%,'+(58*z)+'%)';x.fillRect(-w/2,-h/2,w*(1-Math.abs(ry)*.3),h);x.fillStyle='rgba(255,255,255,'+(z*.7)+')';x.font='bold '+(14*z)+'px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(i+1,-w*Math.abs(ry)*.15,0);x.restore();
        // reflejo
        x.save();x.globalAlpha=z*.2;x.translate(px,cy+h/2+2);x.scale(1,-.4);x.fillStyle='hsl('+(250+i*20)+',60%,'+(58*z)+'%)';x.fillRect(-w/2,0,w*(1-Math.abs(ry)*.3),h);x.restore();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
