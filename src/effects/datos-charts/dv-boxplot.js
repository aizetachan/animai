import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-boxplot', title:'Box Plot', cat:'Datos / Charts',
  tags:['boxplot','caja','bigotes','whisker','cuartiles','estadística','viz','箱线图'],
  desc:'Diagramas de caja y bigotes con mediana, cuartiles y outliers que aparecen con stagger.',
  meta:['canvas','quartiles','Viz'],
  prompt:`Crea un Box Plot (diagrama de caja y bigotes): cada categoría es {min, q1, median, q3, max} (mínimo, primer cuartil, mediana, tercer cuartil, máximo).
Escala: mapea el rango global [min, max] del conjunto al eje Y. Reparte categorías uniformemente por índice en el eje X con un ancho de caja fijo.
Dibujo de cada caja: bigote vertical de min a max con tapas horizontales; un rectángulo entre q1 y q3; una línea de mediana dentro de la caja.
Animación: cada box aparece con stagger por índice; la caja crece verticalmente desde la mediana hacia q1/q3 y los bigotes se extienden; repite en bucle con datos embebidos.
Para distribuciones, comparación de grupos y análisis estadístico.`,
  code:`// Box plot con ECharts
option = {
  yAxis:{ type:'value' },
  xAxis:{ type:'category', data:groups },
  series:[{
    type:'boxplot',
    data: stats, // [min, Q1, median, Q3, max] por categoría
    itemStyle:{ color:'rgba(123,92,255,.35)', borderColor:'#7b5cff' },
    animationDuration: 900,
    animationDelay: (i)=> i*150
  }]
};`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    // [min, q1, median, q3, max]
    const data=[[12,28,38,52,70],[20,35,44,60,82],[8,22,30,42,58],[30,46,55,68,88]];
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=.02;if(t>=data.length+1.2){t=0;hold=50;}}
      const W=o.W(),H=o.H(),pad=16,padB=14,padT=12;
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      let lo=Infinity,hi=-Infinity;
      data.forEach(d=>{lo=Math.min(lo,d[0]);hi=Math.max(hi,d[4]);});
      const range=hi-lo||1, plotH=H-padT-padB;
      const Y=v=>padT+(1-(v-lo)/range)*plotH;
      const n=data.length, step=(W-pad*2)/n, bw=step*.46;
      // grid
      x.strokeStyle='#1a1a2a';x.lineWidth=1;
      for(let g=0;g<=3;g++){const gy=padT+plotH*g/3;x.beginPath();x.moveTo(pad,gy);x.lineTo(W-pad,gy);x.stroke();}
      data.forEach((d,i)=>{
        const [mn,q1,md,q3,mx]=d;
        const appear=Math.max(0,Math.min(1,(t-i)/1));
        if(appear<=0)return;
        const e=1-Math.pow(1-appear,3);
        const cx=pad+step*i+step/2;
        const yMd=Y(md);
        // bigotes (crecen desde la mediana)
        const yMin=yMd+(Y(mn)-yMd)*e, yMax=yMd+(Y(mx)-yMd)*e;
        x.strokeStyle='#00e0c6';x.lineWidth=1.5;
        x.beginPath();x.moveTo(cx,yMin);x.lineTo(cx,yMax);x.stroke();
        // tapas
        x.beginPath();x.moveTo(cx-bw*.3,yMin);x.lineTo(cx+bw*.3,yMin);x.moveTo(cx-bw*.3,yMax);x.lineTo(cx+bw*.3,yMax);x.stroke();
        // caja (crece desde la mediana)
        const yQ1=yMd+(Y(q1)-yMd)*e, yQ3=yMd+(Y(q3)-yMd)*e;
        x.fillStyle='rgba(123,92,255,.32)';
        x.fillRect(cx-bw/2,yQ3,bw,Math.max(1,yQ1-yQ3));
        x.strokeStyle='#7b5cff';x.lineWidth=1.5;
        x.strokeRect(cx-bw/2,yQ3,bw,Math.max(1,yQ1-yQ3));
        // mediana
        if(e>.3){x.strokeStyle='#fff';x.lineWidth=2;x.globalAlpha=Math.min(1,(e-.3)/.5);
          x.beginPath();x.moveTo(cx-bw/2,yMd);x.lineTo(cx+bw/2,yMd);x.stroke();x.globalAlpha=1;}
      });
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
