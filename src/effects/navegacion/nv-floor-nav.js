/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-floor-nav', title:'Floor Navigation', cat:'Navegación',
  tags:['nav','sidebar','sección','indicador','indicator','sliding','activo'],
  desc:'Navegación lateral de secciones con un indicador deslizante que se mueve fluido al ítem activo.',
  meta:['nav','sliding pill','CSS+JS'],
  prompt:`Crea una navegación lateral vertical ("floor nav") con un indicador que se desliza suavemente hasta el ítem activo, como botones de planta de un ascensor.
Elementos: una lista vertical de enlaces/ítems y un "indicador" (pastilla o barra) posicionado en absoluto detrás del ítem activo. El indicador usa transform:translateY y se mueve con transición elástica.
Técnica: al activar un ítem (hover/scroll spy/click), lee su offsetTop y altura y mueve el indicador a esa posición (translateY + height). El ítem activo cambia de color a #7b5cff; los demás quedan tenues. Acompaña con un punto/línea acento.
Timings: transición del indicador ~400ms cubic-bezier con ligero rebote. Auto-demo en bucle: recorre los ítems uno a uno mostrando el deslizamiento del indicador y volviendo al inicio.`,
  code:`<nav class="floor">
  <span class="pill"></span>
  <a class="item active">Inicio</a>
  <a class="item">Proyectos</a>
  <a class="item">Estudio</a>
  <a class="item">Contacto</a>
</nav>
<style>
.floor{position:relative;display:flex;flex-direction:column;gap:6px;padding:6px}
.pill{position:absolute;left:6px;width:calc(100% - 12px);height:36px;border-radius:10px;background:rgba(123,92,255,.18);border:1px solid #7b5cff;transition:transform .4s cubic-bezier(.34,1.56,.64,1)}
.item{position:relative;height:36px;display:flex;align-items:center;padding:0 14px;color:#8a8aa0;font:600 14px Inter;cursor:pointer;transition:color .3s;border-radius:10px}
.item.active{color:#fff}
</style>
<script>
const items=[...document.querySelectorAll('.item')],pill=document.querySelector('.pill');
function go(i){
  items.forEach(it=>it.classList.remove('active'));
  items[i].classList.add('active');
  pill.style.transform='translateY('+items[i].offsetTop+'px)';
}
items.forEach((it,i)=>it.addEventListener('mouseenter',()=>go(i)));
go(0);
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;width:100%;height:100%;display:grid;place-items:center;background:#0a0a14;font-family:Inter,system-ui,sans-serif';
    const labels=['Inicio','Proyectos','Estudio','Equipo','Contacto'];
    let items='';labels.forEach(l=>items+='<a class="nvfn-item">'+l+'</a>');
    s.innerHTML='<style>'
      +'.nvfn{position:relative;display:flex;flex-direction:column;gap:6px;padding:8px;background:#101019;border:1px solid #20202f;border-radius:14px}'
      +'.nvfn-pill{position:absolute;left:8px;width:calc(100% - 16px);height:32px;border-radius:9px;background:rgba(123,92,255,.16);border:1px solid #7b5cff;box-shadow:0 0 12px rgba(123,92,255,.35);transition:transform .42s cubic-bezier(.34,1.56,.64,1)}'
      +'.nvfn-item{position:relative;height:32px;display:flex;align-items:center;gap:8px;padding:0 28px 0 14px;color:#7a7a92;font:600 13px Inter;border-radius:9px;transition:color .3s}'
      +'.nvfn-item::before{content:"";width:6px;height:6px;border-radius:50%;background:#33334a;transition:.3s}'
      +'.nvfn-item.active{color:#fff}'
      +'.nvfn-item.active::before{background:#00e0c6;box-shadow:0 0 8px #00e0c6}'
      +'</style>'
      +'<nav class="nvfn"><span class="nvfn-pill"></span>'+items+'</nav>';
    el.appendChild(s);
    const list=[...s.querySelectorAll('.nvfn-item')],pill=s.querySelector('.nvfn-pill');
    let i=0,dir=1;
    function go(n){
      list.forEach(it=>it.classList.remove('active'));
      const a=list[n];a.classList.add('active');
      pill.style.transform='translateY('+a.offsetTop+'px)';
    }
    // posiciona sin transición al inicio
    requestAnimationFrame(()=>go(0));
    const loop=setInterval(()=>{
      i+=dir;
      if(i>=list.length-1)dir=-1;
      else if(i<=0)dir=1;
      go(i);
    },1100);
    return{stop(){clearInterval(loop);el.innerHTML='';}};
  }
};
export default effect;
