import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-split-screen-reveal', title:'Split-Screen Reveal', cat:'Scroll',
  tags:['split-screen','reveal','scroll','mitades','abrir','panels','editorial'],
  desc:'Dos mitades (superior/inferior) que se separan al hacer scroll dejando ver el contenido central.',
  meta:['canvas','scroll','split'],
  prompt:`Crea un "split-screen reveal" ligado al scroll: dos mitades (top y bottom, o left y right) que parten unidas tapando el contenido y se separan progresivamente con el scroll.
Algoritmo: a partir del progreso p (0..1) con IntersectionObserver, desplaza la mitad superior translateY(-p*100%) y la inferior translateY(+p*100%) usando easeInOutCubic. El contenido central tiene un leve scale (1.15 -> 1) como parallax. Una línea/glow en la junta acompaña la apertura.
Timings: easing cubic-bezier(.7,0,.3,1) sobre ~1 viewport de scroll. Para la demo, anima p en bucle simulando el scroll.
Ideal para intros de sección, splits de "antes/después" y hero editoriales.`,
  code:`// Split-screen reveal — dos mitades que se separan con el scroll
function ease(t){ return t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
function draw(p){                 // p = progreso de scroll 0..1
  const e = ease(p);
  // contenido central con leve scale (parallax)
  drawContent(1.15 - 0.15*e);
  // mitad superior sube, inferior baja
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, -e*H/2, W, H/2);          // top
  ctx.fillRect(0, H/2 + e*H/2, W, H/2);     // bottom
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let p=0,dir=1,hold=0,raf,run=true;
    function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
    (function loop(){if(!run)return;const W=o.W(),H=o.H();
      if(hold>0)hold--;else{p+=dir*.012;if(p>=1){p=1;hold=55;dir=-1;}if(p<=0){p=0;hold=55;dir=1;}}
      const e=ease(p);
      // contenido central con parallax scale
      const sc=1.15-.15*e;
      x.save();x.translate(W/2,H/2);x.scale(sc,sc);x.translate(-W/2,-H/2);
      const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#7b5cff');g.addColorStop(1,'#00e0c6');x.fillStyle=g;x.fillRect(0,0,W,H);
      x.fillStyle='rgba(255,255,255,.95)';x.font='800 22px Inter,system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText('SPLIT',W/2,H/2);
      x.restore();
      // mitades que se separan
      const halfH=H/2,off=e*halfH;x.fillStyle='#0a0a14';
      x.fillRect(0,-off,W,halfH);
      x.fillRect(0,halfH+off,W,halfH);
      // glow en la junta superior/inferior mientras se abre
      if(e<.98){x.fillStyle='rgba(0,224,198,'+(.7*(1-e))+')';x.fillRect(0,halfH-off-1.5,W,1.5);x.fillRect(0,halfH+off,W,1.5);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
