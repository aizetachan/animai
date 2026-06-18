import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tr-curtain-split', title:'Curtain Split Reveal', cat:'Scroll',
  tags:['curtain','telón','split','reveal','transición','abrir','paneles'],
  desc:'Dos paneles se abren desde el centro como un telón revelando el contenido. Reveal teatral.',
  meta:['translateX','split','Reveal'],
  prompt:`Crea una transición de "telón": dos paneles (izquierdo y derecho) que parten unidos en el centro y se abren hacia los lados revelando el contenido detrás, o al revés para cubrir.
Anima translateX de cada panel (-100% / +100%) con easing; el contenido detrás puede tener un leve scale para parallax. Útil como intro de sección o page transition.
Para aperturas dramáticas de portfolio, splash o cambios de sección.`,
  code:`/* Curtain split reveal */
.left  { transform: translateX(0); transition: transform 1s cubic-bezier(.7,0,.3,1); }
.right { transform: translateX(0); transition: transform 1s cubic-bezier(.7,0,.3,1); }
.open .left  { transform: translateX(-100%); }
.open .right { transform: translateX(100%); }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.01;const cyc=t%2;const open=cyc<1;const p=open?Math.min(1,cyc/.8):Math.max(0,1-(cyc-1)/.8);
      // contenido detrás
      const g=x.createLinearGradient(0,0,o.W(),o.H());g.addColorStop(0,'#7b5cff');g.addColorStop(1,'#00e0c6');x.fillStyle=g;x.fillRect(0,0,o.W(),o.H());x.fillStyle='rgba(255,255,255,.95)';x.font='800 22px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText('NAKAMA',o.W()/2,o.H()/2);
      // paneles
      const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;x.fillStyle='#0a0a14';x.fillRect(-e*o.W()/2,0,o.W()/2,o.H());x.fillRect(o.W()/2+e*o.W()/2,0,o.W()/2,o.H());
      // línea central de luz
      if(e<.95){x.fillStyle='rgba(123,92,255,'+(1-e)+')';x.fillRect(o.W()/2-1,0,2,o.H());}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
