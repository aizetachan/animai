import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-area-stacked', title:'Stacked Area Chart', cat:'Datos / Charts',
  tags:['area','stacked','apilado','chart','capas','datos','crecer'],
  desc:'Varias series apiladas cuyas áreas crecen desde la base con un degradado. Gráfica de área apilada.',
  meta:['stacked','grow','Viz'],
  prompt:`Crea una gráfica de área apilada animada: 2-3 series cuyas áreas se apilan unas sobre otras y crecen desde la base hasta su forma final, cada una con su color/gradiente.
Calcula la línea acumulada de cada serie; anima la altura (de 0 a su valor) con un easing. Las áreas semitransparentes se solapan/apilan.
Para mostrar composición a lo largo del tiempo (ingresos por canal, tráfico por fuente).`,
  code:`// Stacked area — cada serie suma sobre la anterior
let baseline = data.map(() => H)
series.forEach(s => {
  const top = s.values.map((v, i) => baseline[i] - v * grow)
  drawArea(top, baseline, s.gradient)
  baseline = top   // la siguiente se apila encima
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const n=8;const series=[{c:'#7b5cff',v:[.2,.3,.25,.35,.3,.4,.35,.45]},{c:'#00e0c6',v:[.15,.2,.3,.2,.25,.2,.3,.25]},{c:'#ff5ca8',v:[.1,.15,.1,.2,.15,.2,.15,.2]}];
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.015;if(t>=1){t=1;hold=45;}}const e=t<1?1-Math.pow(1-t,3):1;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const pad=16,baseY=o.H()-18,maxH=o.H()-36;
      let baseline=new Array(n).fill(baseY);
      series.forEach(s=>{const top=s.v.map((v,i)=>baseline[i]-v*maxH*e);x.beginPath();x.moveTo(pad,baseline[0]);for(let i=0;i<n;i++)x.lineTo(pad+i/(n-1)*(o.W()-pad*2),top[i]);for(let i=n-1;i>=0;i--)x.lineTo(pad+i/(n-1)*(o.W()-pad*2),baseline[i]);x.closePath();const g=x.createLinearGradient(0,0,0,o.H());g.addColorStop(0,s.c);g.addColorStop(1,s.c+'44');x.fillStyle=g;x.globalAlpha=.75;x.fill();x.globalAlpha=1;x.strokeStyle=s.c;x.lineWidth=1.5;x.beginPath();top.forEach((ty,i)=>{const px=pad+i/(n-1)*(o.W()-pad*2);i?x.lineTo(px,ty):x.moveTo(px,ty);});x.stroke();baseline=top;});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
