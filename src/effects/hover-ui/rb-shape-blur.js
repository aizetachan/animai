import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-shape-blur', title:'Shape Blur Follow', cat:'Hover & UI',
  tags:['blur','shape','cursor','react bits','difuso','seguir','glow'],
  desc:'Una mancha difusa de color sigue al cursor con retardo suave. Glow blob que persigue el ratón.',
  meta:['blur','lerp','Cursor'],
  prompt:`Crea un "shape blur" que sigue al cursor: una mancha de color muy difuminada (blur alto) que persigue al ratón con interpolación suave, deformándose ligeramente según la velocidad.
Un círculo con filter:blur grande cuya posición hace lerp hacia el cursor; estira su escala en la dirección del movimiento (velocity) para dar sensación líquida.
Fondo interactivo sutil y elegante para heros minimalistas.`,
  code:`// Shape blur follow — blob difuso con lag + estiramiento por velocidad
blob.x += (mouseX - blob.x) * 0.1
blob.y += (mouseY - blob.y) * 0.1
const v = Math.hypot(blob.x - prevX, blob.y - prevY)
blob.style.transform = \`translate(\${blob.x}px,\${blob.y}px) scaleX(\${1 + v*0.02})\``,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let bx=0,by=0,a=0,raf,run=true,hover=false,mx=0,my=0;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.03;if(!hover){mx=o.W()*(.5+Math.cos(a)*.35);my=o.H()*(.5+Math.sin(a*1.5)*.35);}const px=bx,py=by;bx+=(mx-bx)*.1;by+=(my-by)*.1;const v=Math.hypot(bx-px,by-py);
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const g=x.createRadialGradient(bx,by,0,bx,by,50+v*2);g.addColorStop(0,'rgba(123,92,255,.7)');g.addColorStop(.5,'rgba(0,224,198,.3)');g.addColorStop(1,'rgba(0,224,198,0)');x.fillStyle=g;x.save();x.translate(bx,by);x.scale(1+v*.03,1);x.beginPath();x.arc(0,0,50+v*2,0,6.28);x.fill();x.restore();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
