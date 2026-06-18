/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-liquid-btn', title:'Liquid Button', cat:'CSS Moderno',
  tags:['liquid','botón','morph','hover','conic','gradiente','css'],
  desc:'Botón que muta su forma y revela un gradiente líquido al hover. Microinteracción CSS llamativa.',
  meta:['border-radius','conic','Hover'],
  prompt:`Crea un botón "líquido" en CSS: al hover, su border-radius cambia (de pill a forma irregular), rota ligeramente y un ::before con conic-gradient aparece detrás como relleno de color que "fluye".
Anima border-radius, transform y la opacidad/posición del gradiente con transición. Llamativo para un CTA principal sin recargar la página.`,
  code:`/* Liquid morph button */
.liquid {
  position: relative; border-radius: 999px; overflow: hidden;
  transition: border-radius .4s, transform .4s;
}
.liquid::before {
  content: ''; position: absolute; inset: -50%;
  background: conic-gradient(from 0deg, #7b5cff, #00e0c6, #ff5ca8, #7b5cff);
  opacity: 0; transition: opacity .4s; animation: spin 4s linear infinite;
}
.liquid:hover { border-radius: 14px 28px 14px 28px; transform: rotate(-2deg); }
.liquid:hover::before { opacity: 1; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes lqspin{to{transform:rotate(360deg)}}@keyframes lqmorph{0%,100%{border-radius:999px;transform:rotate(0)}50%{border-radius:14px 28px 14px 28px;transform:rotate(-2deg)}}</style><div style="position:relative;overflow:hidden;animation:lqmorph 3s ease-in-out infinite"><div style="position:absolute;inset:-50%;background:conic-gradient(from 0deg,#7b5cff,#00e0c6,#ff5ca8,#7b5cff);animation:lqspin 4s linear infinite;opacity:.85"></div><div style="position:relative;margin:2px;padding:13px 28px;background:#12121e;border-radius:inherit;color:#fff;font-weight:700">Liquid</div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
