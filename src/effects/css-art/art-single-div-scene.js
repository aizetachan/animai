/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-single-div-scene', title:'Single-Div Scene', cat:'CSS Art',
  tags:['css art','single div','box-shadow','gradient','paisaje','scene','0 js'],
  desc:'Mini paisaje nocturno dibujado con un solo div usando múltiples gradients y box-shadow, con luna y estrellas que titilan.',
  meta:['box-shadow','gradient','0 JS'],
  prompt:`Crea una escena de paisaje usando UN SOLO div.
El background es un linear-gradient vertical de cielo nocturno (azul oscuro a violeta) más una franja inferior que simula el suelo/colinas con radial-gradient.
La luna y las estrellas se dibujan con box-shadow múltiple: varias sombras de distinto offset y color claro sobre un pseudo-elemento de 2px.
Anima la luminosidad con @keyframes que cambian opacity/box-shadow para que las estrellas titilen suavemente en bucle infinito. Sin imágenes, sin JS.`,
  code:`.scene {
  width: 220px; height: 150px; border-radius: 12px;
  background:
    radial-gradient(circle at 75% 28%, #fff8d6 0 9px, #0000 10px),
    linear-gradient(#0b0b2a 0%, #2a1450 55%, #4a1d63 100%);
  position: relative; overflow: hidden;
}
.scene::before {
  content:''; position:absolute; width:2px; height:2px; left:30px; top:30px;
  border-radius:50%; background:#fff;
  box-shadow: 20px 10px #fff, 60px 40px #cfe, 120px 20px #fff, 150px 60px #aef,
              40px 70px #fff, 180px 35px #fff;
  animation: artScnTwinkle 2.4s ease-in-out infinite alternate;
}
.scene::after {
  content:''; position:absolute; bottom:0; left:0; right:0; height:46px;
  background: radial-gradient(120px 60px at 30% 110%, #16203a 60%, #0000 62%),
              radial-gradient(140px 70px at 80% 120%, #101830 60%, #0000 62%);
}
@keyframes artScnTwinkle { from { opacity:.45 } to { opacity:1 } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes artScnTwinkle{from{opacity:.4}to{opacity:1}}</style>'+
      '<div style="position:relative;width:220px;height:150px;border-radius:12px;overflow:hidden;background:radial-gradient(circle at 75% 28%,#fff8d6 0 9px,#0000 10px),linear-gradient(#0b0b2a 0%,#2a1450 55%,#4a1d63 100%)">'+
      '<div style="position:absolute;width:2px;height:2px;left:30px;top:30px;border-radius:50%;background:#fff;box-shadow:20px 10px #fff,60px 40px #00e0c6,120px 20px #fff,150px 60px #7b5cff,40px 70px #fff,180px 35px #fff;animation:artScnTwinkle 2.4s ease-in-out infinite alternate"></div>'+
      '<div style="position:absolute;bottom:0;left:0;right:0;height:46px;background:radial-gradient(120px 60px at 30% 110%,#16203a 60%,#0000 62%),radial-gradient(140px 70px at 80% 120%,#101830 60%,#0000 62%)"></div>'+
      '</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
