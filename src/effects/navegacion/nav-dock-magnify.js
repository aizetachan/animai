import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-dock-magnify', title:'macOS Dock', cat:'Navegación',
  tags:['dock','macos','magnify','iconos','cursor','escala','barra'],
  desc:'Los iconos se agrandan según la cercanía del cursor, como el Dock de macOS. Efecto lupa fluido.',
  meta:['distancia','scale','Dock'],
  prompt:`Recrea el Dock de macOS: una fila de iconos donde el que está bajo el cursor (y sus vecinos) se agrandan suavemente según la distancia al ratón, con una curva de magnificación.
Para cada icono, escala = base + max·gauss(distancia al cursor). Los iconos se desplazan ligeramente para hacer sitio. Suaviza con interpolación.
Para barras de herramientas, navegación de apps o docks de portfolio.`,
  code:`// macOS dock magnify
icons.forEach(ic => {
  const dist = Math.abs(ic.centerX - mouseX)
  const scale = 1 + 0.8 * Math.exp(-(dist*dist) / (2*80*80))  // gaussiana
  ic.style.transform = \`scale(\${scale}) translateY(\${-(scale-1)*20}px)\`
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=7;const cols=['#7b5cff','#00e0c6','#ff5ca8','#ffd166','#5a9cff','#9d6bff','#ff8a5c'];
    let mx=-999,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.03;if(!hover){mx=o.W()*(.5+Math.sin(a)*.4);}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const base=26,gap=8,total=N*base+(N-1)*gap,startX=(o.W()-total)/2,cy=o.H()*.6;
      // primera pasada: escalas
      const sc=[];for(let i=0;i<N;i++){const cx=startX+i*(base+gap)+base/2;const d=Math.abs(cx-mx);sc.push(1+1*Math.exp(-(d*d)/(2*42*42)));}
      let xcursor=startX;for(let i=0;i<N;i++){const sz=base*sc[i];x.fillStyle=cols[i];const yy=cy-sz/2-(sc[i]-1)*14;roundRect(x,xcursor,yy,sz,sz,sz*.25);x.fill();xcursor+=sz+gap;}
      // base line
      x.fillStyle='rgba(255,255,255,.08)';x.fillRect((o.W()-total*1.1)/2,cy+base*.7,total*1.1,2);
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
