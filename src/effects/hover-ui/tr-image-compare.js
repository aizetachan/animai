import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tr-image-compare', title:'Before / After Slider', cat:'Hover & UI',
  tags:['compare','before','after','slider','divisor','antes','después'],
  desc:'Un divisor arrastrable revela el antes y el después de una imagen. Comparador interactivo.',
  meta:['clip','drag','Compare'],
  prompt:`Crea un comparador "antes/después": dos imágenes superpuestas con un divisor vertical arrastrable; al mover el divisor, se revela más de una u otra (clip-path:inset según la posición del cursor).
Captura el drag (o el hover) para fijar la posición del divisor; recorta la imagen superior con inset(0 (100-x)% 0 0). Añade un mango con flechas.
Para mostrar retoques, rediseños, antes/después de producto.`,
  code:`// Before/after slider — clip de la imagen superior según el divisor
divider.addEventListener('pointermove', e => {
  const pct = (e.clientX - rect.left) / rect.width * 100
  topImage.style.clipPath = \`inset(0 \${100-pct}% 0 0)\`
  handle.style.left = pct + '%'
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let div=.5,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();div=Math.max(.05,Math.min(.95,(e.clientX-b.left)/b.width));};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.02;if(!hover)div=.5+Math.sin(a)*.35;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const dx=div*o.W();
      // after (color) izquierda
      for(let yy=0;yy<o.H();yy+=8)for(let xx=0;xx<dx;xx+=8){x.fillStyle='hsl('+(250+xx/o.W()*40)+',60%,'+(40+yy/o.H()*20)+'%)';x.fillRect(xx,yy,8,8);}
      // before (gris) derecha
      for(let yy=0;yy<o.H();yy+=8)for(let xx=dx;xx<o.W();xx+=8){const v=Math.round(40+(xx/o.W())*60+(yy/o.H())*30);x.fillStyle='rgb('+v+','+v+','+(v+8)+')';x.fillRect(xx,yy,8,8);}
      // divider
      x.fillStyle='#fff';x.fillRect(dx-1,0,2,o.H());x.beginPath();x.arc(dx,o.H()/2,12,0,6.28);x.fill();x.fillStyle='#7b5cff';x.font='10px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText('⇄',dx,o.H()/2);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
