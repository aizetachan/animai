import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-spring-stagger', title:'Spring Stagger Grid', cat:'CSS Moderno',
  tags:['spring','stagger','grid','anime.js','físico','muelle','entrada'],
  desc:'Una rejilla de elementos entra con rebote físico escalonado desde el centro. Spring stagger.',
  meta:['Anime.js','spring','Stagger'],
  prompt:`Anima la entrada de una rejilla con spring stagger (Anime.js): los elementos aparecen (scale 0→1) con un muelle físico (rebote) y un retardo escalonado que se propaga desde el centro hacia fuera.
Usa ease: spring({stiffness, damping}) y delay: stagger(t, {grid, from:'center'}). El rebote del muelle da vida orgánica frente a un easing plano.
Para reveals de galerías, dashboards o menús de iconos.`,
  code:`// Anime.js — spring stagger desde el centro
import { animate, stagger, spring } from 'animejs'
animate('.item', {
  scale: [0, 1], opacity: [0, 1],
  ease: spring({ stiffness: 120, damping: 8 }),
  delay: stagger(60, { grid: [cols, rows], from: 'center' }),
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cols=8,rows=5;let cells=[];
    function build(){cells=[];const ocx=(cols-1)/2,ocy=(rows-1)/2;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const d=Math.hypot(c-ocx,r-ocy);cells.push({c,r,delay:d*5,s:0,v:0});}}
    build();let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0){hold--;}else{t+=1;if(t>120){t=0;hold=30;build();}}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cw=o.W()/cols,ch=o.H()/rows;
      cells.forEach(cl=>{if(t>cl.delay){const target=1;const f=(target-cl.s)*.2;cl.v=cl.v*.8+f;cl.s+=cl.v;}const sz=Math.max(0,cl.s);if(sz>.02){const w=cw*.75*sz,h=ch*.75*sz;x.fillStyle='hsl('+(250+(cl.c+cl.r)*6)+',60%,60%)';x.fillRect(cl.c*cw+(cw-w)/2,cl.r*ch+(ch-h)/2,w,h);}});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
