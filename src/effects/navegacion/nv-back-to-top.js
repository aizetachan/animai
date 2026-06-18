/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-back-to-top', title:'Back to Top', cat:'Navegación',
  tags:['back to top','volver arriba','scroll','progreso','ring','anillo','fab'],
  desc:'Botón flotante para volver arriba con un anillo SVG que indica el progreso de scroll de la página.',
  meta:['scroll','SVG ring','CSS+JS'],
  prompt:`Crea un botón flotante "volver arriba" rodeado por un anillo de progreso que refleja cuánto se ha scrolleado la página.
Elementos: un botón circular (FAB) con una flecha hacia arriba y, encima, un SVG con dos círculos: uno de fondo tenue y otro de progreso usando stroke-dasharray = circunferencia y stroke-dashoffset variable.
Técnica: en el evento scroll calcula progress = scrollTop/(scrollHeight-clientHeight) y aplica strokeDashoffset = C*(1-progress). El botón aparece (escala/opacidad) cuando progress>~0.1. El anillo va del acento #7b5cff al secundario #00e0c6. Al hacer click, scroll suave a 0.
Auto-demo en bucle: anima el progreso de 0→1 y de vuelta, mostrando aparición del botón y llenado del anillo; al final simula el click que devuelve el progreso a 0.`,
  code:`<button class="btt" aria-label="Volver arriba">
  <svg viewBox="0 0 44 44"><circle class="bg" cx="22" cy="22" r="20"/><circle class="pr" cx="22" cy="22" r="20"/></svg>
  <span class="arrow">↑</span>
</button>
<style>
.btt{position:fixed;right:24px;bottom:24px;width:48px;height:48px;border:0;background:#16162a;border-radius:50%;cursor:pointer;display:grid;place-items:center;opacity:0;transform:scale(.6);transition:.3s}
.btt.show{opacity:1;transform:scale(1)}
.btt svg{position:absolute;inset:0;width:48px;height:48px;transform:rotate(-90deg)}
.btt .bg{fill:none;stroke:#2a2a3e;stroke-width:3}
.btt .pr{fill:none;stroke:#7b5cff;stroke-width:3;stroke-linecap:round;stroke-dasharray:125.6;stroke-dashoffset:125.6;transition:stroke-dashoffset .1s linear}
.btt .arrow{color:#fff;font-size:20px;line-height:1}
</style>
<script>
const btt=document.querySelector('.btt'),pr=btt.querySelector('.pr'),C=2*Math.PI*20;
addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  const p=max>0?scrollY/max:0;
  pr.style.strokeDashoffset=C*(1-p);
  btt.classList.toggle('show',p>.1);
});
btt.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;width:100%;height:100%;display:grid;place-items:center;background:#0a0a14;font-family:Inter,system-ui,sans-serif';
    const C=2*Math.PI*20;
    s.innerHTML='<style>'
      +'.nvbt{position:relative;width:64px;height:64px;border:0;background:#16162a;border-radius:50%;display:grid;place-items:center;opacity:0;transform:scale(.55);transition:opacity .3s ease,transform .3s ease;box-shadow:0 6px 18px rgba(0,0,0,.4)}'
      +'.nvbt.show{opacity:1;transform:scale(1)}'
      +'.nvbt svg{position:absolute;inset:0;width:64px;height:64px;transform:rotate(-90deg)}'
      +'.nvbt .bg{fill:none;stroke:#2a2a3e;stroke-width:3.5}'
      +'.nvbt .pr{fill:none;stroke:url(#nvbtg);stroke-width:3.5;stroke-linecap:round;stroke-dasharray:'+C.toFixed(2)+';stroke-dashoffset:'+C.toFixed(2)+'}'
      +'.nvbt .ar{color:#fff;font-size:24px;line-height:1;transform:translateY(-1px)}'
      +'</style>'
      +'<button class="nvbt"><svg viewBox="0 0 64 64">'
      +'<defs><linearGradient id="nvbtg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0c6"/></linearGradient></defs>'
      +'<circle class="bg" cx="32" cy="32" r="20"/><circle class="pr" cx="32" cy="32" r="20"/></svg>'
      +'<span class="ar">&#8593;</span></button>';
    el.appendChild(s);
    const btn=s.querySelector('.nvbt'),pr=s.querySelector('.pr');
    let raf,run=true,t0=performance.now();
    function loop(){
      if(!run)return;
      const t=((performance.now()-t0)/1000)%5; // ciclo de 5s
      let p;
      if(t<3.5){ p=t/3.5; }            // 0 -> 1 subiendo
      else { p=Math.max(0,1-(t-3.5)/0.6); } // click: vuelta rápida a 0
      pr.style.strokeDashoffset=(C*(1-p)).toFixed(2);
      btn.classList.toggle('show',p>.08);
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
