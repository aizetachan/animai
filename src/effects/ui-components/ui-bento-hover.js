import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-bento-hover', title:'Bento Grid Hover', cat:'UI Components',
  tags:['bento','grid','hover','cards','layout','expandir','moderno'],
  desc:'Una rejilla bento donde la celda bajo el cursor se expande y las demás se ajustan. Layout 2026.',
  meta:['grid','flex-grow','Hover'],
  prompt:`Crea una "bento grid" interactiva: una rejilla de celdas de distintos tamaños donde, al pasar el cursor sobre una, esta se expande suavemente (crece su peso/escala) y las vecinas se ajustan/atenúan, con un resplandor en la activa.
Anima el flex-grow o la escala de la celda activa y baja la opacidad de las demás. Bordes redondeados, look premium.
El layout de moda en landings 2026 (Apple, startups IA).`,
  code:`/* Bento grid hover */
.cell { transition: flex-grow .4s, opacity .3s; }
.bento:hover .cell { opacity: 0.5; }
.bento .cell:hover { flex-grow: 2.5; opacity: 1; box-shadow: 0 0 30px rgba(123,92,255,.4); }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cells=[{x:0,y:0,w:.55,h:.5},{x:.55,y:0,w:.45,h:.5},{x:0,y:.5,w:.33,h:.5},{x:.33,y:.5,w:.34,h:.5},{x:.67,y:.5,w:.33,h:.5}];
    let hov=-1,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();const mx=(e.clientX-b.left)/b.width,my=(e.clientY-b.top)/b.height;hov=cells.findIndex(c=>mx>=c.x&&mx<c.x+c.w&&my>=c.y&&my<c.y+c.h);};el.onmouseleave=()=>{hover=false;hov=-1;};
    (function loop(){if(!run)return;a+=.02;if(!hover){hov=Math.floor((a*.3)%cells.length);}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const pad=4;
      cells.forEach((c,i)=>{const active=i===hov;c.s=(c.s||1)+((active?1.04:1)-(c.s||1))*.15;const cx=c.x*o.W()+(c.w*o.W())/2,cy=c.y*o.H()+(c.h*o.H())/2;const w=c.w*o.W()*c.s-pad*2,h=c.h*o.H()*c.s-pad*2;x.fillStyle=active?'hsl('+(250+i*12)+',65%,58%)':'#16162a';x.globalAlpha=active?1:.6;roundRect(x,cx-w/2,cy-h/2,w,h,8);x.fill();if(active){x.globalAlpha=1;x.strokeStyle='rgba(123,92,255,.6)';x.lineWidth=2;x.stroke();}});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
