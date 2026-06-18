import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-radial-bar', title:'Radial Bar', cat:'Datos / Charts',
  tags:['radial','circular','barplot','barras','polar','arc','viz'],
  desc:'Barras radiales (circular barplot) que crecen desde un círculo central, una por sector angular.',
  meta:['canvas','polar','Viz'],
  prompt:`Crea un "radial bar chart" / circular barplot: barras dispuestas radialmente alrededor de un centro. Cada barra ocupa un sector angular igual (360°/n) y crece desde un radio interior (anillo base) hacia un radio proporcional a su valor.
Estructura de datos: array de valores normalizados [0..1]. Para cada índice i: angle = i*(2π/n); la barra es un arco grueso (o anillo segmentado) que va de innerR a innerR + value*maxLen, con un grosor angular ligeramente menor que el sector para dejar separación.
Animación: cada barra crece su longitud desde innerR con stagger por índice (easeOutBack para un leve overshoot) y un retardo creciente; color por matiz según el ángulo. Rota lentamente el conjunto y repite en bucle con datos embebidos.
Para rankings circulares, comparativas y dashboards decorativos.`,
  code:`/* Radial bar — arcos gruesos desde innerR hacia innerR+value*maxLen */
const step = (Math.PI*2) / n;
vals.forEach((v, i) => {
  const a0 = i*step, a1 = a0 + step*0.7;        // grosor angular con separación
  const r  = innerR + v * maxLen * easeOut(i);  // longitud animada
  ctx.lineWidth = r - innerR;
  ctx.beginPath();
  ctx.arc(cx, cy, (innerR + r)/2, a0, a1);       // arco como barra
  ctx.strokeStyle = 'hsl(' + (250 + i*14) + ',70%,60%)';
  ctx.stroke();
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const vals=[.85,.55,.95,.4,.7,.6,.9,.5,.75,.45,.8,.35];
    let t=0,raf,run=true,hold=0,rot=0;
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=1;if(t>170){t=0;hold=55;}}
      rot+=0.0025;
      const W=o.W(),H=o.H();x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.46;
      const innerR=R*0.32,maxLen=R-innerR;
      const n=vals.length,step=(Math.PI*2)/n;
      // anillo base sutil
      x.strokeStyle='rgba(123,92,255,.18)';x.lineWidth=1;x.beginPath();x.arc(cx,cy,innerR,0,6.283);x.stroke();
      x.lineCap='round';
      vals.forEach((v,i)=>{
        const local=Math.max(0,Math.min(1,(t-i*7)/26));
        // easeOutBack
        const c1=1.70158,c3=c1+1;const e=1+c3*Math.pow(local-1,3)+c1*Math.pow(local-1,2);
        const a0=rot+i*step+step*0.15;
        const a1=rot+i*step+step*0.85;
        const len=Math.max(0,v*maxLen*e);
        const rMid=innerR+len/2;
        x.lineWidth=Math.max(1,len);
        x.strokeStyle='hsl('+(248+i*12)+',72%,62%)';
        x.beginPath();x.arc(cx,cy,Math.max(innerR+0.5,rMid),a0,a1);x.stroke();
      });
      // punto central
      x.fillStyle='#00e0c6';x.beginPath();x.arc(cx,cy,3,0,6.283);x.fill();
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
