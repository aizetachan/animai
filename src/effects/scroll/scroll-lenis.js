/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-lenis', title:'Smooth Scroll (Lenis)', cat:'Scroll',
  tags:['lenis','smooth','suave','inercia','scroll','damping'],
  desc:'Scroll suave con inercia y damping, el estándar actual con Lenis. Base de las webs premium 2026.',
  meta:['Lenis','lerp','Inercia'],
  prompt:`Implementa smooth scroll con inercia usando Lenis (el estándar actual, sucesor de Locomotive Scroll).
npm install lenis. Crea una instancia, llama lenis.raf(time) dentro de un requestAnimationFrame loop, y opcionalmente sincroniza con GSAP ScrollTrigger.
Da esa sensación "premium" de scroll con damping. Respeta prefers-reduced-motion desactivándolo.`,
  code:`// npm install lenis
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
// Sync con GSAP: lenis.on('scroll', ScrollTrigger.update)`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden';
    s.innerHTML='<div id="vp" style="position:absolute;inset:0;padding:14px;display:flex;flex-direction:column;gap:10px"></div>';
    el.appendChild(s);const vp=s.querySelector('#vp');for(let i=0;i<8;i++){const d=document.createElement('div');d.style.cssText='flex:0 0 auto;height:30px;border-radius:7px;background:linear-gradient(90deg,#16162a,#2a2a4a);display:flex;align-items:center;padding:0 12px;color:#8a8ca3;font-size:12px;font-weight:600';d.textContent='Sección '+(i+1);vp.appendChild(d);}
    let target=0,cur=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;target+=dir*1.6;const max=vp.scrollHeight-el.clientHeight;if(target>max){target=max;dir=-1;}if(target<0){target=0;dir=1;}cur+=(target-cur)*.06;vp.style.transform='translateY('+(-cur)+'px)';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
