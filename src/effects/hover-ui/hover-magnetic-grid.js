import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-magnetic-grid', title:'Magnetic Repel Grid', cat:'Hover & UI',
  tags:['magnetic','grid','repel','apartar','puntos','cursor','interactivo'],
  desc:'Una rejilla de puntos que se aparta del cursor como repelida por un imán.',
  meta:['Canvas 2D','repulsión','Interactivo'],
  prompt:`Crea una rejilla de puntos que se aparta del cursor (repulsión magnética).
Cada punto tiene una posición base; calcula el vector desde el cursor y, si está dentro de un radio, empuja el punto en sentido contrario con fuerza inversa a la distancia. Cuando el cursor se aleja, los puntos vuelven a su posición base con un muelle (spring).
Fondo interactivo hipnótico para heros tech.`,
  code:`// Magnetic repel grid
dots.forEach(d => {
  const dx = d.x - mouseX, dy = d.y - mouseY
  const dist = Math.hypot(dx, dy)
  if (dist < radius) {
    const force = (radius - dist) / radius
    d.x += (dx / dist) * force * 20    // repele
    d.y += (dy / dist) * force * 20
  }
  d.x += (d.bx - d.x) * 0.1            // vuelve a la base (spring)
  d.y += (d.by - d.y) * 0.1
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let D=[];function grid(){D=[];const gap=22;for(let yy=gap;yy<o.H();yy+=gap)for(let xx=gap;xx<o.W();xx+=gap)D.push({x:xx,y:yy,bx:xx,by:yy});}
    grid();let mx=-999,my=-999,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>{hover=false;mx=-999;};
    (function loop(){if(!run)return;a+=.02;if(!hover){mx=o.W()*(.5+Math.cos(a)*.35);my=o.H()*(.5+Math.sin(a*1.2)*.35);}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const R=70;
      D.forEach(d=>{const dx=d.x-mx,dy=d.y-my,dist=Math.hypot(dx,dy)||1;if(dist<R){const f=(R-dist)/R;d.x+=dx/dist*f*8;d.y+=dy/dist*f*8;}d.x+=(d.bx-d.x)*.1;d.y+=(d.by-d.y)*.1;const close=dist<R;x.fillStyle=close?'rgba(123,92,255,'+(1-dist/R)+')':'rgba(90,92,120,.5)';x.beginPath();x.arc(d.x,d.y,close?2.5:1.4,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
