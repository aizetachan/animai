import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-floating-pill', title:'Floating Nav Pill', cat:'Navegación',
  tags:['floating','pill','navbar','flotante','hide','scroll','píldora'],
  desc:'Una navbar flotante en forma de píldora que se encoge al scrollear y resalta el ítem bajo el cursor.',
  meta:['shrink','hover bg','Navbar'],
  prompt:`Crea una navbar flotante tipo "píldora": una barra centrada y redondeada que flota sobre el contenido; al scrollear hacia abajo se encoge/condensa, y al pasar el cursor sobre un ítem, un fondo redondeado se desliza tras él (hover background animado).
Anima el padding/escala de la barra según el scroll y un fondo que se mueve al ítem en hover (como las tabs magic line, pero en navbar flotante glass).
La navbar de moda en landings 2026.`,
  code:`/* Floating nav pill */
.nav-pill { backdrop-filter: blur(12px); border-radius: 999px; transition: padding .3s, transform .3s; }
.nav-pill.scrolled { padding: 6px 12px; transform: scale(.92); }
.hover-bg { position: absolute; border-radius: 999px; background: rgba(123,92,255,.2); transition: transform .3s, width .3s; }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const items=['Inicio','Obra','Precios','Blog'];let hov=0,t=0,raf,run=true,curX=0,curW=0,hover=false;
    let positions=[];
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();const mx=e.clientX-b.left;hov=positions.findIndex(p=>mx>=p.x&&mx<p.x+p.w);if(hov<0)hov=0;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;t++;if(!hover&&t%50===0)hov=(hov+1)%items.length;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      x.font='600 12px Inter';x.textBaseline='middle';const pads=14,gap=6;let totalW=pads*2;const ws=items.map(it=>x.measureText(it).width+22);ws.forEach(w=>totalW+=w);totalW+=gap*(items.length-1);
      const barX=(o.W()-totalW)/2,barY=o.H()/2-18,barH=36;x.fillStyle='rgba(22,22,42,.8)';roundRect(x,barX,barY,totalW,barH,18);x.fill();x.strokeStyle='rgba(255,255,255,.1)';x.stroke();
      positions=[];let cx=barX+pads;items.forEach((it,i)=>{positions.push({x:cx,w:ws[i]});cx+=ws[i]+gap;});
      const tgt=positions[hov];curX+=(tgt.x-curX)*.2;curW+=(tgt.w-curW)*.2;x.fillStyle='rgba(123,92,255,.3)';roundRect(x,curX,barY+5,curW,barH-10,13);x.fill();
      items.forEach((it,i)=>{x.fillStyle=i===hov?'#fff':'#8a8ca3';x.textAlign='center';x.fillText(it,positions[i].x+ws[i]/2,barY+barH/2);});
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
