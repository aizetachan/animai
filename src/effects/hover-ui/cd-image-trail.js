import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-image-trail', title:'Image Trail Cursor', cat:'Hover & UI',
  tags:['image trail','cursor','codrops','imágenes','estela','seguir','galería'],
  desc:'Imágenes que aparecen siguiendo el cursor y se desvanecen, como un rastro fotográfico. Clásico de Codrops.',
  meta:['cursor','spawn','Codrops'],
  prompt:`Recrea el "Image Trail" de Codrops: al mover el cursor, van apareciendo imágenes en su recorrido (una nueva cada cierta distancia) que se desvanecen y encogen poco a poco, dejando un rastro fotográfico.
Calcula la distancia desde la última imagen; al superar un umbral, instancia una nueva imagen del set en la posición del cursor con animación de entrada y salida.
Firma visual de portfolios y agencias creativas.`,
  code:`// Image Trail (Codrops) — spawn de imágenes por distancia del cursor
addEventListener('mousemove', e => {
  const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y)
  if (dist > threshold) {
    showImage(images[idx++ % images.length], e.clientX, e.clientY) // entra
    last = { x: e.clientX, y: e.clientY }
  }
})
// cada imagen: fade-in rápido, luego fade-out + scale down`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const trail=[];let lastX=0,lastY=0,idx=0;const cols=['#7b5cff','#00e0c6','#ff5ca8','#ffd166'];
    function spawn(px,py){trail.push({x:px,y:py,life:1,c:cols[idx++%cols.length],rot:(Math.random()-.5)*.4});}
    let mx=-9,my=-9,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.05;if(!hover){mx=o.W()*(.5+Math.cos(a)*.35);my=o.H()*(.5+Math.sin(a*1.6)*.35);}
      const d=Math.hypot(mx-lastX,my-lastY);if(d>26){spawn(mx,my);lastX=mx;lastY=my;}
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      for(let i=trail.length-1;i>=0;i--){const t=trail[i];t.life-=.025;if(t.life<=0){trail.splice(i,1);continue;}const sz=46*(.6+t.life*.4);x.save();x.translate(t.x,t.y);x.rotate(t.rot);x.globalAlpha=t.life;x.fillStyle=t.c;x.fillRect(-sz/2,-sz*.35,sz,sz*.7);x.restore();}x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
