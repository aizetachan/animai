/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-jello', title:'Jello', cat:'CSS Moderno',
  tags:['css','jello','wobble','skew','attention','gelatina','animate.css'],
  desc:'Attention seeker tipo gelatina: la caja se deforma con skewX/skewY oscilantes hasta estabilizarse.',
  meta:['transform skew','0 JS'],
  prompt:`Crea un efecto "Jello" (gelatina) sobre una caja o texto, estilo Animate.css.
Aplica un @keyframes que va deformando el elemento con transform combinando skewX y skewY que oscilan en magnitud decreciente y signo alternado.
Pasos sugeridos: 0% y 11.1% sin deformar; luego 22.2% skewX/Y -12.5deg; 33.3% +6.25deg; 44.4% -3.125deg; 55.5% +1.5625deg; 66.6% -0.78deg; 77.7% +0.39deg; 88.8% -0.195deg; 100% reposo.
Usa transform-origin:center y una duración de ~1s con un pequeño retardo entre repeticiones (infinite). Sin JS.`,
  code:`/* Jello attention seeker (Animate.css style) */
.jello {
  animation: am-jello 1s infinite both;
  transform-origin: center;
}
@keyframes am-jello {
  0%, 11.1%, 100% { transform: none; }
  22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); }
  33.3% { transform: skewX(6.25deg) skewY(6.25deg); }
  44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); }
  55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); }
  66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); }
  77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); }
  88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amJello{0%,11.1%,100%{transform:none}22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{transform:skewX(6.25deg) skewY(6.25deg)}44.4%{transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}}</style><div style="font:800 30px/1 system-ui,sans-serif;color:#fff;padding:16px 22px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);transform-origin:center;animation:amJello 1.6s 0.3s infinite both">Jello</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
