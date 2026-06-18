/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-bottom-sheet', title:'Bottom Sheet', cat:'Navegación',
  tags:['bottom sheet','hoja','drawer','handle','backdrop','mobile','swipe'],
  desc:'Hoja inferior que sube desde abajo con handle de arrastre y backdrop que se oscurece, estilo móvil.',
  meta:['translateY','backdrop','CSS+JS'],
  prompt:`Crea un "Bottom Sheet" móvil: un panel que sube desde el borde inferior cubriendo parte de la pantalla, con un backdrop oscuro detrás y un "handle" (barrita) arrastrable arriba.
Elementos: .backdrop (overlay full-screen, fade), .sheet (panel anclado abajo con border-radius superior, padding y contenido: handle + título + lista de items).
Técnica: el sheet parte fuera de pantalla con transform:translateY(100%); al abrir pasa a translateY(0) con transición ease (~360ms). El backdrop pasa de opacity:0 a ~0.5 a la vez. El handle es una barrita redondeada centrada.
Para móvil real, soporta drag del handle para cerrar. Auto-demo: sube el sheet, mantén, baja, en bucle. Timings: 360ms cubic-bezier(.32,.72,0,1).`,
  code:`<div class="bd"></div>
<div class="sheet">
  <div class="handle"></div>
  <h4>Opciones</h4>
  <ul><li>Compartir</li><li>Guardar</li><li>Editar</li><li>Eliminar</li></ul>
</div>
<style>
.bd{position:absolute;inset:0;background:#000;opacity:0;transition:opacity .36s;pointer-events:none}
.sheet{position:absolute;left:0;right:0;bottom:0;background:#13131f;color:#fff;
  border-radius:18px 18px 0 0;padding:10px 18px 22px;
  transform:translateY(100%);transition:transform .36s cubic-bezier(.32,.72,0,1)}
.open .bd{opacity:.5}
.open .sheet{transform:translateY(0)}
.handle{width:40px;height:4px;border-radius:2px;background:#444;margin:6px auto 14px}
.sheet h4{margin:0 0 10px;font-size:14px}
.sheet li{list-style:none;padding:9px 0;border-top:1px solid #ffffff14;font-size:13px}
</style>
<script>
const root=document.querySelector('.wrap');
function open(){root.classList.add('open')}
function close(){root.classList.remove('open')}
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;width:100%;height:100%;background:#0a0a14;overflow:hidden';
    s.innerHTML='<style>'
      +'.nbs-bd{position:absolute;inset:0;background:#000;opacity:0;transition:opacity .36s}'
      +'.nbs-sheet{position:absolute;left:0;right:0;bottom:0;background:#13131f;color:#fff;border-radius:18px 18px 0 0;padding:8px 18px 18px;transform:translateY(100%);transition:transform .36s cubic-bezier(.32,.72,0,1);box-shadow:0 -10px 30px rgba(0,0,0,.5)}'
      +'.nbs.open .nbs-bd{opacity:.5}'
      +'.nbs.open .nbs-sheet{transform:translateY(0)}'
      +'.nbs-h{width:40px;height:4px;border-radius:2px;background:#4a4a5e;margin:6px auto 12px;transition:background .2s}'
      +'.nbs.open .nbs-h{background:#7b5cff}'
      +'.nbs-sheet h4{margin:0 0 8px;font:600 13px system-ui,sans-serif;color:#cfcfe0}'
      +'.nbs-sheet ul{margin:0;padding:0}'
      +'.nbs-sheet li{list-style:none;padding:8px 0;border-top:1px solid #ffffff12;font:500 12px system-ui,sans-serif;display:flex;gap:9px;align-items:center}'
      +'.nbs-sheet li b{color:#00e0c6;font-weight:400}'
      +'</style>'
      +'<div class="nbs">'
      +'<div class="nbs-bd"></div>'
      +'<div class="nbs-sheet"><div class="nbs-h"></div><h4>Opciones</h4>'
      +'<ul><li><b>&#8599;</b>Compartir</li><li><b>&#9733;</b>Guardar</li><li><b>&#9998;</b>Editar</li><li><b>&#10005;</b>Eliminar</li></ul>'
      +'</div></div>';
    el.appendChild(s);
    const root=s.querySelector('.nbs');
    let open=false;const toggle=()=>{open=!open;root.classList.toggle('open',open);};
    setTimeout(toggle,300);
    const t=setInterval(toggle,2100);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
