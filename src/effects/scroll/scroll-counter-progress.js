import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-counter-progress', title:'Scroll Count-Up', cat:'Scroll',
  tags:['scroll','counter','count-up','número','viewport','métricas','animar'],
  desc:'Un número cuenta desde 0 hasta su valor cuando entra en pantalla. Métrica que se anima al verla.',
  meta:['IntersectionObserver','count','Métricas'],
  prompt:`Crea una métrica que cuenta de 0 a su valor final cuando entra en el viewport: al detectar la entrada con IntersectionObserver, anima el número con requestAnimationFrame y un easing (easeOutExpo) hasta el target.
Solo dispara una vez. Formatea el número (separadores de miles, sufijos como K/M/%).
Para secciones de estadísticas e impacto que cobran vida al llegar a ellas.`,
  code:`// Count-up al entrar en viewport
new IntersectionObserver(([e]) => {
  if (!e.isIntersecting) return
  const target = 1280, dur = 1500, t0 = performance.now()
  ;(function tick(now){
    const p = Math.min(1, (now-t0)/dur)
    const eased = 1 - Math.pow(2, -10*p)
    el.textContent = Math.round(eased * target)
    if (p < 1) requestAnimationFrame(tick)
  })(t0)
}).observe(el)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true,hold=0,val=0;
    (function loop(){if(!run)return;if(hold>0){hold--;}else{t+=.012;if(t>=1){t=1;hold=50;}}const e=1-Math.pow(2,-10*t);val=Math.round(e*1280);
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());x.fillStyle='#7b5cff';x.font='800 '+Math.min(o.W(),o.H())*.32+'px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(val.toLocaleString(),o.W()/2,o.H()/2-8);x.fillStyle='#8a8ca3';x.font='600 13px Inter';x.fillText('proyectos entregados',o.W()/2,o.H()/2+24);
      if(hold>0&&t>=1){t=0;hold=hold;}if(t>=1&&hold<=0){t=0;}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
