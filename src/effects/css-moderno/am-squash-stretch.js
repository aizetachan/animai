/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-squash-stretch', title:'Squash & Stretch', cat:'CSS Moderno',
  tags:['css','squash','stretch','rebote','bounce','bola','animacion'],
  desc:'Squash y stretch clásico de animación: una bola que cae, se aplasta al tocar el suelo y se estira al saltar, en bucle.',
  meta:['transform scaleXY','0 JS'],
  prompt:`Crea el principio de animación clásico "squash & stretch" solo con CSS, en bucle infinito.
Una bola (div redondo) que sube y baja con translateY. Cuando toca el "suelo" debe aplastarse (scaleX>1, scaleY<1, ej: scale(1.3,0.7)) y al elevarse estirarse verticalmente (scaleX<1, scaleY>1, ej: scale(0.8,1.2)). Pon transform-origin:bottom para que el aplastamiento ocurra desde la base.
Define @keyframes con los tramos: arriba estirada, bajando neutra, suelo aplastada, subiendo estirada. animation: 0.9s ease-in-out infinite. Sin JS.`,
  code:`.ball {
  width: 60px; height: 60px; border-radius: 50%;
  background: #7b5cff; transform-origin: bottom;
  animation: ss-bounce 0.9s ease-in-out infinite;
}
@keyframes ss-bounce {
  0%   { transform: translateY(-70px) scale(0.85, 1.18); }
  45%  { transform: translateY(0)     scale(1, 1); }
  55%  { transform: translateY(0)     scale(1.35, 0.65); }
  65%  { transform: translateY(0)     scale(1, 1); }
  100% { transform: translateY(-70px) scale(0.85, 1.18); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:end center;padding-bottom:34px';
    s.innerHTML='<style>@keyframes amSquash{0%{transform:translateY(-72px) scale(.85,1.18)}45%{transform:translateY(0) scale(1,1)}55%{transform:translateY(0) scale(1.35,.65)}65%{transform:translateY(0) scale(1,1)}100%{transform:translateY(-72px) scale(.85,1.18)}}</style><div style="width:58px;height:58px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#00e0c6,#7b5cff);transform-origin:bottom;animation:amSquash .9s ease-in-out infinite;box-shadow:0 6px 22px rgba(123,92,255,.45)"></div>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
