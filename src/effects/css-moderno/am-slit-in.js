/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-slit-in', title:'3D Slit In', cat:'CSS Moderno',
  tags:['css','3d','perspective','rotatey','rendija','revelado','slit'],
  desc:'Revelado 3D tipo rendija de papel: el elemento rota en Y desde una hendidura y se abre hacia el frente.',
  meta:['perspective','rotateY','0 JS'],
  prompt:`Crea una animación de entrada 3D "Slit In" (rendija).
El contenedor padre tiene perspective:800px. El hijo se anima con @keyframes:
0% transform translateZ(-700px) rotateY(90deg) opacity 0;
54% transform translateZ(-160px) rotateY(87deg) opacity 1 (la rendija se asoma);
100% transform translateZ(0) rotateY(0) opacity 1.
Usa transform-style:preserve-3d. Duracion ~0.7s ease-out. Solo CSS, sin JS.`,
  code:`/* 3D Slit In - revelado tipo rendija */
.slit-wrap { perspective: 800px; }
.slit {
  transform-style: preserve-3d;
  animation: am-slit 0.7s ease-out both;
}
@keyframes am-slit {
  0%   { transform: translateZ(-700px) rotateY(90deg); opacity: 0; }
  54%  { transform: translateZ(-160px) rotateY(87deg); opacity: 1; }
  100% { transform: translateZ(0) rotateY(0deg); opacity: 1; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;perspective:800px';
    s.innerHTML='<style>@keyframes amSlit{0%{transform:translateZ(-700px) rotateY(90deg);opacity:0}54%{transform:translateZ(-160px) rotateY(87deg);opacity:1}100%{transform:translateZ(0) rotateY(0);opacity:1}}</style><div id="amSlitCard" style="width:120px;height:78px;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#00e0c6);box-shadow:0 10px 30px rgba(0,224,198,.35);transform-style:preserve-3d"></div>';
    el.appendChild(s);
    const card=s.querySelector('#amSlitCard');
    const play=()=>{card.style.animation='none';void card.offsetWidth;card.style.animation='amSlit .7s ease-out both';};
    play();
    const t=setInterval(play,1800);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
