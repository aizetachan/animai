import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pt-curl-noise', title:'Curl Noise Field', cat:'Partículas',
  tags:['curl noise','flujo','turbulento','divergence-free','partículas','fluido','vector field'],
  desc:'Partículas que fluyen por un campo de curl-noise: turbulencia incompresible sin fuentes ni sumideros.',
  meta:['Canvas 2D','curl noise','flujo'],
  prompt:`Genera un campo de velocidades libre de divergencia usando curl noise y haz que las partículas lo sigan.
Define un potencial escalar n(x,y) (ruido suave). El campo de curl en 2D es el gradiente rotado 90°: v = (∂n/∂y, -∂n/∂x). Como es el rotacional de un potencial, el flujo es incompresible (no hay fuentes/sumideros), dando remolinos turbulentos naturales.
Aproxima las derivadas por diferencias finitas: ∂n/∂x ≈ (n(x+e,y)-n(x-e,y))/2e. Avanza cada partícula por v·dt, deja estela con fade y reinicia las que salgan. Marca: #7b5cff / #00e0c6.`,
  code:`// Curl noise 2D — campo libre de divergencia v = (∂n/∂y, -∂n/∂x)
const e=1.0;
function noise(x,y){ // potencial escalar suave
  return Math.sin(x*1.3+t)*Math.cos(y*1.1) + Math.sin(y*0.7-t*0.5)*0.6;
}
function curl(x,y){
  const dndx=(noise(x+e,y)-noise(x-e,y))/(2*e);
  const dndy=(noise(x,y+e)-noise(x,y-e))/(2*e);
  return { x: dndy, y: -dndx }; // gradiente rotado 90° → rotacional
}
particles.forEach(p=>{ const v=curl(p.x*0.01,p.y*0.01); p.x+=v.x*S; p.y+=v.y*S; });`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=420,P=[];
    for(let i=0;i<N;i++)P.push({x:Math.random()*o.W(),y:Math.random()*o.H(),life:Math.random()*120});
    let t=0,raf,run=true;const e=0.6,SC=0.012,SP=2.4;
    function noise(a,b){return Math.sin(a*1.3+t)*Math.cos(b*1.1)+Math.sin(b*0.7-t*0.5)*0.6+Math.cos(a*0.5+b*0.9)*0.5;}
    x.fillStyle='#06060f';x.fillRect(0,0,o.W(),o.H());
    (function loop(){if(!run)return;t+=0.006;
      x.fillStyle='rgba(6,6,15,.07)';x.fillRect(0,0,o.W(),o.H());
      x.globalCompositeOperation='lighter';
      const W=o.W(),H=o.H();
      P.forEach(p=>{const ax=p.x*SC,ay=p.y*SC;
        const dndx=(noise(ax+e*SC,ay)-noise(ax-e*SC,ay))/(2*e*SC);
        const dndy=(noise(ax,ay+e*SC)-noise(ax,ay-e*SC))/(2*e*SC);
        let vx=dndy,vy=-dndx;
        const px=p.x,py=p.y;
        p.x+=vx*SP*0.06;p.y+=vy*SP*0.06;p.life--;
        if(p.life<0||p.x<0||p.x>W||p.y<0||p.y>H){p.x=Math.random()*W;p.y=Math.random()*H;p.life=80+Math.random()*80;return;}
        const sp=Math.min(1,Math.hypot(vx,vy)*0.5);
        const c=sp>0.5?'0,224,198':'123,92,255';
        x.strokeStyle='rgba('+c+',.55)';x.lineWidth=1;
        x.beginPath();x.moveTo(px,py);x.lineTo(p.x,p.y);x.stroke();});
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
