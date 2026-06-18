import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-gauge-arc', title:'Gauge Meter', cat:'Datos / Charts',
  tags:['gauge','medidor','arco','aguja','velocímetro','semicírculo','datos'],
  desc:'Un medidor semicircular con aguja que barre hasta el valor, con zonas de color. Velocímetro/gauge.',
  meta:['arc','needle','Viz'],
  prompt:`Crea un "gauge meter" semicircular (velocímetro): un arco de 180° dividido en zonas de color (verde/ámbar/rojo) y una aguja que barre desde el mínimo hasta el valor con un leve overshoot elástico.
Dibuja el arco de fondo por zonas, anima el ángulo de la aguja hacia el target con spring, y muestra el valor numérico debajo.
Para KPIs de rendimiento, velocidad, capacidad, scores.`,
  code:`// Gauge meter — aguja con spring hacia el valor
const angle = Math.PI + (value/max) * Math.PI   // 180° -> 360°
needleAngle += (angle - needleAngle) * 0.1       // spring
drawNeedle(cx, cy, needleAngle)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let target=.7,needle=Math.PI,t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.01;if(t%2<.02)target=.2+Math.random()*.7;const ta=Math.PI+target*Math.PI;needle+=(ta-needle)*.08;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()*.66,R=Math.min(o.W(),o.H())*.36;
      const zones=[['#00e0c6',.5],['#ffd166',.8],['#ff5ca8',1]];let prev=0;x.lineWidth=10;zones.forEach(([col,end])=>{x.strokeStyle=col;x.beginPath();x.arc(cx,cy,R,Math.PI+prev*Math.PI,Math.PI+end*Math.PI);x.stroke();prev=end;});
      x.save();x.translate(cx,cy);x.rotate(needle);x.strokeStyle='#eef0f7';x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(8,0);x.lineTo(-R*.85,0);x.stroke();x.restore();x.fillStyle='#eef0f7';x.beginPath();x.arc(cx,cy,6,0,6.28);x.fill();
      x.fillStyle='#7b5cff';x.font='800 18px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(Math.round(((needle-Math.PI)/Math.PI)*100),cx,cy+R*.5);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
