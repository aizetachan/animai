import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-waterfall', title:'Waterfall Chart', cat:'Datos / Charts',
  tags:['waterfall','cascada','chart','acumulado','flotante','floating','viz'],
  desc:'Gráfico de cascada con barras flotantes que acumulan variaciones positivas y negativas hasta el total.',
  meta:['canvas','stagger','Viz'],
  prompt:`Crea un "waterfall chart" (gráfico de cascada): partiendo de una base, cada categoría suma o resta un delta, dibujando una barra flotante que arranca donde acabó la anterior (acumulado). Verde para deltas positivos, rosa/rojo para negativos; la primera y la última barra ("total") parten de 0.
Estructura de datos: array de {label, delta, isTotal}. Calcula el acumulado running: cada barra va de runStart a runStart+delta. Conecta las barras con líneas punteadas guía entre el fin de una y el inicio de la siguiente.
Animación: stagger por índice; cada barra crece (interpola su altura desde su base) con easing easeOutCubic y un pequeño retardo creciente. Repite en bucle con datos de ejemplo embebidos.
Para finanzas, P&L, desglose de ingresos/costes y análisis de variación.`,
  code:`/* Waterfall — acumulado running + barras flotantes */
let run = 0;
const bars = data.map(d => {
  const start = d.isTotal ? 0 : run;
  const end   = d.isTotal ? d.delta : run + d.delta;
  run = end;
  return { start, end, up: d.delta >= 0, label: d.label };
});
// y(v) mapea valor->pixel. Cada barra: rect de y(start) a y(end)
bars.forEach((b,i) => drawBar(x(i), y(b.start), y(b.end), b.up ? '#00e0c6' : '#ff5ca8'));`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const data=[
      {label:'Inicio',delta:40,isTotal:true},
      {label:'Q1',delta:25,isTotal:false},
      {label:'Q2',delta:-15,isTotal:false},
      {label:'Q3',delta:30,isTotal:false},
      {label:'Q4',delta:-10,isTotal:false},
      {label:'Total',delta:70,isTotal:true},
    ];
    // precompute running totals
    let run=0;const bars=data.map(d=>{const start=d.isTotal?0:run;const end=d.isTotal?d.delta:run+d.delta;run=end;return{start,end,up:d.delta>=0,total:d.isTotal};});
    const maxV=Math.max(...bars.map(b=>Math.max(b.start,b.end)))*1.1;
    let t=0,raf,run2=true,hold=0;
    (function loop(){if(!run2)return;
      if(hold>0)hold--;else{t+=1;if(t>150){t=0;hold=45;}}
      const W=o.W(),H=o.H();x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const pad=16,baseY=H-20,topY=14,n=bars.length;
      const gap=(W-pad*2)/n,bw=gap*0.62;
      const y=v=>baseY-(v/maxV)*(baseY-topY);
      let prevX=0,prevY=0;
      bars.forEach((b,i)=>{
        const local=Math.max(0,Math.min(1,(t-i*10)/22));
        const e=1-Math.pow(1-local,3);
        const cx=pad+i*gap+(gap-bw)/2;
        const ys=y(b.start),ye=y(b.end);
        // animar desde el inicio de la barra hacia el final
        const curEnd=ys+(ye-ys)*e;
        const top=Math.min(ys,curEnd),h=Math.abs(curEnd-ys);
        // linea guia punteada desde barra anterior
        if(i>0){x.save();x.setLineDash([3,3]);x.strokeStyle='rgba(123,92,255,.35)';x.beginPath();x.moveTo(prevX,prevY);x.lineTo(cx,ys);x.stroke();x.restore();}
        const col=b.total?'#7b5cff':(b.up?'#00e0c6':'#ff5ca8');
        x.fillStyle=col;rr(x,cx,top,bw,Math.max(2,h),3);x.fill();
        prevX=cx+bw;prevY=ye;
      });
      x.strokeStyle='#2a2a3e';x.beginPath();x.moveTo(pad,baseY);x.lineTo(W-pad,baseY);x.stroke();
      raf=requestAnimationFrame(loop);
    })();
    function rr(c,X,Y,w,h,r){r=Math.min(r,h/2,w/2);c.beginPath();c.moveTo(X+r,Y);c.arcTo(X+w,Y,X+w,Y+h,r);c.arcTo(X+w,Y+h,X,Y+h,r);c.arcTo(X,Y+h,X,Y,r);c.arcTo(X,Y,X+w,Y,r);c.closePath();}
    return{stop(){run2=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
