import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-ripple-grid', title:'Ripple Grid Hover', cat:'Hover & UI',
  tags:['ripple','grid','onda','hover','celdas','iluminar','wave'],
  desc:'Una rejilla de celdas donde las cercanas al cursor se iluminan en onda expansiva.',
  meta:['Canvas 2D','distancia','Wave'],
  prompt:`Crea una rejilla de celdas que se iluminan en onda según la distancia al cursor.
Para cada celda calcula la distancia al ratón y enciende su brillo con un desfase temporal proporcional (las más lejanas se encienden después), creando una onda que se propaga desde el cursor.
Fondo interactivo elegante para secciones de producto/grid de features.`,
  code:`// Ripple grid — brillo por distancia con retardo de onda
cells.forEach(c => {
  const d = Math.hypot(c.x - mouseX, c.y - mouseY)
  const wave = Math.sin(d * 0.05 - time * 0.1)   // onda que viaja
  const glow = Math.max(0, 1 - d / 200) * (0.5 + 0.5 * wave)
  c.alpha = glow
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const gap=18,cells=[];function grid(){cells.length=0;for(let yy=gap/2;yy<o.H();yy+=gap)for(let xx=gap/2;xx<o.W();xx+=gap)cells.push({x:xx,y:yy});}
    grid();let mx=-999,my=-999,t=0,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;t++;a+=.02;if(!hover){mx=o.W()*(.5+Math.cos(a)*.4);my=o.H()*(.5+Math.sin(a*1.3)*.4);}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      cells.forEach(c=>{const d=Math.hypot(c.x-mx,c.y-my);const wave=Math.sin(d*.06-t*.12);const glow=Math.max(0,1-d/180)*(.5+.5*wave);x.fillStyle='rgba('+(glow>.4?'0,224,198':'123,92,255')+','+(.1+glow)+')';const sz=2+glow*3;x.beginPath();x.arc(c.x,c.y,sz,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
