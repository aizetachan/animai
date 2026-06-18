/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-context-menu', title:'Context Menu', cat:'Navegación',
  tags:['context menu','menú','popover','stagger','transform-origin','right-click','escala'],
  desc:'Menú contextual que aparece con escala desde su origen y revela los ítems con un stagger.',
  meta:['transform-origin','stagger','CSS+JS'],
  prompt:`Crea un menú contextual (click derecho / popover) que aparece con una animación de escala desde la esquina y revela sus ítems en cascada (stagger).
Elementos: un contenedor .menu con position:absolute, transform-origin:top left, lista de ítems (con icono + label) y separadores.
Técnica de apertura: el contenedor anima opacity 0→1 y transform de scale(.85) translateY(-6px) a scale(1) translateY(0) en ~180ms ease-out, anclado por transform-origin a la esquina donde se invocó. Cada ítem entra con su propio @keyframes (opacity 0→1, translateY(6px)→0) con transition-delay incremental (ej. i*35ms) para el efecto stagger.
Cierre: invierte la escala/opacidad rápido (~120ms).
Para auto-demo: alterna abrir/cerrar el menú en bucle con setInterval (abrir ~1.8s visible, cerrar ~0.6s), reseteando las animaciones de stagger en cada apertura.`,
  code:`<div class="ctx" id="m">
  <button class="it">✂️ Cortar</button>
  <button class="it">📋 Copiar</button>
  <button class="it">📌 Pegar</button>
  <span class="sep"></span>
  <button class="it">🗑️ Eliminar</button>
</div>
<style>
.ctx{position:absolute;transform-origin:top left;display:flex;flex-direction:column;gap:2px;padding:6px;border-radius:12px;background:#16162a;border:1px solid #2a2a44;
  opacity:0;transform:scale(.85) translateY(-6px);transition:opacity .18s ease,transform .18s ease}
.ctx.open{opacity:1;transform:scale(1) translateY(0)}
.it{border:0;background:none;color:#cfd0e0;text-align:left;padding:7px 14px;border-radius:8px;font:500 13px Inter;cursor:pointer;
  opacity:0;transform:translateY(6px);transition:opacity .2s ease,transform .2s ease,background .15s}
.ctx.open .it{opacity:1;transform:none}
.ctx .it:nth-child(1){transition-delay:.05s}
.ctx .it:nth-child(2){transition-delay:.09s}
.ctx .it:nth-child(3){transition-delay:.13s}
.ctx .it:nth-child(5){transition-delay:.17s}
.it:hover{background:#7b5cff;color:#fff}
.sep{height:1px;background:#2a2a44;margin:4px 6px}
</style>
<script>
const m=document.getElementById('m');
addEventListener('contextmenu',e=>{e.preventDefault();m.style.left=e.clientX+'px';m.style.top=e.clientY+'px';m.classList.add('open');});
addEventListener('click',()=>m.classList.remove('open'));
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;position:relative';
    s.innerHTML='<style>'
      +'.nvcm{transform-origin:top left;display:flex;flex-direction:column;gap:2px;padding:6px;border-radius:12px;background:#16162a;border:1px solid #2a2a44;box-shadow:0 12px 30px rgba(0,0,0,.4);'
      +'opacity:0;transform:scale(.85) translateY(-6px);transition:opacity .18s ease,transform .18s ease}'
      +'.nvcm.open{opacity:1;transform:scale(1) translateY(0)}'
      +'.nvcm .it{border:0;background:none;color:#cfd0e0;text-align:left;padding:6px 16px 6px 12px;border-radius:8px;font:500 12px Inter,sans-serif;cursor:pointer;white-space:nowrap;'
      +'opacity:0;transform:translateY(6px);transition:opacity .2s ease,transform .2s ease,background .15s,color .15s}'
      +'.nvcm.open .it{opacity:1;transform:none}'
      +'.nvcm .it:nth-child(1){transition-delay:.05s}.nvcm .it:nth-child(2){transition-delay:.09s}.nvcm .it:nth-child(3){transition-delay:.13s}.nvcm .it:nth-child(5){transition-delay:.17s}'
      +'.nvcm .it:hover{background:#7b5cff;color:#fff}'
      +'.nvcm .sep{height:1px;background:#2a2a44;margin:4px 6px}'
      +'</style>'
      +'<div class="nvcm">'
      +'<button class="it">&#9986; Cortar</button>'
      +'<button class="it">&#128203; Copiar</button>'
      +'<button class="it">&#128204; Pegar</button>'
      +'<span class="sep"></span>'
      +'<button class="it">&#128465; Eliminar</button>'
      +'</div>';
    el.appendChild(s);
    const m=s.querySelector('.nvcm');
    let open=false,to;
    function tick(){
      open=!open;m.classList.toggle('open',open);
      to=setTimeout(tick,open?1800:600);
    }
    tick();
    return{stop(){clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
