/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-wobble', title:'Wobble', cat:'CSS Moderno',
  tags:['css','wobble','bamboleo','wiggle','rotate','translate','0 js'],
  desc:'Bamboleo lateral con rotación: el elemento se balancea de lado a lado combinando translateX y giro.',
  meta:['transform','keyframes','0 JS'],
  prompt:`Crea un efecto "wobble" (bamboleo) solo con CSS.
Un elemento al que aplicas @keyframes que combinan translateX en porcentaje con rotate en grados, alternando signos en varios puntos clave: 0% sin transform, 15% translateX(-25%) rotate(-5deg), 30% translateX(20%) rotate(3deg), 45% translateX(-15%) rotate(-3deg), 60% translateX(10%) rotate(2deg), 75% translateX(-5%) rotate(-1deg), 100% sin transform.
Duración ~1s, animation infinite con una pequeña pausa entre ciclos. Sin JS.`,
  code:`.wobble {
  animation: am-wobble 1.4s ease-in-out infinite;
}
@keyframes am-wobble {
  0%   { transform: none; }
  15%  { transform: translateX(-25%) rotate(-5deg); }
  30%  { transform: translateX(20%) rotate(3deg); }
  45%  { transform: translateX(-15%) rotate(-3deg); }
  60%  { transform: translateX(10%) rotate(2deg); }
  75%  { transform: translateX(-5%) rotate(-1deg); }
  100% { transform: none; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amWobble{0%{transform:none}15%{transform:translateX(-25%) rotate(-5deg)}30%{transform:translateX(20%) rotate(3deg)}45%{transform:translateX(-15%) rotate(-3deg)}60%{transform:translateX(10%) rotate(2deg)}75%{transform:translateX(-5%) rotate(-1deg)}100%{transform:none}}</style><div style="width:84px;height:84px;border-radius:18px;background:linear-gradient(135deg,#7b5cff,#00e0c6);box-shadow:0 8px 24px rgba(123,92,255,.4);animation:amWobble 1.4s ease-in-out infinite"></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
