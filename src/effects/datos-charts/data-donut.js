import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-donut', title:'Donut Progress', cat:'Datos / Charts',
  tags:['donut','anillo','progreso','porcentaje','chart','radial','datos'],
  desc:'Un anillo de progreso que se completa hasta el porcentaje con la cifra contando. Donut chart animado.',
  meta:['stroke-dashoffset','count','Viz'],
  prompt:`Crea un "donut progress": un anillo SVG que se rellena desde 0 hasta un porcentaje (stroke-dashoffset animado) mientras la cifra del centro cuenta hasta ese valor.
Un círculo de fondo gris + un círculo de progreso con dasharray=circunferencia y dashoffset animado; rota -90° para empezar arriba. El número usa un tween sincronizado.
Para KPIs, completitud de perfil, métricas de un vistazo.`,
  code:`/* Donut progress (SVG) */
.progress {
  stroke-dasharray: 314;            /* 2πr */
  stroke-dashoffset: 314;           /* vacío */
  transition: stroke-dashoffset 1.2s ease;
  transform: rotate(-90deg); transform-origin: center;
}
.in-view .progress { stroke-dashoffset: 94; }  /* 70% -> 314*(1-.7) */`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true,hold=0;const target=.72;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.014;if(t>=1){t=1;hold=45;}}const e=1-Math.pow(2,-10*t);const pct=e*target;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.3;
      x.strokeStyle='#16162a';x.lineWidth=10;x.beginPath();x.arc(cx,cy,R,0,6.28);x.stroke();
      const g=x.createLinearGradient(cx-R,cy-R,cx+R,cy+R);g.addColorStop(0,'#7b5cff');g.addColorStop(1,'#00e0c6');x.strokeStyle=g;x.lineCap='round';x.beginPath();x.arc(cx,cy,R,-1.5708,-1.5708+pct*6.283);x.stroke();
      x.fillStyle='#eef0f7';x.font='800 '+R*.5+'px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(Math.round(pct*100)+'%',cx,cy);
      if(hold>0&&t>=1){}else if(t>=1){t=0;}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
