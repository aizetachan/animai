/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-slide-unlock', title:'Slide to Unlock', cat:'Micro-interacciones',
  tags:['slide','unlock','deslizar','knob','shimmer','ios','micro'],
  desc:'Knob que se desliza por un track revelando el desbloqueo, con texto shimmer que recorre el fondo.',
  meta:['transform','background-clip','animation'],
  prompt:`Crea un control "slide to unlock" tipo iOS.
Estructura: un .track (pill horizontal con borde tenue) que contiene un texto centrado "desliza para desbloquear" y un .knob redondo a la izquierda con una flecha.
El texto usa un gradiente lineal claro recortado con background-clip:text y background-size:200% animado de izquierda a derecha (efecto shimmer) con @keyframes.
El knob se desliza con transform:translateX hasta el final del track usando @keyframes (de 0 a track-width) y al llegar se desvanece el texto; luego reinicia el bucle.
Usa colores de acento #7b5cff y #00e0c6. Timings: shimmer 2s linear infinite, knob 3s ease-in-out infinite con pausa al inicio.`,
  code:`<div class="track">
  <span class="hint">desliza para desbloquear</span>
  <div class="knob">›</div>
</div>
<style>
.track{position:relative;width:230px;height:54px;border-radius:27px;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);
  display:flex;align-items:center;overflow:hidden}
.hint{position:absolute;inset:0;display:grid;place-items:center;font-size:14px;
  background:linear-gradient(90deg,#5a5a6e 30%,#fff 50%,#5a5a6e 70%);
  background-size:200% 100%;-webkit-background-clip:text;background-clip:text;
  color:transparent;animation:suShine 2s linear infinite}
.knob{position:absolute;left:4px;width:46px;height:46px;border-radius:50%;
  background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#fff;
  display:grid;place-items:center;font-size:22px;font-weight:700;
  box-shadow:0 4px 14px rgba(123,92,255,.5);animation:suSlide 3s ease-in-out infinite}
@keyframes suShine{to{background-position:-200% 0}}
@keyframes suSlide{0%,15%{transform:translateX(0)}55%,75%{transform:translateX(176px)}100%{transform:translateX(0)}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes miSuShine{to{background-position:-200% 0}}'
      +'@keyframes miSuSlide{0%,15%{transform:translateX(0)}55%,75%{transform:translateX(176px)}100%{transform:translateX(0)}}'
      +'@keyframes miSuFade{0%,40%{opacity:1}60%,80%{opacity:0}100%{opacity:1}}'
      +'.miSuTrack{position:relative;width:230px;height:54px;border-radius:27px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);overflow:hidden}'
      +'.miSuHint{position:absolute;inset:0;display:grid;place-items:center;font-size:14px;font-family:system-ui,sans-serif;background:linear-gradient(90deg,#5a5a6e 30%,#fff 50%,#5a5a6e 70%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:miSuShine 2s linear infinite,miSuFade 3s ease-in-out infinite}'
      +'.miSuKnob{position:absolute;left:4px;top:4px;width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#7b5cff,#00e0c6);color:#fff;display:grid;place-items:center;font-size:22px;font-weight:700;box-shadow:0 4px 14px rgba(123,92,255,.5);animation:miSuSlide 3s ease-in-out infinite}'
      +'</style>'
      +'<div class="miSuTrack"><span class="miSuHint">desliza para desbloquear</span><div class="miSuKnob">›</div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
