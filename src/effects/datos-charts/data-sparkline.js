import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-sparkline', title:'Sparkline Pulse', cat:'Datos / Charts',
  tags:['sparkline','mini','línea','pulso','live','datos','tiempo real'],
  desc:'Mini-gráfica de línea en vivo con un punto que pulsa en el último valor. Sparkline de dashboard.',
  meta:['live','pulse','Viz'],
  prompt:`Crea un "sparkline" en vivo: una mini-gráfica de línea compacta (sin ejes) que se desplaza mostrando los últimos N valores en tiempo real, con un punto pulsante en el valor más reciente.
Mantén un buffer de valores; cada cierto tiempo añade uno nuevo y desplaza; redibuja la línea y pulsa el último punto (anillo que crece y desvanece). Tinte según tendencia (sube=verde, baja=rojo).
Para widgets de métricas live, tickers y dashboards densos.`,
  code:`// Sparkline live — buffer desplazante + punto pulsante
buffer.push(newValue); if (buffer.length > N) buffer.shift()
drawLine(buffer)
const last = points[points.length-1]
drawPulse(last.x, last.y, pulsePhase)   // anillo que crece y se desvanece`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=40;let buf=[];for(let i=0;i<N;i++)buf.push(.5);let t=0,raf,run=true,v=.5;
    (function loop(){if(!run)return;t+=.05;if(t%0.18<.05){}buf.push(v);v+=(Math.random()-.5)*.15;v=Math.max(.1,Math.min(.9,v));if(buf.length>N)buf.shift();
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const pad=16,baseY=o.H()-pad,maxH=o.H()-pad*2;const up=buf[buf.length-1]>=buf[buf.length-2];const col=up?'#00e0c6':'#ff5ca8';
      const pts=buf.map((val,i)=>[pad+i/(N-1)*(o.W()-pad*2),baseY-val*maxH]);
      const g=x.createLinearGradient(0,0,0,o.H());g.addColorStop(0,col);g.addColorStop(1,'transparent');x.fillStyle=g;x.globalAlpha=.25;x.beginPath();x.moveTo(pts[0][0],baseY);pts.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(pts[N-1][0],baseY);x.fill();x.globalAlpha=1;
      x.strokeStyle=col;x.lineWidth=2;x.lineJoin='round';x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
      const last=pts[N-1];const pulse=(t*2)%1;x.strokeStyle=col;x.globalAlpha=1-pulse;x.beginPath();x.arc(last[0],last[1],2+pulse*8,0,6.28);x.stroke();x.globalAlpha=1;x.fillStyle=col;x.beginPath();x.arc(last[0],last[1],3,0,6.28);x.fill();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
