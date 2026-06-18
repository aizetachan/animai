/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-blocks-shuffle', title:'Blocks Shuffle', cat:'Loaders',
  tags:['css','loader','blocks','cuadrados','shuffle','intercambio','carga'],
  desc:'Cuatro cuadrados que intercambian posiciones girando en bucle, formando una rejilla 2x2 animada.',
  meta:['transform','0 JS'],
  prompt:`Crea un loader de cuatro cuadrados que intercambian posiciones en bucle.
Coloca un contenedor con position:relative de unos 50x50px y dentro cuatro divs cuadrados de ~22px, posicionados absolutamente en las cuatro esquinas de una rejilla 2x2.
Cada cuadrado tiene su propio @keyframes que lo desplaza con transform:translate por el perimetro: esquina superior-izquierda -> superior-derecha -> inferior-derecha -> inferior-izquierda y vuelta, de forma que parecen rotar en circulo intercambiando lugares.
Duracion 2s, easing ease-in-out, infinite. Da a cada cuadrado un delay/fase distinta del mismo keyframe (o keyframes desfasados) para que los cuatro se muevan en armonia. Solo CSS, sin JS.`,
  code:`.bs-box { position: relative; width: 50px; height: 50px; }
.bs-box span {
  position: absolute; width: 22px; height: 22px; border-radius: 4px;
  background: #7b5cff;
  animation: bs-move 2s ease-in-out infinite;
}
.bs-box span:nth-child(1){ top:0; left:0;  animation-delay: 0s; }
.bs-box span:nth-child(2){ top:0; left:28px; animation-delay:-0.5s; background:#00e0c6; }
.bs-box span:nth-child(3){ top:28px; left:28px; animation-delay:-1s; }
.bs-box span:nth-child(4){ top:28px; left:0; animation-delay:-1.5s; background:#00e0c6; }
@keyframes bs-move {
  0%   { transform: translate(0,0); }
  25%  { transform: translate(28px,0); }
  50%  { transform: translate(28px,28px); }
  75%  { transform: translate(0,28px); }
  100% { transform: translate(0,0); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'+
      '.ldBsBox{position:relative;width:54px;height:54px}'+
      '.ldBsBox span{position:absolute;width:24px;height:24px;border-radius:5px;animation:ldBsMove 2s ease-in-out infinite;box-shadow:0 0 12px currentColor}'+
      '.ldBsBox span:nth-child(1){top:0;left:0;color:#7b5cff;background:#7b5cff;animation-delay:0s}'+
      '.ldBsBox span:nth-child(2){top:0;left:30px;color:#00e0c6;background:#00e0c6;animation-delay:-.5s}'+
      '.ldBsBox span:nth-child(3){top:30px;left:30px;color:#7b5cff;background:#7b5cff;animation-delay:-1s}'+
      '.ldBsBox span:nth-child(4){top:30px;left:0;color:#00e0c6;background:#00e0c6;animation-delay:-1.5s}'+
      '@keyframes ldBsMove{0%{transform:translate(0,0)}25%{transform:translate(30px,0)}50%{transform:translate(30px,30px)}75%{transform:translate(0,30px)}100%{transform:translate(0,0)}}'+
      '</style>'+
      '<div class="ldBsBox"><span></span><span></span><span></span><span></span></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
