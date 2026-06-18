/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-dynamic-island', title:'Dynamic Island', cat:'Navegación',
  tags:['dynamic island','isla','expand','notch','pill','contextual','ios'],
  desc:'Píldora superior que se expande y contrae con elasticidad para mostrar contenido contextual (llamada, música, timer).',
  meta:['transform','spring','CSS+JS'],
  prompt:`Crea una "Dynamic Island" estilo iOS: una píldora negra centrada arriba que cambia de tamaño con elasticidad y muestra distintos contenidos contextuales.
Elementos: un contenedor .island con border-radius grande, fondo casi negro, y dentro varias "vistas" (compacta = punto/indicador, expandida = icono + texto + acción).
Técnica: anima width, height y border-radius con una transición tipo spring (cubic-bezier elástico, ~450ms). Al pasar de compacta a expandida cruza un fade/scale del contenido interno (opacity + translateY). Mantén el centrado con margin:auto o transform translateX(-50%).
Estados sugeridos (cíclalos): idle (pequeña), música (cover + barras de ecualizador animadas), llamada (avatar + botones), timer (cuenta atrás). Cada estado tiene su tamaño objetivo.
Timings: morph 450ms cubic-bezier(.5,1.6,.4,1), contenido entra con 120ms de delay. Ecualizador con @keyframes scaleY infinito.`,
  code:`<div class="island" data-state="idle"></div>
<style>
.island{
  position:absolute; top:14px; left:50%; transform:translateX(-50%);
  background:#08080c; color:#fff; border-radius:22px;
  display:flex; align-items:center; gap:8px; overflow:hidden;
  width:120px; height:34px; padding:0 14px;
  transition:width .45s cubic-bezier(.5,1.6,.4,1), height .45s cubic-bezier(.5,1.6,.4,1), border-radius .45s;
}
.island[data-state="music"]{ width:240px; height:54px; }
.island[data-state="call"]{ width:240px; height:60px; }
.island .eq{display:flex;gap:3px;align-items:flex-end;height:18px}
.island .eq i{width:3px;background:#00e0c6;border-radius:2px;animation:eqBar .6s ease-in-out infinite alternate}
.island .eq i:nth-child(2){animation-delay:.2s}
.island .eq i:nth-child(3){animation-delay:.4s}
@keyframes eqBar{from{height:4px}to{height:18px}}
</style>
<script>
const states=['idle','music','call'];let i=0;
const isl=document.querySelector('.island');
setInterval(()=>{ i=(i+1)%states.length; isl.dataset.state=states[i]; },2200);
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;width:100%;height:100%;background:#0a0a14;display:block;overflow:hidden';
    s.innerHTML='<style>'
      +'@keyframes ndiEq{from{height:4px}to{height:16px}}'
      +'.ndi{position:absolute;top:18px;left:50%;transform:translateX(-50%);background:#08080c;color:#fff;border-radius:20px;display:flex;align-items:center;gap:9px;overflow:hidden;width:96px;height:30px;padding:0 12px;box-shadow:0 6px 20px rgba(0,0,0,.5);transition:width .45s cubic-bezier(.5,1.6,.4,1),height .45s cubic-bezier(.5,1.6,.4,1)}'
      +'.ndi .dot{width:8px;height:8px;border-radius:50%;background:#7b5cff}'
      +'.ndi .lbl{font:600 11px system-ui,sans-serif;white-space:nowrap;letter-spacing:.3px}'
      +'.ndi .cov{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#7b5cff,#00e0c6);flex:0 0 auto}'
      +'.ndi .av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#ff7b9c,#7b5cff);flex:0 0 auto}'
      +'.ndi .btn{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:700 14px system-ui;color:#fff;flex:0 0 auto}'
      +'.ndi .eq{display:flex;gap:3px;align-items:flex-end;height:16px}'
      +'.ndi .eq i{width:3px;background:#00e0c6;border-radius:2px;animation:ndiEq .6s ease-in-out infinite alternate}'
      +'.ndi .eq i:nth-child(2){animation-delay:.18s}.ndi .eq i:nth-child(3){animation-delay:.36s}.ndi .eq i:nth-child(4){animation-delay:.12s}'
      +'.ndi .grow{flex:1}'
      +'</style>'
      +'<div class="ndi"></div>';
    el.appendChild(s);
    const isl=s.querySelector('.ndi');
    const views={
      idle:{w:96,h:30,html:'<span class="dot"></span><span class="lbl" style="color:#8a8aa0">En espera</span>'},
      music:{w:210,h:50,html:'<span class="cov"></span><span class="lbl">Daft Punk — Aerodynamic</span><span class="grow"></span><span class="eq"><i></i><i></i><i></i><i></i></span>'},
      call:{w:214,h:54,html:'<span class="av"></span><span class="lbl">Llamada · 00:42</span><span class="grow"></span><span class="btn" style="background:#1db954">&#9742;</span><span class="btn" style="background:#ff4d5e">&#10005;</span>'}
    };
    const order=['idle','music','call'];let i=0;
    const apply=()=>{const v=views[order[i]];isl.style.width=v.w+'px';isl.style.height=v.h+'px';
      isl.style.opacity='.3';isl.innerHTML=v.html;
      setTimeout(()=>{isl.style.transition='width .45s cubic-bezier(.5,1.6,.4,1),height .45s cubic-bezier(.5,1.6,.4,1),opacity .2s';isl.style.opacity='1';},90);};
    apply();
    const t=setInterval(()=>{i=(i+1)%order.length;apply();},2200);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
