import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-dot-reactive', title:'Dot Grid Reactive', cat:'Shaders WebGL',
  tags:['dots','grid','reactive','cursor','onda','escala','puntos'],
  desc:'Rejilla de puntos que reaccionan al cursor con escala y brillo en onda. Fondo tech vivo.',
  meta:['Canvas 2D','distancia','Reactive'],
  prompt:`Crea una rejilla de puntos regular que reacciona al cursor: los puntos cercanos crecen y brillan, con una onda concéntrica que parte del ratón.
Para cada punto, escala y opacidad dependen de la distancia al cursor combinada con un seno temporal (onda). Sin cursor, una onda automática recorre la rejilla.
Fondo tech limpio, muy usado en landings de SaaS/dev tools.`,
  code:`// Dot grid reactive
dots.forEach(d => {
  const dist = Math.hypot(d.x - mouseX, d.y - mouseY)
  const pulse = Math.sin(dist * 0.05 - time)
  const scale = 1 + Math.max(0, 1 - dist/150) * 2 + pulse*0.3
  ctx.globalAlpha = 0.3 + Math.max(0, 1 - dist/150)
  drawDot(d.x, d.y, baseSize * scale)
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const gap=20,dots=[];function grid(){dots.length=0;for(let yy=gap/2;yy<o.H();yy+=gap)for(let xx=gap/2;xx<o.W();xx+=gap)dots.push({x:xx,y:yy});}
    grid();let mx=-999,my=-999,t=0,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;t+=.08;a+=.02;if(!hover){mx=o.W()*(.5+Math.cos(a)*.4);my=o.H()*(.5+Math.sin(a*1.3)*.4);}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      dots.forEach(d=>{const dist=Math.hypot(d.x-mx,d.y-my);const pulse=Math.sin(dist*.05-t);const near=Math.max(0,1-dist/150);const sz=1+near*2.5+pulse*.4;x.globalAlpha=.2+near;x.fillStyle=near>.4?'#00e0c6':'#7b5cff';x.beginPath();x.arc(d.x,d.y,Math.max(.5,sz),0,6.28);x.fill();});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
