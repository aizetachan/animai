/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-head-shake', title:'Head Shake', cat:'CSS Moderno',
  tags:['css','head-shake','shake','negacion','sacudida','rotateY','0 js'],
  desc:'Sacudida horizontal de cabeza tipo negacion, combinando translateX con un leve rotateY.',
  meta:['transform','perspective','0 JS'],
  prompt:`Crea un efecto "head shake" (negacion con la cabeza) solo con CSS.
Anima transform combinando translateX en pixeles con rotateY en grados en varios puntos clave: 0% sin transform, 6.5% translateX(-6px) rotateY(-9deg), 18.5% translateX(5px) rotateY(7deg), 31.5% translateX(-3px) rotateY(-5deg), 43.5% translateX(2px) rotateY(3deg), 50% y 100% sin transform.
El contenedor debe tener perspective para que el rotateY se note. Duracion ~1.4s, ease-in-out, infinite. Sin JS.`,
  code:`.head-shake-wrap { perspective: 400px; }
.head-shake {
  animation: am-head-shake 1.4s ease-in-out infinite;
}
@keyframes am-head-shake {
  0%    { transform: translateX(0); }
  6.5%  { transform: translateX(-6px) rotateY(-9deg); }
  18.5% { transform: translateX(5px) rotateY(7deg); }
  31.5% { transform: translateX(-3px) rotateY(-5deg); }
  43.5% { transform: translateX(2px) rotateY(3deg); }
  50%   { transform: translateX(0); }
  100%  { transform: translateX(0); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;perspective:400px';
    s.innerHTML='<style>@keyframes amHeadShake{0%{transform:translateX(0)}6.5%{transform:translateX(-6px) rotateY(-9deg)}18.5%{transform:translateX(5px) rotateY(7deg)}31.5%{transform:translateX(-3px) rotateY(-5deg)}43.5%{transform:translateX(2px) rotateY(3deg)}50%{transform:translateX(0)}100%{transform:translateX(0)}}</style><div style="width:80px;height:80px;border-radius:22px;background:linear-gradient(135deg,#7b5cff,#00e0c6);display:grid;place-items:center;font-size:38px;box-shadow:0 8px 22px rgba(0,224,198,.35);animation:amHeadShake 1.4s ease-in-out infinite">🙄</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
