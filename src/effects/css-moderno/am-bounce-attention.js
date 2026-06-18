/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-bounce-attention', title:'Bounce', cat:'CSS Moderno',
  tags:['css','bounce','rebote','attention','atencion','keyframes','animate'],
  desc:'Rebote vertical de atención que sube y baja con varios picos, ideal para llamar la atención sobre un elemento.',
  meta:['transform','0 JS'],
  prompt:`Crea un efecto "Bounce" de atención solo con CSS, estilo animate.css.
Un elemento que rebota verticalmente con varios picos decrecientes usando translateY.
Define @keyframes con paradas: 0%,20%,53%,80%,100% en translateY(0); 40%,43% en translateY(-30px); 70% en translateY(-15px); 90% en translateY(-4px).
Usa transform-origin:center bottom y cubic-bezier separados para subida y bajada (ej: cubic-bezier(.755,.05,.855,.06) y cubic-bezier(.215,.61,.355,1)). Duración 1s, infinite. Sin JS.`,
  code:`.bounce {
  transform-origin: center bottom;
  animation: am-bounce 1s ease infinite;
}
@keyframes am-bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(.215,.61,.355,1);
  }
  40%, 43% {
    transform: translateY(-30px);
    animation-timing-function: cubic-bezier(.755,.05,.855,.06);
  }
  70% {
    transform: translateY(-15px);
    animation-timing-function: cubic-bezier(.755,.05,.855,.06);
  }
  90% { transform: translateY(-4px); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amBounce{0%,20%,53%,80%,100%{transform:translateY(0);animation-timing-function:cubic-bezier(.215,.61,.355,1)}40%,43%{transform:translateY(-30px);animation-timing-function:cubic-bezier(.755,.05,.855,.06)}70%{transform:translateY(-15px);animation-timing-function:cubic-bezier(.755,.05,.855,.06)}90%{transform:translateY(-4px)}}</style><div style="transform-origin:center bottom;animation:amBounce 1s ease infinite;width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#7b5cff,#00e0c6);box-shadow:0 12px 24px rgba(123,92,255,.4);display:grid;place-items:center;color:#fff;font:700 13px system-ui">Bounce</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
