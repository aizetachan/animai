import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-icon-cloud', title:'Icon Cloud', cat:'UI Components',
  tags:['cloud','esfera','sphere','iconos','3d','rotate','magic ui'],
  desc:'Esfera 3D de iconos/puntos distribuidos uniformemente que rota con proyección esférica.',
  meta:['Canvas 2D','spherical projection','Magic UI'],
  prompt:`Recrea el Icon Cloud de Magic UI: una nube esférica de iconos (o puntos) que rota lentamente en 3D, proyectada en un canvas 2D.
Técnica: distribuye N puntos uniformemente sobre una esfera con la espiral de Fibonacci (y de -1 a 1, radio = sqrt(1-y²), ángulo = i * incremento áureo ~2.39996). Cada frame rota todos los puntos alrededor del eje Y (y opcional X) multiplicando por una matriz de rotación. Proyecta a 2D con perspectiva: scale = focal/(focal - z); dibuja cada punto con radio y opacidad según z (los del frente más grandes y opacos). Ordena por z para pintar de atrás a delante.
Datos: ~50 puntos, radio esfera ~80px, focal ~300, velocidad de rotación lenta. Color de marca violeta/cian.`,
  code:`// Magic UI — Icon Cloud (proyección esférica en canvas 2D)
const N=50, R=80, focal=300, pts=[];
for(let i=0;i<N;i++){const y=1-(i/(N-1))*2, r=Math.sqrt(1-y*y), th=i*2.39996;
  pts.push({x:Math.cos(th)*r, y, z:Math.sin(th)*r});}
function frame(t){
  const cy=Math.cos(t*0.01), sy=Math.sin(t*0.01);
  pts.map(p=>{const x=p.x*cy - p.z*sy, z=p.x*sy + p.z*cy;
    const s=focal/(focal - z*R); return {sx:x*R*s, sy:p.y*R*s, z, s};})
  .sort((a,b)=>a.z-b.z); // pintar de atrás a delante
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=52,pts=[];
    for(let i=0;i<N;i++){const y=1-(i/(N-1))*2;const r=Math.sqrt(Math.max(0,1-y*y));const th=i*2.39996;
      pts.push({x:Math.cos(th)*r,y:y,z:Math.sin(th)*r,c:i%3===0?'0,224,198':'123,92,255'});}
    let t=0,raf,run=true;const focal=320;
    (function loop(){if(!run)return;t+=1;
      const W=o.W(),H=o.H();x.clearRect(0,0,W,H);
      x.fillStyle='#0a0a12';x.fillRect(0,0,W,H);
      const R=Math.min(W,H)*0.36,cx=W/2,cy=H/2;
      const ay=t*0.012,ax=Math.sin(t*0.006)*0.4;
      const cay=Math.cos(ay),say=Math.sin(ay),cax=Math.cos(ax),sax=Math.sin(ax);
      const proj=pts.map(p=>{
        let X=p.x*cay-p.z*say, Z=p.x*say+p.z*cay, Y=p.y;
        const Y2=Y*cax-Z*sax, Z2=Y*sax+Z*cax;
        const s=focal/(focal-Z2*R);
        return {sx:cx+X*R*s, sy:cy+Y2*R*s, z:Z2, s:s, c:p.c};
      }).sort((a,b)=>a.z-b.z);
      proj.forEach(p=>{
        const depth=(p.z+1)/2; // 0 atrás, 1 frente
        const rad=2.2+depth*4.2;
        const op=0.25+depth*0.75;
        x.beginPath();x.arc(p.sx,p.sy,rad,0,6.283);
        x.fillStyle='rgba('+p.c+','+op+')';
        x.shadowColor='rgba('+p.c+','+(op*0.8)+')';x.shadowBlur=depth*10;
        x.fill();x.shadowBlur=0;
      });
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
