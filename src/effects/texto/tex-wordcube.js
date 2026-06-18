/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-wordcube', title:'3D Words Cube', cat:'Texto',
  tags:['cube','cubo','3d','palabras','rotar','caras','transform'],
  desc:'Las palabras rotan en las caras de un cubo 3D. Flip de claims con volumen real.',
  meta:['transform 3d','rotateX','Cubo'],
  prompt:`Crea un cubo 3D de texto donde cada cara muestra una palabra y el cubo rota para revelar la siguiente (rotateX en pasos de 90°).
Usa transform-style:preserve-3d en el contenedor y posiciona cada cara con rotateX + translateZ. Anima la rotación del cubo en bucle o por intervalo.
Para mostrar una lista de propuestas de valor con un giro físico real (no un simple fade).`,
  code:`/* Cubo 3D de palabras (preserve-3d) */
.cube { transform-style: preserve-3d; animation: roll 6s steps(1) infinite; }
.face { position: absolute; backface-visibility: hidden; }
.face:nth-child(1) { transform: rotateX(0deg)   translateZ(30px); }
.face:nth-child(2) { transform: rotateX(90deg)  translateZ(30px); }
.face:nth-child(3) { transform: rotateX(180deg) translateZ(30px); }
.face:nth-child(4) { transform: rotateX(270deg) translateZ(30px); }
@keyframes roll { 25%{transform:rotateX(-90deg)} 50%{transform:rotateX(-180deg)} 75%{transform:rotateX(-270deg)} 100%{transform:rotateX(-360deg)} }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;perspective:600px';
    s.innerHTML='<style>@keyframes cuberoll{0%,12%{transform:rotateX(0)}25%,37%{transform:rotateX(-90deg)}50%,62%{transform:rotateX(-180deg)}75%,87%{transform:rotateX(-270deg)}100%{transform:rotateX(-360deg)}}.cubf{position:absolute;width:160px;height:50px;display:grid;place-items:center;font-size:22px;font-weight:800;color:#fff;backface-visibility:hidden}</style><div style="position:relative;width:160px;height:50px;transform-style:preserve-3d;animation:cuberoll 6s ease-in-out infinite"><div class="cubf" style="transform:rotateX(0) translateZ(25px);color:#7b5cff">Diseño</div><div class="cubf" style="transform:rotateX(90deg) translateZ(25px);color:#00e0c6">Código</div><div class="cubf" style="transform:rotateX(180deg) translateZ(25px);color:#ff5ca8">Motion</div><div class="cubf" style="transform:rotateX(270deg) translateZ(25px);color:#ffd166">AI</div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
