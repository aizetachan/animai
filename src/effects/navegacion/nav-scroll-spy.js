import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-scroll-spy', title:'Scroll Spy Nav', cat:'Navegación',
  tags:['scrollspy','nav','índice','sección','activo','indicador','seguir'],
  desc:'Un índice lateral donde el punto activo sigue a la sección visible al scrollear. Navegación de página larga.',
  meta:['scroll','active dot','Índice'],
  prompt:`Crea un "scroll spy": un índice lateral de puntos/enlaces donde el indicador activo se mueve automáticamente a la sección que está visible en pantalla mientras se scrollea.
Con IntersectionObserver detecta qué sección domina el viewport y activa su punto (escala + color), moviendo un indicador con transición. Click en un punto hace scroll a la sección.
Para landings largas, documentación y one-pagers.`,
  code:`// Scroll spy — activa el punto de la sección visible
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'))
      dotFor(e.target.id).classList.add('active')
    }
  })
}, { threshold: 0.6 })
sections.forEach(s => io.observe(s))`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=5;const labels=['Intro','Obra','Sobre','Equipo','Contacto'];let scroll=0,raf,run=true;
    (function loop(){if(!run)return;scroll+=.004;const sc=scroll%1;const active=Math.min(N-1,Math.floor(sc*N));
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      // contenido scrolleando (bloques)
      const contentX=20,cw=o.W()*.55;for(let i=0;i<N;i++){const blockY=20+i*44-sc*N*44+( (sc*N|0))*44;const y=20+(i-sc*N+1.5)*44;if(y>-40&&y<o.H()){x.fillStyle=i===active?'#16162a':'#101019';roundRect(x,contentX,y,cw,34,6);x.fill();x.fillStyle=i===active?'#7b5cff':'#3a3a4e';x.font='600 11px Inter';x.textAlign='left';x.textBaseline='middle';x.fillText(labels[i],contentX+10,y+17);}}
      // dots index a la derecha
      const dx=o.W()-22,startY=o.H()/2-(N-1)*9;for(let i=0;i<N;i++){const dy=startY+i*18;const act=i===active;x.fillStyle=act?'#7b5cff':'#3a3a4e';x.beginPath();x.arc(dx,dy,act?5:3,0,6.28);x.fill();if(act){x.strokeStyle='rgba(123,92,255,.4)';x.lineWidth=2;x.beginPath();x.arc(dx,dy,8,0,6.28);x.stroke();}}
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
