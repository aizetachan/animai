/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-neon', title:'Neon Glow Text', cat:'CSS Moderno',
  tags:['neon','glow','texto','letrero','css','brillo','noche'],
  desc:'Texto con resplandor de neón parpadeante. El letrero luminoso clásico, solo con text-shadow.',
  meta:['text-shadow','flicker','Neón'],
  prompt:`Crea un letrero de neón en CSS: texto con múltiples text-shadow del mismo color a distintos radios (de 5px a 40px) para el halo, sobre fondo oscuro.
Añade un @keyframes "flicker" que varíe la opacidad/intensidad aleatoriamente en algunos instantes para el parpadeo realista de un tubo de neón.
Para marcas nocturnas, gaming, bares, retro.`,
  code:`/* Neon glow text */
.neon {
  color: #fff;
  text-shadow:
    0 0 5px #00e0c6, 0 0 10px #00e0c6, 0 0 20px #00e0c6,
    0 0 40px #00a892, 0 0 80px #00a892;
  animation: flicker 3s infinite;
}
@keyframes flicker {
  0%,19%,21%,100% { opacity: 1; }
  20% { opacity: 0.4; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#07070d';
    s.innerHTML='<style>@keyframes flk{0%,18%,22%,100%{opacity:1}20%{opacity:.4}70%{opacity:.85}}</style><span style="font-size:32px;font-weight:800;color:#fff;text-shadow:0 0 5px #00e0c6,0 0 10px #00e0c6,0 0 22px #00e0c6,0 0 40px #00a892,0 0 70px #00a892;animation:flk 3s infinite">NEON</span>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
