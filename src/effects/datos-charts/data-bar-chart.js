import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-bar-chart', title:'Animated Bar Chart', cat:'Datos / Charts',
  tags:['chart','barras','bar','crecer','datos','viewport','viz'],
  desc:'Barras que crecen desde 0 hasta su valor con stagger al entrar en pantalla. Gráfica de barras viva.',
  meta:['scaleY','stagger','Viz'],
  prompt:`Crea una gráfica de barras animada: al entrar en el viewport, cada barra crece desde 0 hasta su altura final (scaleY con transform-origin:bottom) con un stagger por índice y easing con rebote.
Usa IntersectionObserver para disparar; cada barra anima su altura con delay creciente. Añade etiquetas de valor que cuentan o aparecen al final.
Para dashboards, secciones de resultados e informes.`,
  code:`/* Animated bar chart (al entrar en viewport) */
.bar { transform: scaleY(0); transform-origin: bottom; transition: transform .8s cubic-bezier(.5,1.4,.4,1); }
.in-view .bar { transform: scaleY(1); }
.in-view .bar:nth-child(n) { transition-delay: calc(var(--i)*.1s); }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const vals=[.5,.8,.45,1,.65,.9,.55];let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=1;if(t>120){t=0;hold=40;}}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const pad=18,n=vals.length,bw=(o.W()-pad*2)/n*.6,gap=(o.W()-pad*2)/n,baseY=o.H()-22,maxH=o.H()-44;
      vals.forEach((v,i)=>{const local=Math.max(0,Math.min(1,(t-i*8)/16));const e=local<.5?2*local*local:1-Math.pow(-2*local+2,2)/2;const h=v*maxH*e;x.fillStyle='hsl('+(250+i*8)+',65%,60%)';roundRectTop(x,pad+i*gap+(gap-bw)/2,baseY-h,bw,h,4);x.fill();});
      x.strokeStyle='#2a2a3e';x.beginPath();x.moveTo(pad,baseY);x.lineTo(o.W()-pad,baseY);x.stroke();
      raf=requestAnimationFrame(loop);})();
    function roundRectTop(c,x,y,w,h,r){r=Math.min(r,h);c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+r);c.arcTo(x,y,x+r,y,r);c.arcTo(x+w,y,x+w,y+r,r);c.lineTo(x+w,y+h);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
