/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-pull-refresh', title:'Pull to Refresh', cat:'Micro-interacciones',
  tags:['pull','refresh','refrescar','spinner','arrow','flecha','micro'],
  desc:'Flecha que se estira hacia abajo al tirar y se transforma en un spinner girando, en bucle automatico.',
  meta:['transform','clip-path','animation'],
  prompt:`Crea una micro-interaccion "pull to refresh".
Estructura: una zona .pull con un indicador centrado. El indicador tiene dos estados: una flecha (↓) que aparece y se estira hacia abajo (translateY + scaleY) durante la fase de "tirar", y un anillo spinner (aro con border-top de color) que aparece y gira durante la fase de "refrescar".
Usa keyframes encadenados: fase 1 la flecha baja y crece su opacidad; fase 2 la flecha desaparece y el spinner gira 360deg varias veces; luego todo vuelve al inicio en bucle.
Colores: aro con borde #7b5cff y #00e0c6. Spinner gira con animation 0.7s linear; el ciclo total ~3.5s infinite.`,
  code:`<div class="pull">
  <div class="arrow">↓</div>
  <div class="ring"></div>
</div>
<style>
.pull{position:relative;width:120px;height:120px}
.arrow{position:absolute;left:50%;top:14px;transform:translateX(-50%);
  font-size:26px;color:#00e0c6;animation:prArrow 3.5s ease-in-out infinite}
.ring{position:absolute;left:50%;top:18px;width:30px;height:30px;margin-left:-15px;
  border-radius:50%;border:3px solid rgba(255,255,255,.15);border-top-color:#7b5cff;
  opacity:0;animation:prShow 3.5s linear infinite,prSpin .7s linear infinite}
@keyframes prArrow{0%{opacity:0;transform:translateX(-50%) translateY(-10px) scaleY(.6)}
  30%{opacity:1;transform:translateX(-50%) translateY(20px) scaleY(1.3)}
  45%,100%{opacity:0;transform:translateX(-50%) translateY(20px) scaleY(1.3)}}
@keyframes prShow{0%,42%{opacity:0}48%,90%{opacity:1}100%{opacity:0}}
@keyframes prSpin{to{transform:rotate(360deg)}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes miPrArrow{0%{opacity:0;transform:translateX(-50%) translateY(-10px) scaleY(.6)}30%{opacity:1;transform:translateX(-50%) translateY(38px) scaleY(1.3)}45%,100%{opacity:0;transform:translateX(-50%) translateY(38px) scaleY(1.3)}}'
      +'@keyframes miPrShow{0%,42%{opacity:0}48%,90%{opacity:1}100%{opacity:0}}'
      +'@keyframes miPrSpin{to{transform:rotate(360deg)}}'
      +'.miPrPull{position:relative;width:120px;height:120px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1)}'
      +'.miPrArrow{position:absolute;left:50%;top:14px;transform:translateX(-50%);font-size:28px;color:#00e0c6;font-family:system-ui,sans-serif;animation:miPrArrow 3.5s ease-in-out infinite}'
      +'.miPrRing{position:absolute;left:50%;top:20px;width:30px;height:30px;margin-left:-15px;border-radius:50%;border:3px solid rgba(255,255,255,.15);border-top-color:#7b5cff;opacity:0;animation:miPrShow 3.5s linear infinite,miPrSpin .7s linear infinite}'
      +'</style>'
      +'<div class="miPrPull"><div class="miPrArrow">↓</div><div class="miPrRing"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
