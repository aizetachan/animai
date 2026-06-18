import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-elastic-checkbox', title:'Elastic Checkbox', cat:'CSS Moderno',
  tags:['checkbox','check','elastic','anime.js','marcar','toggle','spring'],
  desc:'Un checkbox que se marca con un check elástico y un destello. Microinteracción de formulario satisfactoria.',
  meta:['stroke draw','spring','Form'],
  prompt:`Crea un checkbox animado satisfactorio: al marcarlo, la caja hace un pop elástico (scale con rebote), el tick se dibuja (stroke), y opcionalmente sale un pequeño destello de partículas.
Anima el fondo de la caja (color), el scale con spring y el dashoffset del tick. Al desmarcar, revierte.
Para formularios, listas de tareas y onboarding con tacto premium.`,
  code:`// Elastic checkbox — pop + tick draw
import { animate, spring } from 'animejs'
animate('.box', { scale: [1, 1.2, 1], backgroundColor: '#7b5cff', ease: spring() })
animate('.tick', { strokeDashoffset: [length, 0], duration: 300, delay: 100 })`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true,checked=false,scale=1,tick=0;
    (function loop(){if(!run)return;t++;if(t%70===0){checked=!checked;}const ts=checked?1:0;tick+=(ts-tick)*.2;const target=checked?1:0;scale+=(target-scale)*.15;const pop=checked?1+Math.sin(Math.min(1,(t%70)/10)*3.14)*.2:1;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,sz=34;
      x.save();x.translate(cx,cy);x.scale(pop,pop);x.fillStyle=checked?'#7b5cff':'#16162a';x.strokeStyle=checked?'#7b5cff':'#3a3a4e';x.lineWidth=2;roundRect(x,-sz/2,-sz/2,sz,sz,8);x.fill();x.stroke();
      if(tick>.05){x.strokeStyle='#fff';x.lineWidth=3;x.lineCap='round';const pts=[[-9,0],[-3,7],[9,-8]];x.beginPath();x.moveTo(pts[0][0],pts[0][1]);const seg1=Math.min(1,tick*2),seg2=Math.max(0,tick*2-1);x.lineTo(pts[0][0]+(pts[1][0]-pts[0][0])*seg1,pts[0][1]+(pts[1][1]-pts[0][1])*seg1);if(seg2>0)x.lineTo(pts[1][0]+(pts[2][0]-pts[1][0])*seg2,pts[1][1]+(pts[2][1]-pts[1][1])*seg2);x.stroke();}x.restore();
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
