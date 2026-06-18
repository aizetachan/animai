/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-skew', title:'Skew Pop', cat:'Hover & UI',
  tags:['skew','hover.css','inclinar','pop','botón','dinámico'],
  desc:'El elemento se inclina al hover dando dinamismo. El "skew" de Hover.css para elementos vivos.',
  meta:['transform:skew','Hover','Dinámico'],
  prompt:`Recrea el efecto "Skew" de Hover.css: el elemento se inclina (transform:skewX(-10deg)) al hover con una transición rápida, dando una sensación dinámica/italic.
Útil para etiquetas, badges o botones que quieres que se sientan "rápidos". Combínalo con un ligero scale para más punch.`,
  code:`/* Hover.css — Skew */
.hvr-skew { transition: transform 0.3s ease; }
.hvr-skew:hover { transform: skewX(-10deg) scale(1.04); }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes skw{0%,100%{transform:skewX(0) scale(1)}50%{transform:skewX(-12deg) scale(1.05)}}</style><div style="padding:13px 26px;border-radius:10px;background:#00e0c6;color:#04221d;font-weight:800;animation:skw 2.2s ease-in-out infinite">FAST</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
