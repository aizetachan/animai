import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-fullscreen-overlay', title:'Fullscreen Menu', cat:'Navegación',
  tags:['fullscreen','overlay','menu','stagger','links','cubrir','reveal'],
  desc:'El menú cubre la pantalla y los links entran escalonados desde abajo. Overlay nav cinematográfico.',
  meta:['overlay','stagger','Reveal'],
  prompt:`Crea un menú overlay fullscreen: al abrir, un panel cubre toda la pantalla (clip-path o scale) y los enlaces entran uno tras otro (fade + translateY) con stagger.
El overlay se expande desde el botón; los links tienen transition-delay creciente por índice. Al cerrar, salen en orden inverso y el panel se retira.
Para webs de portfolio/agencia con navegación inmersiva.`,
  code:`/* Fullscreen overlay menu con stagger */
.overlay { clip-path: circle(0 at top right); transition: clip-path .6s; }
.overlay.open { clip-path: circle(150% at top right); }
.overlay a { opacity: 0; transform: translateY(20px); transition: .4s; }
.overlay.open a { opacity: 1; transform: translateY(0); }
.overlay.open a:nth-child(1){transition-delay:.2s} /* ... escalonado */`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const items=['Inicio','Trabajo','Estudio','Contacto'];let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.012;const cyc=t%2;const open=cyc<1.4;const prog=open?Math.min(1,cyc/.5):Math.max(0,1-(cyc-1.4)/.4);
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      // overlay circular desde esquina sup der
      const maxR=Math.hypot(o.W(),o.H());x.save();x.beginPath();x.arc(o.W(),0,maxR*prog,0,6.28);x.clip();x.fillStyle='#7b5cff';x.fillRect(0,0,o.W(),o.H());
      x.textAlign='center';x.font='800 18px Inter';items.forEach((it,i)=>{const local=Math.max(0,Math.min(1,(prog-.3-i*.12)/.3));x.globalAlpha=local;x.fillStyle='#fff';x.fillText(it,o.W()/2,o.H()/2-28+i*22+(1-local)*15);});x.globalAlpha=1;x.restore();
      // burger/x arriba der
      x.strokeStyle='#fff';x.lineWidth=2.5;x.lineCap='round';const bx=o.W()-22,by=18;if(prog>.5){x.save();x.translate(bx,by);x.rotate(.785);x.beginPath();x.moveTo(-7,0);x.lineTo(7,0);x.moveTo(0,-7);x.lineTo(0,7);x.stroke();x.restore();}else{x.beginPath();x.moveTo(bx-7,by-4);x.lineTo(bx+7,by-4);x.moveTo(bx-7,by);x.lineTo(bx+7,by);x.moveTo(bx-7,by+4);x.lineTo(bx+7,by+4);x.stroke();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
