import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tr-circle-expand', title:'Circle Expand Transition', cat:'Scroll',
  tags:['circle','expand','transición','view transitions','revelar','clip','círculo'],
  desc:'Un círculo crece desde un punto y cubre/revela la pantalla. Transición circular tipo Material.',
  meta:['clip-path circle','View Transitions','Reveal'],
  prompt:`Crea una transición de "círculo expansivo": un círculo crece desde un punto (ej. el botón pulsado) hasta cubrir toda la pantalla, revelando el nuevo contenido (estilo Material / View Transitions API).
Anima clip-path:circle() del radio 0 al que cubre la diagonal, centrado en el punto de origen. La View Transitions API lo hace nativo entre estados/páginas.
Para cambios de tema, navegación o reveals con origen en un punto concreto.`,
  code:`// Circle expand (View Transitions API)
document.startViewTransition(() => updateDOM())
// CSS:
::view-transition-new(root) {
  animation: expand .5s; clip-path: circle(0 at var(--x) var(--y));
}
@keyframes expand { to { clip-path: circle(150% at var(--x) var(--y)); } }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cols=[['#7b5cff','#5a3fd6'],['#00e0c6','#00a892'],['#ff5ca8','#d6437f']];let idx=0,t=0,raf,run=true,ox,oy;ox=o.W()*.3;oy=o.H()*.4;
    (function loop(){if(!run)return;t+=.018;if(t>=1.4){t=0;idx=(idx+1)%cols.length;ox=o.W()*(.2+Math.random()*.6);oy=o.H()*(.2+Math.random()*.6);}
      const prev=cols[idx],next=cols[(idx+1)%cols.length];const gp=x.createLinearGradient(0,0,o.W(),o.H());gp.addColorStop(0,prev[0]);gp.addColorStop(1,prev[1]);x.fillStyle=gp;x.fillRect(0,0,o.W(),o.H());
      const p=Math.min(1,t);const maxR=Math.hypot(Math.max(ox,o.W()-ox),Math.max(oy,o.H()-oy));const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
      x.save();x.beginPath();x.arc(ox,oy,maxR*e,0,6.28);x.clip();const gn=x.createLinearGradient(0,0,o.W(),o.H());gn.addColorStop(0,next[0]);gn.addColorStop(1,next[1]);x.fillStyle=gn;x.fillRect(0,0,o.W(),o.H());x.restore();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
