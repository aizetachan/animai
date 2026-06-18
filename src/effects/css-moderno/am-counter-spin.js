/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-counter-spin', title:'Odometer Spin', cat:'CSS Moderno',
  tags:['counter','odometer','spin','anime.js','número','rodar','métricas'],
  desc:'Un número grande sube rodando sus dígitos a la vez que rota una rueda. Métrica con física.',
  meta:['Anime.js','object tween','Métricas'],
  prompt:`Anima una métrica destacada que sube rodando (anime.js anima un objeto JS): el número cuenta de 0 al valor final con easing, mientras un anillo/rueda gira en sincronía, dando sensación de "medidor".
Anima un objeto {count:0} con onUpdate para repintar el número, y un elemento rotando en paralelo en un timeline. Easing easeOutExpo para que frene bonito.
Para KPIs, contadores de impacto y dashboards.`,
  code:`// Anime.js — tween de objeto JS para contadores
import { animate } from 'animejs'
const data = { count: 0 }
animate(data, {
  count: 1280, duration: 2000, ease: 'outExpo',
  onUpdate: () => el.textContent = Math.round(data.count),
})`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div style="position:relative;display:grid;place-items:center"><svg width="120" height="120" style="position:absolute"><circle cx="60" cy="60" r="50" fill="none" stroke="#16162a" stroke-width="6"/><circle id="ring" cx="60" cy="60" r="50" fill="none" stroke="#7b5cff" stroke-width="6" stroke-linecap="round" transform="rotate(-90 60 60)"/></svg><span id="num" style="font-size:28px;font-weight:800;color:#eef0f7">0</span></div>';
    el.appendChild(s);const num=s.querySelector('#num'),ring=s.querySelector('#ring');const L=2*Math.PI*50;ring.style.strokeDasharray=L;
    let raf,run=true,t=0,phase=0;
    (function loop(){if(!run)return;t+=.012;if(t>=1){t=0;}const e=1-Math.pow(2,-10*t);num.textContent=Math.round(e*1280);ring.style.strokeDashoffset=L*(1-e);raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
