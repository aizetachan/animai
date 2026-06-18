/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-square-flip', title:'Square Flip', cat:'Loaders',
  tags:['css','loader','flip','cuadrado','square','3d','rotate','0 js'],
  desc:'Cuadrado que voltea primero en rotateX y luego en rotateY en un bucle 3D continuo.',
  meta:['transform 3D','0 JS'],
  prompt:`Crea un loader de cuadrado que se voltea en 3D solo con CSS.
El contenedor padre lleva perspective (ej. 200px). Dentro, un div cuadrado con un gradiente de color y transform-style:preserve-3d.
Anímalo con @keyframes que en la primera mitad haga rotateX(180deg) y en la segunda mitad rotateY(180deg) (y vuelva), encadenado para que parezca que gira sobre dos ejes alternos: 0% sin rotar, 25% rotateX(180deg), 50% rotateX(180deg) rotateY(180deg), 75% rotateY(180deg), 100% reset. Duración ~1.8s ease-in-out infinite. Sin JS.`,
  code:`.flip-wrap { perspective: 200px; }
.flip-wrap .square {
  width: 44px; height: 44px; border-radius: 8px;
  background: linear-gradient(135deg, #7b5cff, #00e0c6);
  transform-style: preserve-3d;
  animation: sqf-flip 1.8s ease-in-out infinite;
}
@keyframes sqf-flip {
  0%   { transform: rotateX(0) rotateY(0); }
  25%  { transform: rotateX(180deg) rotateY(0); }
  50%  { transform: rotateX(180deg) rotateY(180deg); }
  75%  { transform: rotateX(0) rotateY(180deg); }
  100% { transform: rotateX(0) rotateY(0); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes ldSqf{0%{transform:rotateX(0) rotateY(0)}25%{transform:rotateX(180deg) rotateY(0)}50%{transform:rotateX(180deg) rotateY(180deg)}75%{transform:rotateX(0) rotateY(180deg)}100%{transform:rotateX(0) rotateY(0)}}'
      +'</style>'
      +'<div style="perspective:220px"><div style="width:50px;height:50px;border-radius:9px;background:linear-gradient(135deg,#7b5cff,#00e0c6);transform-style:preserve-3d;animation:ldSqf 1.8s ease-in-out infinite"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
