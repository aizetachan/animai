import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-zoom-pin', title:'Zoom Parallax Pin', cat:'Scroll',
  tags:['scroll','zoom','parallax','pin','imagen','escala','cinematic'],
  desc:'Una imagen se mantiene fija y hace zoom mientras varias capas se mueven a distinto ritmo al scrollear.',
  meta:['scroll %','scale+parallax','Cinematic'],
  prompt:`Combina pin + zoom + parallax en scroll (estilo intro cinematográfica).
Mientras se scrollea una sección alta, una capa central escala (scale 1->1.6) y capas de profundidad se desplazan a distinta velocidad (translateY * factor). Mapea el progreso de scroll 0->1 a estas transformaciones.
Con GSAP: ScrollTrigger con pin + scrub. Para aperturas de portfolio/marca impactantes.`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let p=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;p+=dir*.004;if(p>=1){dir=-1;}if(p<=0){dir=1;}
      x.clearRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2;
      // capas de fondo con parallax
      const layers=[{c:'#1a1330',s:1.1,sp:30},{c:'#3a2a7a',s:1.3,sp:18},{c:'#7b5cff',s:1.6,sp:8}];
      layers.forEach((L,i)=>{const sc=1+(L.s-1)*p,off=(p-.5)*L.sp;x.fillStyle=L.c;const w=o.W()*.5*sc,h=o.H()*.5*sc;x.fillRect(cx-w/2,cy-h/2+off,w,h);});
      // texto central que escala
      x.save();x.translate(cx,cy);x.scale(1+p*.6,1+p*.6);x.fillStyle='rgba(255,255,255,'+(1-p*.5)+')';x.font='800 22px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('NAKAMA',0,0);x.restore();
      // barra scroll
      x.fillStyle='#16162a';x.fillRect(o.W()-7,0,3,o.H());x.fillStyle='#00e0c6';x.fillRect(o.W()-7,p*(o.H()-30),3,30);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
