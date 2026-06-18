import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-funnel', title:'Funnel Chart', cat:'Datos / Charts',
  tags:['funnel','embudo','conversion','conversión','chart','trapezoid','viz'],
  desc:'Embudo de conversión con segmentos trapezoidales que se llenan y estrechan en cada etapa.',
  meta:['canvas','stagger','Viz'],
  prompt:`Crea un "funnel chart" (embudo de conversión): una pila vertical de segmentos trapezoidales. Cada etapa tiene un valor menor que la anterior; el ancho del segmento es proporcional a su valor respecto al máximo, centrado horizontalmente, de modo que el conjunto forma un embudo que se estrecha hacia abajo.
Estructura de datos: array de {label, value}. Calcula el ancho de cada banda como (value/maxValue)*anchoMax. Cada segmento se dibuja como trapecio entre su ancho superior (etapa actual) y el ancho de la etapa siguiente.
Animación: cada banda se "llena" de izquierda/centro hacia fuera o crece su ancho con stagger por índice (easeOutCubic) y un retardo creciente. Muestra el porcentaje de conversión respecto a la primera etapa. Repite en bucle con datos embebidos.
Para análisis de conversión, marketing y ventas.`,
  code:`/* Funnel — trapecios por etapa, ancho proporcional al valor */
const max = data[0].value;
const widthAt = v => (v / max) * maxWidth;
data.forEach((d, i) => {
  const wTop = widthAt(d.value);
  const wBot = widthAt(data[i+1] ? data[i+1].value : d.value);
  // trapecio centrado: (cx-wTop/2,yTop)->(cx+wTop/2,yTop)->(cx+wBot/2,yBot)->(cx-wBot/2,yBot)
  drawTrapezoid(cx, yTop, yBot, wTop, wBot, color[i]);
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const data=[
      {label:'Visitas',value:100},
      {label:'Registros',value:64},
      {label:'Carrito',value:38},
      {label:'Pago',value:22},
      {label:'Compra',value:12},
    ];
    const cols=['#7b5cff','#6a6bff','#3a9bff','#00c6e0','#00e0c6'];
    const max=data[0].value;
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=1;if(t>160){t=0;hold=50;}}
      const W=o.W(),H=o.H();x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const pad=14,topY=14,botY=H-14,n=data.length;
      const maxW=W-pad*2;
      const segH=(botY-topY)/n;
      data.forEach((d,i)=>{
        const local=Math.max(0,Math.min(1,(t-i*12)/24));
        const e=1-Math.pow(1-local,3);
        const next=data[i+1]?data[i+1].value:d.value;
        const wTop=(d.value/max)*maxW*e;
        const wBot=(next/max)*maxW*e;
        const yTop=topY+i*segH,yBot=yTop+segH-4;
        const cx=W/2;
        x.fillStyle=cols[i];
        x.beginPath();
        x.moveTo(cx-wTop/2,yTop);
        x.lineTo(cx+wTop/2,yTop);
        x.lineTo(cx+wBot/2,yBot);
        x.lineTo(cx-wBot/2,yBot);
        x.closePath();x.fill();
        // porcentaje
        if(e>0.85){x.fillStyle='rgba(255,255,255,.92)';x.font='700 11px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(Math.round(d.value/max*100)+'%',cx,yTop+segH/2-2);}
      });
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
