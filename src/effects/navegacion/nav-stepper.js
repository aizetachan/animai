import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-stepper', title:'Progress Stepper', cat:'Navegación',
  tags:['stepper','pasos','wizard','progreso','checkout','onboarding','línea'],
  desc:'Un indicador de pasos donde la línea avanza y cada paso se marca al completarse. Wizard/checkout.',
  meta:['steps','fill line','Wizard'],
  prompt:`Crea un "stepper" de progreso: una fila de pasos (círculos) unidos por una línea; conforme se avanza, la línea se rellena hasta el paso actual y los completados muestran un check con un pop, el actual se resalta y los futuros quedan en gris.
Anima el relleno de la línea (width/scaleX) y el estado de cada nodo (color, check draw, pulse en el activo).
Para checkouts, onboarding multi-paso y formularios largos.`,
  code:`/* Progress stepper */
.line-fill { width: calc(var(--step) / (steps-1) * 100%); transition: width .5s; }
.node.done { background: #7b5cff; }      /* + check */
.node.active { box-shadow: 0 0 0 4px rgba(123,92,255,.3); }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=4;let cur=0,t=0,raf,run=true,fill=0;
    (function loop(){if(!run)return;t++;if(t%50===0)cur=(cur+1)%N;const target=cur/(N-1);fill+=(target-fill)*.12;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const pad=34,lineY=o.H()/2,lineW=o.W()-pad*2;
      x.strokeStyle='#2a2a3e';x.lineWidth=3;x.beginPath();x.moveTo(pad,lineY);x.lineTo(o.W()-pad,lineY);x.stroke();
      x.strokeStyle='#7b5cff';x.beginPath();x.moveTo(pad,lineY);x.lineTo(pad+lineW*fill,lineY);x.stroke();
      for(let i=0;i<N;i++){const cx=pad+i/(N-1)*lineW;const done=i<cur,active=i===cur;x.fillStyle=done||active?'#7b5cff':'#16162a';if(active){x.fillStyle='#7b5cff';x.globalAlpha=.3;x.beginPath();x.arc(cx,lineY,16,0,6.28);x.fill();x.globalAlpha=1;x.fillStyle='#7b5cff';}x.beginPath();x.arc(cx,lineY,11,0,6.28);x.fill();x.strokeStyle=done||active?'#7b5cff':'#3a3a4e';x.lineWidth=2;x.stroke();
        if(done){x.strokeStyle='#fff';x.lineWidth=2;x.lineCap='round';x.beginPath();x.moveTo(cx-4,lineY);x.lineTo(cx-1,lineY+3);x.lineTo(cx+4,lineY-3);x.stroke();}else{x.fillStyle=active?'#fff':'#8a8ca3';x.font='bold 10px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(i+1,cx,lineY);}}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
