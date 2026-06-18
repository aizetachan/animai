import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-heatmap', title:'Activity Heatmap', cat:'Datos / Charts',
  tags:['heatmap','calendario','github','contribuciones','celdas','intensidad','grid'],
  desc:'Una rejilla de celdas que se rellenan según intensidad, como el calendario de contribuciones de GitHub.',
  meta:['grid','intensity','Viz'],
  prompt:`Crea un "activity heatmap" estilo GitHub: una rejilla de celdas (semanas × días) donde cada una toma un color según su valor/intensidad, apareciendo con un stagger en barrido diagonal al cargar.
Mapea cada valor a un nivel de color (de vacío a intenso); revela las celdas con delay proporcional a su posición (onda diagonal). Tooltip al hover opcional.
Para paneles de actividad, rachas, hábitos y contribuciones.`,
  code:`// Activity heatmap — color por intensidad + reveal diagonal
cells.forEach(c => {
  const level = Math.min(4, Math.floor(c.value * 5))   // 0..4
  c.color = palette[level]
  c.delay = (c.col + c.row) * 20                        // onda diagonal
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cols=14,rows=7;let cells=[];const pal=['#16162a','#2a2456','#5a3fd6','#7b5cff','#a78bff'];
    function build(){cells=[];for(let c=0;c<cols;c++)for(let r=0;r<rows;r++)cells.push({c,r,lvl:Math.floor(Math.random()*Math.random()*5),delay:(c+r)*4});}
    build();let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=1;if(t>140){t=0;hold=40;build();}}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const pad=14,gap=2,cw=(o.W()-pad*2-gap*(cols-1))/cols,ch=(o.H()-pad*2-gap*(rows-1))/rows;const sz=Math.min(cw,ch);const ox=(o.W()-(sz*cols+gap*(cols-1)))/2,oy=(o.H()-(sz*rows+gap*(rows-1)))/2;
      cells.forEach(cl=>{const local=Math.max(0,Math.min(1,(t-cl.delay)/12));if(local>.02){x.globalAlpha=local;x.fillStyle=pal[cl.lvl];roundRect(x,ox+cl.c*(sz+gap),oy+cl.r*(sz+gap),sz*local,sz*local,2);x.fill();}});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
