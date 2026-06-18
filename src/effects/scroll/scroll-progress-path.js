/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-progress-path', title:'Scroll Progress Path', cat:'Scroll',
  tags:['scroll','svg','path','tracing','beam','progreso','trazo'],
  desc:'Una línea SVG se dibuja siguiendo un camino lateral a medida que scrolleas. El tracing beam.',
  meta:['SVG path','dashoffset','Progreso'],
  prompt:`Recrea el "Tracing Beam" de Aceternity: una línea SVG curva en el lateral de la página que se dibuja progresivamente conforme se scrollea, con un punto luminoso en la cabeza.
Toma el progreso de scroll (0-1) y aplica stroke-dashoffset = length*(1-progress) sobre el path; coloca un gradiente o un dot brillante en la posición actual.
Guía visual de lectura para artículos y landings largas.`,
  code:`// Tracing beam — el path se dibuja con el scroll
const len = path.getTotalLength()
path.style.strokeDasharray = len
addEventListener('scroll', () => {
  const progress = scrollY / (document.body.scrollHeight - innerHeight)
  path.style.strokeDashoffset = len * (1 - progress)
})`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden';
    s.innerHTML='<svg viewBox="0 0 60 200" preserveAspectRatio="none" style="position:absolute;left:30px;top:0;height:100%;width:60px"><path id="trk" d="M30 5 C 10 50, 50 90, 30 130 S 10 180, 30 195" fill="none" stroke="#1e1e2e" stroke-width="3"/><path id="trp" d="M30 5 C 10 50, 50 90, 30 130 S 10 180, 30 195" fill="none" stroke="url(#tg)" stroke-width="3" stroke-linecap="round"/><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0c6"/></linearGradient></defs></svg><div style="position:absolute;left:110px;top:0;right:14px;height:100%;display:flex;flex-direction:column;justify-content:center;gap:8px;color:#3a3a4e"><div style="height:8px;background:#16162a;border-radius:4px;width:80%"></div><div style="height:8px;background:#16162a;border-radius:4px;width:95%"></div><div style="height:8px;background:#16162a;border-radius:4px;width:70%"></div></div>';
    el.appendChild(s);const trp=s.querySelector('#trp');const L=trp.getTotalLength();trp.style.strokeDasharray=L;
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.008;const p=Math.sin(t)*.5+.5;trp.style.strokeDashoffset=L*(1-p);raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
