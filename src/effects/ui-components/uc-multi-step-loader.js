/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-multi-step-loader', title:'Multi Step Loader', cat:'UI Components',
  tags:['loader','steps','pasos','check','secuencia','aceternity','progress'],
  desc:'Lista de pasos que se completan con un check en secuencia, resaltando el paso activo.',
  meta:['Aceternity UI','transition','setInterval'],
  prompt:`Recrea el Multi Step Loader de Aceternity: una lista vertical de pasos que se van marcando como completados uno a uno, con un check, mientras el paso actual queda resaltado.
Elementos: una columna de filas; cada fila tiene un icono circular (vacío → check) y una etiqueta de texto. Estados: pendiente (atenuado, círculo vacío), activo (resaltado, color acento), completado (check verde, texto normal).
Técnica: un índice activo avanza con setInterval; al avanzar, el paso anterior pasa a completado (círculo con check, transición de opacidad/escala) y el nuevo paso se resalta. El check entra con una pequeña animación de escala. Al terminar todos, espera y reinicia el ciclo en bucle.
Color: activo #7b5cff, check #00e0c6, pendientes atenuados. Timings: ~750ms por paso, pausa final ~1s, reinicio.`,
  code:`<ul class="msl">
  <li>Connecting account</li><li>Verifying data</li><li>Building assets</li><li>Deploying</li>
</ul>
<style>
.msl{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.msl li{display:flex;align-items:center;gap:12px;color:#666;transition:.3s}
.msl li::before{content:"";width:22px;height:22px;border-radius:50%;border:2px solid #444;display:grid;place-items:center;transition:.3s}
.msl li.active{color:#fff}
.msl li.active::before{border-color:#7b5cff;box-shadow:0 0 12px #7b5cff}
.msl li.done{color:#cfd2e6}
.msl li.done::before{content:"\\2713";border-color:#00e0c6;background:#00e0c6;color:#04140f;font-weight:900;font-size:13px}
</style>
<script>
const items=[...document.querySelectorAll('.msl li')];let i=0;
setInterval(()=>{ items.forEach((li,n)=>{ li.classList.toggle('done',n<i); li.classList.toggle('active',n===i); });
  i=(i+1)%(items.length+1); },800);
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0a0a16';
    s.innerHTML='<style>'
      +'@keyframes ucMslCheck{0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}'
      +'.ucmsl{list-style:none;margin:0;padding:0;display:grid;gap:13px;font:600 14px system-ui,sans-serif}'
      +'.ucmsl li{display:flex;align-items:center;gap:11px;color:#5a5a72;transition:color .3s}'
      +'.ucmsl .dot{width:21px;height:21px;border-radius:50%;border:2px solid #3a3a52;display:grid;place-items:center;transition:.3s;box-sizing:border-box;flex:none;font-size:0}'
      +'.ucmsl li.active{color:#fff}'
      +'.ucmsl li.active .dot{border-color:#7b5cff;box-shadow:0 0 12px #7b5cff}'
      +'.ucmsl li.done{color:#cfd2e6}'
      +'.ucmsl li.done .dot{border-color:#00e0c6;background:#00e0c6;color:#04140f;font-weight:900;font-size:12px;animation:ucMslCheck .4s ease}'
      +'</style>'
      +'<ul class="ucmsl">'
      +'<li><span class="dot">&#10003;</span>Connecting account</li>'
      +'<li><span class="dot">&#10003;</span>Verifying data</li>'
      +'<li><span class="dot">&#10003;</span>Building assets</li>'
      +'<li><span class="dot">&#10003;</span>Deploying</li>'
      +'</ul>';
    el.appendChild(s);
    const items=[...s.querySelectorAll('.ucmsl li')];
    let i=0;
    const tick=()=>{
      items.forEach((li,n)=>{li.classList.toggle('done',n<i);li.classList.toggle('active',n===i);});
      i=(i+1)%(items.length+2);
    };
    tick();
    const t=setInterval(tick,800);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
