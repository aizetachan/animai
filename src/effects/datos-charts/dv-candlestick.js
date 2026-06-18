import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-candlestick', title:'Candlestick', cat:'Datos / Charts',
  tags:['candlestick','velas','OHLC','finanzas','finance','trading','viz','蜡烛图'],
  desc:'Velas japonesas OHLC que se dibujan progresivamente de izquierda a derecha con mecha y cuerpo.',
  meta:['canvas','OHLC','Viz'],
  prompt:`Crea un gráfico de velas japonesas (candlestick / OHLC): cada dato es {o,h,l,c} (open, high, low, close).
Escala: calcula min(low) y max(high) del conjunto para mapear precios a coordenadas Y. Reparte X uniformemente por índice con un ancho de cuerpo fijo.
Dibujo de cada vela: una mecha (línea vertical de high a low) y un cuerpo (rectángulo entre open y close). Color verde si close>=open (alcista), rojo si baja.
Animación: dibuja las velas progresivamente de izquierda a derecha (stagger por índice); cada vela aparece con su mecha estirándose y el cuerpo creciendo. Repite en bucle con datos embebidos.
Para mercados financieros, cripto y dashboards de trading.`,
  code:`// Candlestick con ECharts
option = {
  xAxis:{ type:'category', data:dates },
  yAxis:{ scale:true },
  series:[{
    type:'candlestick',
    data: ohlc, // [open, close, low, high]
    itemStyle:{ color:'#00e0c6', color0:'#ff5c7b',
                borderColor:'#00e0c6', borderColor0:'#ff5c7b' },
    animationDuration: 1200,
    animationDelay: (i)=> i*60
  }]
};`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    // datos OHLC embebidos
    const raw=[[30,34,28,33],[33,33,29,30],[30,38,30,37],[37,40,35,36],[36,36,31,32],[32,35,30,34],[34,42,34,41],[41,43,38,39],[39,40,33,35],[35,44,34,43]];
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=.02;if(t>=raw.length+1){t=0;hold=50;}}
      const W=o.W(),H=o.H(),pad=14,padB=16;
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const n=raw.length;
      let lo=Infinity,hi=-Infinity;
      raw.forEach(d=>{lo=Math.min(lo,d[2]);hi=Math.max(hi,d[1]);});
      const range=hi-lo||1;
      const plotH=H-pad-padB, plotW=W-pad*2;
      const step=plotW/n, bw=step*.5;
      const Y=v=>pad+(1-(v-lo)/range)*plotH;
      // grid lines
      x.strokeStyle='#1a1a2a';x.lineWidth=1;
      for(let g=0;g<=3;g++){const gy=pad+plotH*g/3;x.beginPath();x.moveTo(pad,gy);x.lineTo(W-pad,gy);x.stroke();}
      raw.forEach((d,i)=>{
        const [op,h,l,c]=d;
        const appear=Math.max(0,Math.min(1,(t-i)/1));
        if(appear<=0)return;
        const e=1-Math.pow(1-appear,3);
        const cx=pad+step*i+step/2;
        const up=c>=op;
        const col=up?'#00e0c6':'#ff5c7b';
        // mecha (crece desde el centro del cuerpo)
        const yh=Y(h),yl=Y(l),yMid=Y((op+c)/2);
        x.strokeStyle=col;x.lineWidth=1.5;x.beginPath();
        x.moveTo(cx,yMid+(yl-yMid)*e);x.lineTo(cx,yMid+(yh-yMid)*e);x.stroke();
        // cuerpo
        const yo=Y(op),yc=Y(c);
        const top=Math.min(yo,yc),bh=Math.max(2,Math.abs(yc-yo))*e;
        x.fillStyle=col;
        x.fillRect(cx-bw/2,(yo+yc)/2-bh/2,bw,bh);
      });
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
