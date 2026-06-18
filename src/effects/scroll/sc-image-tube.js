import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-image-tube', title:'Image Tube Gallery', cat:'Scroll',
  tags:['tube','cilindro','3d','gallery','scroll','canvas','carousel'],
  desc:'Galería de tarjetas dispuestas en un cilindro 3D que rota y avanza con el scroll.',
  meta:['Canvas 2D','3D projection','scroll %'],
  prompt:`Crea una galería tipo cilindro 3D en canvas 2D que rota con el progreso de scroll.
Estructura de datos: N paneles repartidos uniformemente en un anillo (ángulo base = i/N*2π). Cada panel tiene un color/etiqueta.
Algoritmo de layout/proyección: el progreso de scroll 0->1 define un ángulo global theta. Para cada panel, ang = baseAngle + theta. Posición en el espacio: x = sin(ang)*radio, z = cos(ang)*radio. Proyección perspectiva: scale = focal/(focal - z) (z hacia la cámara). Dibuja como rectángulo escalado por scale, centrado en x*scale. Ordena por z (pintor: dibuja primero los lejanos). La opacidad y un velo oscuro aumentan con la profundidad para dar sensación de tubo.
Timing: en demo anima theta de forma continua (rotación constante) simulando scroll infinito.`,
  code:`// Image tube: paneles en anillo proyectados con perspectiva
const N = 8, R = 120, focal = 320;
function frame(theta){
  ctx.clearRect(0,0,W,H);
  const panels = [];
  for (let i=0;i<N;i++){
    const a = (i/N)*Math.PI*2 + theta;
    const z = Math.cos(a)*R, x = Math.sin(a)*R;
    panels.push({ i, x, z, scale: focal/(focal - z) });
  }
  panels.sort((p,q)=> p.z - q.z); // lejanos primero
  panels.forEach(p => {
    const w = 70*p.scale, h = 90*p.scale;
    const px = W/2 + p.x*p.scale;
    ctx.globalAlpha = Math.max(0.15, Math.min(1,(p.z+R)/(2*R)));
    drawCard(px, H/2, w, h, p.i);
  });
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=8,R=70,focal=240;
    const colors=['#7b5cff','#00e0c6','#9d7bff','#3ad6c4','#6f4cff','#00c2a8','#b39bff','#22e8d0'];
    let theta=0,raf,run=true;
    function card(cx,cy,w,h,i,depth){
      x.save();
      x.translate(cx,cy);
      // sombra/marco
      x.fillStyle=colors[i%colors.length];
      const r=Math.min(8,w*.18);
      x.beginPath();
      x.moveTo(-w/2+r,-h/2);
      x.arcTo(w/2,-h/2,w/2,h/2,r);
      x.arcTo(w/2,h/2,-w/2,h/2,r);
      x.arcTo(-w/2,h/2,-w/2,-h/2,r);
      x.arcTo(-w/2,-h/2,w/2,-h/2,r);
      x.closePath();
      x.fill();
      // brillo interior
      x.fillStyle='rgba(255,255,255,.12)';
      x.fillRect(-w/2+w*.12,-h/2+h*.12,w*.4,h*.18);
      // velo de profundidad
      x.fillStyle='rgba(6,6,18,'+(1-depth)*0.75+')';
      x.beginPath();
      x.moveTo(-w/2+r,-h/2);
      x.arcTo(w/2,-h/2,w/2,h/2,r);
      x.arcTo(w/2,h/2,-w/2,h/2,r);
      x.arcTo(-w/2,h/2,-w/2,-h/2,r);
      x.arcTo(-w/2,-h/2,w/2,-h/2,r);
      x.closePath();
      x.fill();
      x.restore();
    }
    (function loop(){if(!run)return;
      theta+=.012; // progreso de scroll simulado (rotación continua)
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a16';x.fillRect(0,0,W,H);
      const panels=[];
      for(let i=0;i<N;i++){
        const a=(i/N)*Math.PI*2+theta;
        const z=Math.cos(a)*R, px=Math.sin(a)*R;
        panels.push({i,px,z,scale:focal/(focal-z)});
      }
      panels.sort((p,q)=>p.z-q.z); // pintor: lejanos primero
      panels.forEach(p=>{
        const w=46*p.scale,h=64*p.scale;
        const cx=W/2+p.px*p.scale;
        const depth=Math.max(0,Math.min(1,(p.z+R)/(2*R)));
        x.globalAlpha=0.35+depth*0.65;
        card(cx,H/2,w,h,p.i,depth);
      });
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
