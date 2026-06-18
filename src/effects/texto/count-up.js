/** @type {import('../types.js').Effect} */
const effect = {
  id:'count-up', title:'Count-Up Numbers', cat:'Texto',
  tags:['contador','números','count','stats','métricas','scroll'],
  desc:'Cifras que cuentan hacia arriba al entrar en pantalla. Imprescindible en secciones de métricas.',
  meta:['rAF','easing','Stats'],
  prompt:`Count-up de números al entrar en viewport.
Con IntersectionObserver dispara una animación rAF que interpola de 0 al valor final aplicando un easing (easeOutExpo). Formatea con separador de miles y sufijos (k, M, %).
Úsalo en bloques de stats/resultados. Respeta reduced-motion mostrando el valor final directo.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:flex;gap:24px;align-items:center;justify-content:center';
    s.innerHTML='<div style="text-align:center"><div id="n1" style="font-size:34px;font-weight:800;color:#7b5cff">0</div><div style="font-size:11px;color:#8a8ca3;text-transform:uppercase;letter-spacing:.1em">usuarios</div></div><div style="text-align:center"><div id="n2" style="font-size:34px;font-weight:800;color:#00e0c6">0</div><div style="font-size:11px;color:#8a8ca3;text-transform:uppercase;letter-spacing:.1em">uptime</div></div>';
    el.appendChild(s);const n1=s.querySelector('#n1'),n2=s.querySelector('#n2');let raf,run=true;
    function anim(){const t0=performance.now(),D=1800;(function up(){if(!run)return;const k=Math.min(1,(performance.now()-t0)/D),e=1-Math.pow(2,-10*k);n1.textContent=Math.round(e*128400).toLocaleString('es');n2.textContent=(e*99.9).toFixed(1)+'%';if(k<1)raf=requestAnimationFrame(up);else if(run)setTimeout(()=>{n1.textContent='0';n2.textContent='0';setTimeout(anim,500);},1400);})();}
    anim();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
