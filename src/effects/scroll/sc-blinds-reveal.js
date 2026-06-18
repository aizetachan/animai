import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-blinds-reveal', title:'Blinds Reveal', cat:'Scroll',
  tags:['blinds','persianas','láminas','reveal','scroll','escalonado','stagger'],
  desc:'El contenido se revela tras unas láminas tipo persiana que se abren escalonadamente al hacer scroll.',
  meta:['canvas','scroll','stagger'],
  prompt:`Crea un revelado tipo "persianas" (blinds) ligado al scroll.
Estructura: divide la imagen/sección en N láminas horizontales (o verticales) iguales. Cada lámina cubre el contenido al inicio.
Algoritmo: a partir de un progreso de scroll p (0..1) calculado con IntersectionObserver + posición relativa al viewport, cada lámina i abre con un retardo escalonado: pi = clamp((p - i*stagger) / (1 - (N-1)*stagger), 0, 1). La altura visible de la lámina se reduce a (1 - easeInOutCubic(pi)).
Timings: stagger ~0.04 entre láminas; easing cubic-bezier(.7,0,.3,1). Para la demo, anima p en bucle (0->1->hold->reset) simulando el scroll.
Ideal para heros editoriales y galerías con entrada rítmica.`,
  code:`// Blinds reveal ligado al scroll — N láminas con stagger
const N = 8, stagger = 0.04;
function ease(t){ return t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
function draw(p){            // p = progreso de scroll 0..1
  for(let i=0;i<N;i++){
    const span = 1 - (N-1)*stagger;
    const pi = Math.max(0, Math.min(1, (p - i*stagger)/span));
    const h  = laneH * (1 - ease(pi));   // alto del trozo de persiana
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, i*laneH, W, h);      // lámina cubriendo desde arriba
  }
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=8;const stagger=.045;let p=0,dir=1,hold=0,raf,run=true;
    function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
    (function loop(){if(!run)return;const W=o.W(),H=o.H();
      if(hold>0)hold--;else{p+=dir*.012;if(p>=1){p=1;hold=50;dir=-1;}if(p<=0){p=0;hold=50;dir=1;}}
      // contenido revelado detrás
      const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#7b5cff');g.addColorStop(1,'#00e0c6');x.fillStyle=g;x.fillRect(0,0,W,H);
      x.fillStyle='rgba(255,255,255,.95)';x.font='800 20px Inter,system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText('REVEAL',W/2,H/2);
      // láminas tipo persiana
      const laneH=H/N;const span=1-(N-1)*stagger;
      for(let i=0;i<N;i++){const pi=Math.max(0,Math.min(1,(p-i*stagger)/span));const h=laneH*(1-ease(pi));
        const ly=i*laneH;x.fillStyle='#0a0a14';x.fillRect(0,ly,W,h);
        // borde inferior brillante de la lámina mientras se abre
        if(h>1&&pi<1){x.fillStyle='rgba(123,92,255,'+(.6*(1-pi))+')';x.fillRect(0,ly+h-1.5,W,1.5);}
      }
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
