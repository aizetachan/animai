/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-animated-timeline', title:'Animated Timeline', cat:'Navegación',
  tags:['timeline','línea de tiempo','hitos','milestones','reveal','scroll','progreso'],
  desc:'Línea de tiempo cuyo trazo vertical se rellena progresivamente y revela cada hito al alcanzarlo.',
  meta:['timeline','reveal','CSS+JS'],
  prompt:`Crea una línea de tiempo vertical animada donde un trazo se rellena de arriba a abajo y, a medida que avanza, va revelando cada hito.
Elementos: una columna con una línea base gris (::before o un div absoluto), una línea de progreso encima (otro div con scaleY desde el origen superior, transform-origin:top) y varios "hitos" (filas con un punto + tarjeta de texto) posicionados a lo largo.
Técnica: anima la altura/scaleY de la línea de progreso desde 0 hasta 1. Cada hito tiene un punto que cambia de gris a color (#7b5cff) y la tarjeta hace fade + translateX cuando el progreso supera su posición. Usa IntersectionObserver o el scroll real en producción; aquí un timeline que va activando hitos en orden.
Timings: relleno total ~3s ease-in-out, cada hito aparece con transición de ~350ms. Marca el último punto con el secundario #00e0c6. Bucle: al completar, resetea y vuelve a empezar.`,
  code:`<div class="tl">
  <div class="tl-line"><i class="tl-fill"></i></div>
  <div class="tl-item"><span class="dot"></span><div class="card">2021 · Lanzamiento</div></div>
  <div class="tl-item"><span class="dot"></span><div class="card">2022 · Crecimiento</div></div>
  <div class="tl-item"><span class="dot"></span><div class="card">2023 · Expansión</div></div>
  <div class="tl-item"><span class="dot"></span><div class="card">2024 · Hoy</div></div>
</div>
<style>
.tl{position:relative;padding-left:28px}
.tl-line{position:absolute;left:8px;top:0;bottom:0;width:2px;background:#2a2a3e}
.tl-fill{position:absolute;inset:0;background:linear-gradient(#7b5cff,#00e0c6);transform:scaleY(0);transform-origin:top;transition:transform 3s ease-in-out}
.tl.run .tl-fill{transform:scaleY(1)}
.tl-item{position:relative;margin:0 0 22px;opacity:0;transform:translateX(12px);transition:.35s ease}
.tl-item.on{opacity:1;transform:none}
.tl-item .dot{position:absolute;left:-24px;top:4px;width:12px;height:12px;border-radius:50%;background:#2a2a3e;box-shadow:0 0 0 3px #0a0a14;transition:.3s}
.tl-item.on .dot{background:#7b5cff}
.tl-item:last-child.on .dot{background:#00e0c6}
.card{background:#16162a;border:1px solid #26263a;border-radius:8px;padding:8px 12px;color:#cfcfe6;font:600 13px Inter}
</style>
<script>
const tl=document.querySelector('.tl'),items=[...tl.querySelectorAll('.tl-item')];
tl.classList.add('run');
items.forEach((it,i)=>setTimeout(()=>it.classList.add('on'),300+i*650));
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;width:100%;height:100%;display:grid;place-items:center;background:#0a0a14';
    s.innerHTML='<style>'
      +'@keyframes nvtlFill{from{transform:scaleY(0)}to{transform:scaleY(1)}}'
      +'.nvtl{position:relative;padding-left:26px;font-family:Inter,system-ui,sans-serif}'
      +'.nvtl-line{position:absolute;left:7px;top:2px;bottom:2px;width:2px;background:#2a2a3e;border-radius:2px}'
      +'.nvtl-fill{position:absolute;inset:0;background:linear-gradient(#7b5cff,#00e0c6);transform:scaleY(0);transform-origin:top;border-radius:2px}'
      +'.nvtl-fill.run{animation:nvtlFill 2.8s ease-in-out forwards}'
      +'.nvtl-item{position:relative;margin:0 0 16px;opacity:0;transform:translateX(12px);transition:.35s ease}'
      +'.nvtl-item:last-child{margin-bottom:0}'
      +'.nvtl-item.on{opacity:1;transform:none}'
      +'.nvtl-item .d{position:absolute;left:-23px;top:3px;width:11px;height:11px;border-radius:50%;background:#2a2a3e;box-shadow:0 0 0 3px #0a0a14;transition:.3s}'
      +'.nvtl-item.on .d{background:#7b5cff;box-shadow:0 0 0 3px #0a0a14,0 0 8px #7b5cff}'
      +'.nvtl-item:last-child.on .d{background:#00e0c6;box-shadow:0 0 0 3px #0a0a14,0 0 8px #00e0c6}'
      +'.nvtl .c{background:#16162a;border:1px solid #26263a;border-radius:8px;padding:6px 11px;color:#cfcfe6;font:600 12px Inter}'
      +'</style>'
      +'<div class="nvtl"><div class="nvtl-line"><i class="nvtl-fill"></i></div>'
      +'<div class="nvtl-item"><span class="d"></span><div class="c">2021 · Lanzamiento</div></div>'
      +'<div class="nvtl-item"><span class="d"></span><div class="c">2022 · Crecimiento</div></div>'
      +'<div class="nvtl-item"><span class="d"></span><div class="c">2023 · Expansión</div></div>'
      +'<div class="nvtl-item"><span class="d"></span><div class="c">2024 · Hoy</div></div></div>';
    el.appendChild(s);
    const fill=s.querySelector('.nvtl-fill'),items=[...s.querySelectorAll('.nvtl-item')];
    const timers=[];
    function cycle(){
      fill.classList.remove('run');items.forEach(it=>it.classList.remove('on'));
      void fill.offsetWidth;fill.classList.add('run');
      items.forEach((it,i)=>timers.push(setTimeout(()=>it.classList.add('on'),250+i*620)));
    }
    cycle();
    const loop=setInterval(cycle,3800);
    return{stop(){clearInterval(loop);timers.forEach(clearTimeout);el.innerHTML='';}};
  }
};
export default effect;
