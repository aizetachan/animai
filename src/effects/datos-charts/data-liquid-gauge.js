import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-liquid-gauge', title:'Liquid Gauge', cat:'Datos / Charts',
  tags:['gauge','líquido','wave','llenar','porcentaje','agua','medidor'],
  desc:'Un círculo se llena con un líquido ondulante hasta el porcentaje. Medidor de agua animado.',
  meta:['wave fill','clip','Viz'],
  prompt:`Crea un "liquid gauge": un círculo que se llena con un líquido cuyo nivel sube hasta el porcentaje objetivo, con la superficie ondulando (olas seno animadas).
Recorta una forma de onda dentro del círculo; la altura de la onda = nivel%; anima la fase de las olas. El texto del % va centrado (cambia de color al cruzar el nivel).
Para indicadores de carga, batería, hidratación o métricas con personalidad.`,
  code:`// Liquid gauge — onda seno recortada en círculo, nivel = %
const level = H - pct * H
ctx.beginPath()
for (let x = 0; x <= W; x++) {
  const y = level + Math.sin(x*0.05 + phase) * amp
  ctx.lineTo(x, y)
}
ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill()   // recortado por el círculo`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true,level=0;const target=.65;
    (function loop(){if(!run)return;t+=.05;level+=(target-level)*.03;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.32;
      x.save();x.beginPath();x.arc(cx,cy,R,0,6.28);x.clip();
      x.fillStyle='#0e1530';x.fillRect(cx-R,cy-R,R*2,R*2);
      const lvlY=cy+R-level*R*2;const g=x.createLinearGradient(0,lvlY,0,cy+R);g.addColorStop(0,'#00e0c6');g.addColorStop(1,'#7b5cff');x.fillStyle=g;
      x.beginPath();x.moveTo(cx-R,cy+R);for(let xx=-R;xx<=R;xx+=4){const yy=lvlY+Math.sin(xx*.06+t)*5;x.lineTo(cx+xx,yy);}x.lineTo(cx+R,cy+R);x.closePath();x.fill();
      x.beginPath();x.moveTo(cx-R,cy+R);for(let xx=-R;xx<=R;xx+=4){const yy=lvlY+Math.sin(xx*.06+t+1.5)*5+3;x.lineTo(cx+xx,yy);}x.lineTo(cx+R,cy+R);x.closePath();x.globalAlpha=.5;x.fill();x.globalAlpha=1;
      x.restore();
      x.strokeStyle='#2a2a4a';x.lineWidth=3;x.beginPath();x.arc(cx,cy,R,0,6.28);x.stroke();
      x.fillStyle='#fff';x.font='800 '+R*.45+'px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(Math.round(level*100)+'%',cx,cy);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
