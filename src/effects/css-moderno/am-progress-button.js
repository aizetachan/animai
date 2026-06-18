import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-progress-button', title:'Progress Button', cat:'CSS Moderno',
  tags:['button','progress','loading','anime.js','morph','success','estado'],
  desc:'Un botón se transforma en barra de progreso y luego en check de éxito. Estado de carga todo-en-uno.',
  meta:['morph','states','Loading'],
  prompt:`Crea un "progress button" que consolida estados: al pulsar, el botón se contrae a un círculo/barra, muestra el progreso, y al terminar se transforma en un check de éxito (verde) con un pop.
Gestiona estados (idle → loading → success) animando width/border-radius del botón, una barra/anillo de progreso, y el tick final. Revierte tras unos segundos.
Para envíos de formulario, descargas o acciones asíncronas, sin modales.`,
  code:`// Progress button — idle -> loading -> success
// 1) botón se encoge a círculo (width, border-radius)
// 2) anillo de progreso (stroke-dashoffset 0->full)
// 3) success: color verde + tick draw + pop`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true,state=0,prog=0,w=1;
    (function loop(){if(!run)return;t++;const cyc=t%180;if(cyc<30)state=0;else if(cyc<140)state=1;else state=2;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2;
      if(state===0){prog=0;const bw=130,bh=40;x.fillStyle='#7b5cff';roundRect(x,cx-bw/2,cy-bh/2,bw,bh,20);x.fill();x.fillStyle='#fff';x.font='bold 14px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText('Enviar',cx,cy);}
      else if(state===1){prog=Math.min(1,(cyc-30)/100);const r=20;x.strokeStyle='#16162a';x.lineWidth=5;x.beginPath();x.arc(cx,cy,r,0,6.28);x.stroke();x.strokeStyle='#7b5cff';x.lineCap='round';x.beginPath();x.arc(cx,cy,r,-1.57,-1.57+prog*6.28);x.stroke();}
      else{const r=20;x.fillStyle='#00e0c6';x.beginPath();x.arc(cx,cy,r,0,6.28);x.fill();x.strokeStyle='#04221d';x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(cx-8,cy);x.lineTo(cx-2,cy+6);x.lineTo(cx+8,cy-6);x.stroke();}
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
