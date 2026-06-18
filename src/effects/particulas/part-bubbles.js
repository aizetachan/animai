import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'part-bubbles', title:'Bubbles Rise', cat:'Partículas',
  tags:['bubbles','burbujas','ascender','agua','relax','fondo','flotar'],
  desc:'Burbujas que ascienden con deriva y brillo. Fondo acuático relajante.',
  meta:['Canvas 2D','rise','Relax'],
  prompt:`Crea burbujas que ascienden en canvas 2D como fondo relajante (agua/champán).
Cada burbuja sube con velocidad según su tamaño, deriva lateral con un seno, y un pequeño highlight blanco para dar volumen. Al salir por arriba reaparece abajo. Densidad baja, tono translúcido.
Para fondos de bienestar, bebidas, spa o secciones "calm".`,
  code:`// Bubbles rise
bubbles.forEach(b => {
  b.y -= b.speed
  b.x += Math.sin(b.y * 0.02 + b.seed) * 0.4
  if (b.y < -b.r) { b.y = H + b.r; b.x = Math.random() * W }
  ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.28)
  ctx.stroke()   // borde translúcido + highlight
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const B=[];for(let i=0;i<28;i++)B.push({x:Math.random()*o.W(),y:Math.random()*o.H(),r:3+Math.random()*10,speed:.3+Math.random()*1,seed:Math.random()*6.28});
    let raf,run=true;
    (function loop(){if(!run)return;x.fillStyle='#06141a';x.fillRect(0,0,o.W(),o.H());
      B.forEach(b=>{b.y-=b.speed;b.x+=Math.sin(b.y*.02+b.seed)*.4;if(b.y<-b.r){b.y=o.H()+b.r;b.x=Math.random()*o.W();}x.strokeStyle='rgba(120,220,230,.5)';x.lineWidth=1.2;x.beginPath();x.arc(b.x,b.y,b.r,0,6.28);x.stroke();x.fillStyle='rgba(180,240,250,.6)';x.beginPath();x.arc(b.x-b.r*.3,b.y-b.r*.3,b.r*.25,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
