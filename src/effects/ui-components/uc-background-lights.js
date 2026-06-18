import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-background-lights', title:'Background Lights', cat:'UI Components',
  tags:['lights','luces','orbs','orbes','fondo','glow','ambient'],
  desc:'Orbes de luz difusa que laten y se desplazan lentamente creando un fondo ambiental vivo.',
  meta:['Canvas','radialGradient','blur'],
  prompt:`Crea un fondo de "luces" ambientales: varios orbes de luz difusa que flotan y laten sobre un fondo oscuro.
Técnica (Canvas o CSS): genera 4-6 orbes, cada uno un radialGradient suave (centro con color y alpha alto -> transparente en el borde). Colores acento #7b5cff y secundario #00e0c6 (y alguno extra). En canvas usa compositing 'lighter' para que las luces se sumen donde se solapan.
Movimiento: cada orbe sigue una trayectoria lenta (sin/cos del tiempo con fase y velocidad propias) desplazándose por la caja. Latido: el radio/opacidad oscila con sin(t).
Fondo: relleno oscuro casi negro (#08080f) cada frame. Aspecto nebuloso/aurora.
Timings: movimiento muy lento (varios segundos por ciclo); latido ~3-5s.`,
  code:`// Background Lights — Canvas 2D
const orbs = [
  {hue:'#7b5cff', x:.3, y:.3, r:90, sx:.0006, sy:.0004, ph:0},
  {hue:'#00e0c6', x:.7, y:.6, r:80, sx:.0005, sy:.0007, ph:2},
  {hue:'#9d6bff', x:.5, y:.8, r:70, sx:.0008, sy:.0005, ph:4},
];
function frame(t){
  ctx.fillStyle='#08080f'; ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='lighter';
  for(const o of orbs){
    const cx = (o.x + Math.sin(t*o.sx+o.ph)*.25)*W;
    const cy = (o.y + Math.cos(t*o.sy+o.ph)*.25)*H;
    const r = o.r*(1+Math.sin(t*.001+o.ph)*.25);
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,o.hue); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,6.28); ctx.fill();
  }
  ctx.globalCompositeOperation='source-over';
  requestAnimationFrame(frame);
}`,
  /* @render-start */
  render(el){
    el.style.background='#08080f';
    const o=canvasPreview(el),x=o.x;
    const orbs=[
      {c:'rgba(123,92,255,.55)',x:.3,y:.32,r:80,sx:.6,sy:.4,ph:0},
      {c:'rgba(0,224,198,.50)',x:.7,y:.62,r:72,sx:.5,sy:.7,ph:2},
      {c:'rgba(157,107,255,.45)',x:.5,y:.82,r:64,sx:.8,sy:.5,ph:4},
      {c:'rgba(0,224,198,.40)',x:.78,y:.22,r:58,sx:.45,sy:.6,ph:5}
    ];
    let raf,run=true,t0=performance.now();
    (function loop(){if(!run)return;
      const t=(performance.now()-t0)/1000;const W=o.W(),H=o.H();
      x.fillStyle='#08080f';x.fillRect(0,0,W,H);
      x.globalCompositeOperation='lighter';
      for(const ob of orbs){
        const cx=(ob.x+Math.sin(t*ob.sx*.5+ob.ph)*.22)*W;
        const cy=(ob.y+Math.cos(t*ob.sy*.5+ob.ph)*.22)*H;
        const r=ob.r*(1+Math.sin(t*.6+ob.ph)*.25);
        const g=x.createRadialGradient(cx,cy,0,cx,cy,r);
        g.addColorStop(0,ob.c);g.addColorStop(1,'transparent');
        x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,6.28);x.fill();
      }
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
