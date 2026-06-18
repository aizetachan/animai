import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-grid-reveal', title:'Grid Reveal Stagger', cat:'Scroll',
  tags:['grid','reveal','stagger','codrops','anime','thumbnails','entrada'],
  desc:'Las celdas de una rejilla aparecen escalonadas desde un punto, en onda. El grid reveal de Codrops/Anime.js.',
  meta:['stagger','grid','Anime.js'],
  prompt:`Recrea el "Grid Reveal" de Codrops con staggering (Anime.js): las celdas/thumbnails de una rejilla aparecen (fade+scale) escalonadas desde un punto de origen, propagándose en onda como un radar.
El delay de cada celda es proporcional a su distancia (en celdas) al origen. Al revertir, desaparecen en el orden inverso.
Para intros de galería y reveals de secciones con muchos elementos.`,
  code:`// Grid Reveal (Anime.js stagger desde un punto)
anime({
  targets: '.cell',
  scale: [0, 1], opacity: [0, 1],
  delay: anime.stagger(50, { grid: [cols, rows], from: 'center' }),
  easing: 'easeOutQuad',
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cols=10,rows=7;let cells=[];
    function build(){cells=[];const ocx=(cols-1)/2,ocy=(rows-1)/2;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const d=Math.hypot(c-ocx,r-ocy);cells.push({c,r,delay:d*4,p:0});}}
    build();let t=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;t+=dir*.8;if(t>70)dir=-1;if(t<0)dir=1;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const cw=o.W()/cols,ch=o.H()/rows;cells.forEach(cl=>{const local=Math.max(0,Math.min(1,(t-cl.delay)/12));const sz=local;if(sz>.02){const w=cw*.8*sz,h=ch*.8*sz;x.fillStyle='hsl('+(250+(cl.c+cl.r)*6)+',65%,60%)';x.globalAlpha=sz;x.fillRect(cl.c*cw+(cw-w)/2,cl.r*ch+(ch-h)/2,w,h);}});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
