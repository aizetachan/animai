/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-draw-signature', title:'Signature Draw', cat:'SVG',
  tags:['signature','firma','draw','anime.js','escribir','stroke','handwriting'],
  desc:'Una firma o texto manuscrito se dibuja trazo a trazo como escrito a mano. Handwriting SVG.',
  meta:['stroke-dashoffset','draw','Handwriting'],
  prompt:`Crea un efecto de "firma manuscrita": un texto/firma en SVG (paths de trazo) que se dibuja progresivamente como si una mano lo escribiera, trazo por trazo.
Cada letra es un path; aplica stroke-dasharray = longitud y anima dashoffset de L a 0 con un retardo escalonado por letra para que se escriban en orden.
Para firmas, logos manuscritos o reveals personales/cálidos.`,
  code:`// Handwriting — cada trazo se dibuja con dashoffset escalonado
import { animate, stagger } from 'animejs'
animate('.stroke', {
  strokeDashoffset: [anime.setDashoffset, 0],
  delay: stagger(250), duration: 800, ease: 'inOutSine',
})`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="0 0 240 80" width="80%"><path class="sg" d="M20 55 Q30 20 38 55 T56 55" fill="none" stroke="#00e0c6" stroke-width="3" stroke-linecap="round"/><path class="sg" d="M64 50 Q72 25 80 50 Q88 70 96 45" fill="none" stroke="#00e0c6" stroke-width="3" stroke-linecap="round"/><path class="sg" d="M104 55 C108 30 118 30 120 50 C122 65 130 60 134 48" fill="none" stroke="#7b5cff" stroke-width="3" stroke-linecap="round"/><path class="sg" d="M142 52 Q150 28 158 52 Q164 68 172 46" fill="none" stroke="#7b5cff" stroke-width="3" stroke-linecap="round"/><path class="sg" d="M180 30 L180 56 M180 56 Q190 64 200 52" fill="none" stroke="#ff5ca8" stroke-width="3" stroke-linecap="round"/></svg>';
    el.appendChild(s);const strokes=[...s.querySelectorAll('.sg')];const Ls=strokes.map(p=>{const L=p.getTotalLength();p.style.strokeDasharray=L;return L;});
    let raf,run=true,t=0;
    (function loop(){if(!run)return;t+=.006;const cycle=t%1.4;strokes.forEach((p,i)=>{const start=i*.18;const local=Math.max(0,Math.min(1,(cycle-start)/.35));p.style.strokeDashoffset=Ls[i]*(1-local);});raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
