import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-radar', title:'Radar Chart', cat:'Datos / Charts',
  tags:['radar','spider','polígono','datos','skills','chart','araña'],
  desc:'Un gráfico radar/araña cuyo polígono de datos se despliega desde el centro. Para comparar atributos.',
  meta:['polygon','grow','Viz'],
  prompt:`Crea un "radar chart" (gráfico de araña) animado: los ejes radiales con su rejilla poligonal, y el polígono de datos que se despliega desde el centro hasta sus valores con easing.
Dibuja N ejes equiangulares y anillos de rejilla; el polígono de datos interpola sus vértices de 0 (centro) a su valor en cada eje. Vértices con puntos.
Para perfiles de habilidades, comparativas de producto, stats de juego.`,
  code:`// Radar chart — polígono de datos que crece desde el centro
axes.forEach((val, i) => {
  const angle = (i / n) * Math.PI*2 - Math.PI/2
  const r = val * maxR * growth          // growth: 0 -> 1
  vertices.push([cx + Math.cos(angle)*r, cy + Math.sin(angle)*r])
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const vals=[.8,.6,.9,.5,.75,.65];const n=vals.length;let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.015;if(t>=1){t=1;hold=40;}}const e=t<1?(1-Math.pow(1-t,3)):1;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.34;
      // grid
      x.strokeStyle='#1e1e2e';x.lineWidth=1;for(let ring=1;ring<=3;ring++){x.beginPath();for(let i=0;i<=n;i++){const a=i/n*6.283-1.5708;const r=R*ring/3;const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();}
      for(let i=0;i<n;i++){const a=i/n*6.283-1.5708;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);x.stroke();}
      // data polygon
      x.beginPath();vals.forEach((v,i)=>{const a=i/n*6.283-1.5708;const r=v*R*e;const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i?x.lineTo(px,py):x.moveTo(px,py);});x.closePath();x.fillStyle='rgba(123,92,255,.3)';x.fill();x.strokeStyle='#7b5cff';x.lineWidth=2;x.stroke();
      vals.forEach((v,i)=>{const a=i/n*6.283-1.5708;const r=v*R*e;x.fillStyle='#00e0c6';x.beginPath();x.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,3,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
