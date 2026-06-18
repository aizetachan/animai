/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-pixel-art-shadow', title:'Pixel Art', cat:'CSS Art',
  tags:['css art','pixel art','box-shadow','sprite','retro','8bit','0 js'],
  desc:'Sprite retro de un fantasma dibujado pixel a pixel con box-shadow múltiple, que flota y parpadea en bucle.',
  meta:['box-shadow','pixel','0 JS'],
  prompt:`Dibuja un sprite de pixel art usando UN div pequeño (1 píxel base) y un box-shadow con muchas sombras, cada una representando un píxel en su posición (xPx yPx color).
Escala cada píxel con la variable de tamaño (ej 8px) multiplicando los offsets.
Usa una paleta de pocos colores (acento #7b5cff para el cuerpo, #00e0c6 para detalles, blanco para ojos).
Anima con @keyframes: un leve flotar vertical (translateY) y un parpadeo de opacity para los ojos o todo el sprite. Sin imágenes ni JS.`,
  code:`.pixel {
  width: 8px; height: 8px; margin: 40px auto;
  /* cada sombra = un píxel (mapa simplificado de un fantasma) */
  box-shadow:
    16px 0 #7b5cff, 24px 0 #7b5cff, 32px 0 #7b5cff,
    8px 8px #7b5cff, 16px 8px #fff, 24px 8px #7b5cff, 32px 8px #fff, 40px 8px #7b5cff,
    8px 16px #7b5cff, 16px 16px #00e0c6, 24px 16px #7b5cff, 32px 16px #00e0c6, 40px 16px #7b5cff,
    8px 24px #7b5cff, 16px 24px #7b5cff, 24px 24px #7b5cff, 32px 24px #7b5cff, 40px 24px #7b5cff,
    8px 32px #7b5cff, 24px 32px #7b5cff, 40px 32px #7b5cff;
  animation: artPxFloat 1.6s ease-in-out infinite alternate;
}
@keyframes artPxFloat { from { transform: translateY(0) } to { transform: translateY(-8px) } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes artPxFloat{from{transform:translateY(0)}to{transform:translateY(-8px)}}@keyframes artPxBlink{0%,90%,100%{opacity:1}95%{opacity:.35}}</style>'+
      '<div style="position:relative;width:64px;height:64px"><div style="position:absolute;left:0;top:0;width:8px;height:8px;animation:artPxFloat 1.6s ease-in-out infinite alternate,artPxBlink 3.2s steps(1) infinite;box-shadow:16px 0 #7b5cff,24px 0 #7b5cff,32px 0 #7b5cff,8px 8px #7b5cff,16px 8px #fff,24px 8px #7b5cff,32px 8px #fff,40px 8px #7b5cff,8px 16px #7b5cff,16px 16px #00e0c6,24px 16px #7b5cff,32px 16px #00e0c6,40px 16px #7b5cff,8px 24px #7b5cff,16px 24px #7b5cff,24px 24px #7b5cff,32px 24px #7b5cff,40px 24px #7b5cff,8px 32px #7b5cff,24px 32px #7b5cff,40px 32px #7b5cff"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
