import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-pill-tabs', title:'Pill Segment Control', cat:'Navegación',
  tags:['segment','pill','tabs','toggle','ios','deslizar','selector'],
  desc:'Un control segmentado tipo iOS donde un pill se desliza bajo la opción activa. Selector de vistas.',
  meta:['sliding pill','spring','iOS'],
  prompt:`Crea un "segmented control" estilo iOS: varias opciones en una pista redondeada con un pill de fondo que se desliza (con un leve rebote) hasta la opción seleccionada, que cambia a texto resaltado.
El pill anima su posición/ancho con spring hacia el segmento activo; el texto activo cambia de color. Compacto.
Para alternar vistas (lista/cuadrícula), filtros rápidos, toggles de pocas opciones.`,
  code:`/* Segmented control (pill desliza) */
.pill {
  position: absolute; height: 100%; border-radius: 999px; background: #7b5cff;
  transition: transform .4s cubic-bezier(.5,1.5,.4,1), width .4s;
}
/* pill.transform = translateX(activeOffset); ancho = activeWidth */`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const segs=['Día','Semana','Mes','Año'];let act=0,t=0,raf,run=true,curX=0,curW=0;
    (function loop(){if(!run)return;t++;if(t%55===0)act=(act+1)%segs.length;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const pad=20,trackW=o.W()-pad*2,segW=trackW/segs.length,trackY=o.H()/2-16,trackH=32;
      x.fillStyle='#16162a';roundRect(x,pad,trackY,trackW,trackH,16);x.fill();
      const tx=pad+act*segW;curX+=(tx-curX)*.2;curW+=(segW-curW)*.2;x.fillStyle='#7b5cff';roundRect(x,curX+3,trackY+3,curW-6,trackH-6,13);x.fill();
      segs.forEach((sg,i)=>{x.fillStyle=i===act?'#fff':'#8a8ca3';x.font='600 12px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(sg,pad+i*segW+segW/2,trackY+trackH/2);});
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
