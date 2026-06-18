/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-mock-browser', title:'Mock Browser', cat:'UI Components',
  tags:['browser','navegador','mockup','window','loading','skeleton','ui'],
  desc:'Ventana de navegador simulada con barra de tráfico, URL y contenido que carga con skeletons en bucle.',
  meta:['CSS','skeleton','auto-demo'],
  prompt:`Crea un mockup de ventana de navegador con una demo de carga en bucle.
Elementos: una "ventana" con bordes redondeados y barra superior que contiene tres puntos de tráfico (rojo/amarillo/verde) y una barra de direcciones (URL). Debajo, el área de contenido (viewport) con bloques: una barra de progreso fina arriba, y filas de contenido (un bloque grande tipo hero y varias líneas).
Estados de la demo: (1) cargando -> los bloques son "skeletons" con shimmer (gradiente que recorre, @keyframes background-position) y una barra de progreso que avanza de 0% a 100%; (2) cargado -> los bloques toman color sólido/acento. Tras una pausa, reinicia el ciclo.
Técnica: alterna clases .loading/.loaded con un timeline (setInterval). Shimmer con linear-gradient animado. Barra de progreso con transición de width.
Timings: progreso ~1.6s, pausa cargado ~1.4s, luego reset. Colores acento #7b5cff y secundario #00e0c6 sobre fondo oscuro.`,
  code:`<div class="mb loading">
  <div class="bar"><i class="d r"></i><i class="d y"></i><i class="d g"></i><span class="url">https://animai.app</span></div>
  <div class="prog"><span></span></div>
  <div class="view">
    <div class="hero sk"></div>
    <div class="line sk"></div><div class="line sk"></div>
  </div>
</div>
<style>
.mb{width:240px;border-radius:10px;background:#12121c;border:1px solid rgba(255,255,255,.08);overflow:hidden}
.bar{display:flex;align-items:center;gap:6px;padding:8px;background:#1a1a26}
.d{width:9px;height:9px;border-radius:50%}.r{background:#ff5f57}.y{background:#febc2e}.g{background:#28c840}
.url{margin-left:8px;font:11px system-ui;color:#888;background:#0e0e16;padding:3px 8px;border-radius:6px;flex:1}
.prog{height:3px;background:#0e0e16}.prog span{display:block;height:100%;width:0;background:linear-gradient(90deg,#7b5cff,#00e0c6);transition:width 1.6s linear}
.mb.loading .prog span{width:100%}
.view{padding:12px;display:grid;gap:9px}
.hero{height:60px;border-radius:8px}.line{height:12px;border-radius:6px}
.sk{background:linear-gradient(90deg,#1c1c28 25%,#2a2a3a 50%,#1c1c28 75%);background-size:200% 100%;animation:mbShimmer 1.2s linear infinite}
.mb.loaded .hero{background:linear-gradient(135deg,#7b5cff,#00e0c6);animation:none}
.mb.loaded .line{background:#2a2a3a;animation:none}
@keyframes mbShimmer{to{background-position:-200% 0}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes ucmbShimmer{to{background-position:-200% 0}}'
      +'.ucmb{width:230px;border-radius:10px;background:#12121c;border:1px solid rgba(255,255,255,.08);overflow:hidden}'
      +'.ucmb .bar{display:flex;align-items:center;gap:6px;padding:8px;background:#1a1a26}'
      +'.ucmb .d{width:9px;height:9px;border-radius:50%}.ucmb .r{background:#ff5f57}.ucmb .y{background:#febc2e}.ucmb .g{background:#28c840}'
      +'.ucmb .url{margin-left:6px;font:11px system-ui;color:#888;background:#0e0e16;padding:3px 8px;border-radius:6px;flex:1;white-space:nowrap;overflow:hidden}'
      +'.ucmb .prog{height:3px;background:#0e0e16}.ucmb .prog span{display:block;height:100%;width:0;background:linear-gradient(90deg,#7b5cff,#00e0c6);transition:width 1.6s linear}'
      +'.ucmb.loading .prog span{width:100%}'
      +'.ucmb .view{padding:12px;display:grid;gap:9px}'
      +'.ucmb .hero{height:54px;border-radius:8px}.ucmb .line{height:11px;border-radius:6px}.ucmb .line.short{width:60%}'
      +'.ucmb .sk{background:linear-gradient(90deg,#1c1c28 25%,#2a2a3a 50%,#1c1c28 75%);background-size:200% 100%;animation:ucmbShimmer 1.2s linear infinite}'
      +'.ucmb.loaded .hero{background:linear-gradient(135deg,#7b5cff,#00e0c6);animation:none}'
      +'.ucmb.loaded .line{background:#2a2a3a;animation:none}'
      +'</style>'
      +'<div class="ucmb loading">'
      +'<div class="bar"><i class="d r"></i><i class="d y"></i><i class="d g"></i><span class="url">https://animai.app</span></div>'
      +'<div class="prog"><span></span></div>'
      +'<div class="view"><div class="hero sk"></div><div class="line sk"></div><div class="line short sk"></div></div>'
      +'</div>';
    el.appendChild(s);
    const box=s.querySelector('.ucmb');
    const timers=[];
    function cycle(){
      box.classList.remove('loaded');box.classList.add('loading');
      void box.offsetWidth; // reinicia transición de la barra
      timers.push(setTimeout(()=>{box.classList.remove('loading');box.classList.add('loaded');},1700));
    }
    cycle();
    const main=setInterval(cycle,3200);
    return{stop(){clearInterval(main);timers.forEach(clearTimeout);el.innerHTML='';}};
  }
};
export default effect;
