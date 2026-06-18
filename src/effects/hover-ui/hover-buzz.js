/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-buzz', title:'Buzz', cat:'Hover & UI',
  tags:['buzz','hover.css','vibrar','shake','error','botón'],
  desc:'Vibración rápida tipo "zumbido". Hover.css para feedback de error o elementos nerviosos.',
  meta:['Hover.css','translate+rotate','Shake'],
  prompt:`Recrea el efecto "Buzz" de Hover.css: vibración rápida combinando pequeñas translaciones X y rotaciones alternas en @keyframes.
Bueno como feedback de error en un campo/botón (dispáralo al fallar una validación) o para un icono "urgente". Mantenlo breve para no marear.`,
  code:`/* Hover.css — Buzz */
@keyframes buzz {
  50% { transform: translateX(3px) rotate(2deg); }
  100% { transform: translateX(-3px) rotate(-2deg); }
}
.hvr-buzz:hover { animation: buzz 0.15s linear infinite; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes bzz{50%{transform:translateX(3px) rotate(2deg)}100%{transform:translateX(-3px) rotate(-2deg)}}</style><div style="padding:13px 24px;border-radius:12px;background:#ff5ca8;color:#fff;font-weight:700;animation:bzz .15s linear infinite">Error!</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
