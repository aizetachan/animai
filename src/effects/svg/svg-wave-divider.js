import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-wave-divider', title:'Wave Divider', cat:'SVG',
  tags:['svg','wave','onda','divider','separador','sección','animado'],
  desc:'Separador de sección con olas SVG animadas. La transición fluida entre bloques de color.',
  meta:['SVG path','wave','Separador'],
  prompt:`Crea un separador de sección con olas SVG animadas entre dos bloques de color.
Genera 2-3 paths de onda (curvas seno) superpuestos con distinta opacidad/velocidad, desplazando su fase con el tiempo (o con animateTransform/CSS) para un movimiento de marea.
Coloca el SVG en el borde inferior de una sección. Suaviza la transición entre secciones de distinto color.`,
  code:`// Wave divider SVG (anima el path por frame)
function wavePath(t, w, h, amp, freq) {
  let d = 'M0 ' + h
  for (let x = 0; x <= w; x += 10) {
    const y = h * 0.5 + Math.sin(x * freq + t) * amp
    d += ' L' + x + ' ' + y
  }
  return d + \` L\${w} \${h} Z\`
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.03;x.fillStyle='#7b5cff';x.fillRect(0,0,o.W(),o.H());
      const layers=[{c:'#00e0c6',a:.5,sp:1,amp:14,off:0},{c:'#0a0a14',a:1,sp:1.3,amp:18,off:.6}];
      layers.forEach(L=>{x.fillStyle=L.c;x.globalAlpha=L.a;x.beginPath();x.moveTo(0,o.H());const base=o.H()*.5;for(let xx=0;xx<=o.W();xx+=8){const yy=base+Math.sin(xx*.02+t*L.sp+L.off*6)*L.amp;x.lineTo(xx,yy);}x.lineTo(o.W(),o.H());x.closePath();x.fill();});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
