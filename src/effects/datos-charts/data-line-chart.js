import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-line-chart', title:'Animated Line Chart', cat:'Datos / Charts',
  tags:['chart','línea','line','area','draw','datos','dibujar'],
  desc:'La línea se dibuja recorriendo los datos y el área se rellena debajo. Gráfica de línea animada.',
  meta:['stroke draw','area fill','Viz'],
  prompt:`Crea una gráfica de línea animada: la línea se dibuja progresivamente (stroke-dashoffset) recorriendo los puntos de datos, y el área bajo ella se rellena con un gradiente que aparece después.
Calcula la polilínea/curva de los datos; anima el dibujo de la línea y luego el fade-in del área. Bonus: un punto que recorre la línea o tooltips.
Para métricas de evolución, tendencias y dashboards.`,
  code:`// Animated line chart — draw + area fill
const len = path.getTotalLength()
path.style.strokeDasharray = len
path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1500 })
// luego: fade-in del <path> de área con gradiente`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const data=[.3,.5,.4,.7,.55,.85,.6,.95];let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.012;if(t>=1.3){t=0;hold=40;}}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const pad=18,n=data.length,baseY=o.H()-20,maxH=o.H()-40;const pts=data.map((v,i)=>[pad+i/(n-1)*(o.W()-pad*2),baseY-v*maxH]);
      const draw=Math.min(1,t);const drawN=draw*(n-1);
      // area
      if(t>.6){const af=Math.min(1,(t-.6)/.5);x.globalAlpha=af*.4;const g=x.createLinearGradient(0,0,0,o.H());g.addColorStop(0,'#7b5cff');g.addColorStop(1,'rgba(123,92,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(pts[0][0],baseY);pts.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(pts[n-1][0],baseY);x.closePath();x.fill();x.globalAlpha=1;}
      // line
      x.strokeStyle='#7b5cff';x.lineWidth=2.5;x.lineJoin='round';x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++){if(i<=drawN){x.lineTo(pts[i][0],pts[i][1]);}else{const seg=drawN-(i-1);if(seg>0){x.lineTo(pts[i-1][0]+(pts[i][0]-pts[i-1][0])*seg,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*seg);}break;}}x.stroke();
      // head dot
      const hi=Math.floor(drawN);if(hi<n-1){const seg=drawN-hi;const hx=pts[hi][0]+(pts[hi+1][0]-pts[hi][0])*seg,hy=pts[hi][1]+(pts[hi+1][1]-pts[hi][1])*seg;x.fillStyle='#00e0c6';x.beginPath();x.arc(hx,hy,3.5,0,6.28);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
