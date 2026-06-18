/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-dual-orbit', title:'Dual Orbit', cat:'Loaders',
  tags:['css','loader','orbit','orbita','dots','puntos','0 js'],
  desc:'Dos puntos que orbitan alrededor del centro en fase opuesta, como electrones girando.',
  meta:['transform-origin','0 JS'],
  prompt:`Crea un loader de dos puntos orbitando el mismo centro pero en fase opuesta.
Contenedor cuadrado relativo. Dentro, dos divs pequeños (puntos) posicionados absolute en el centro. Cada uno tiene transform-origin desplazado al centro del contenedor para que al rotar describa un círculo (truco: translate al borde y rotar el wrapper).
Mejor: dos wrappers absolutos centrados que rotan con @keyframes 360deg; dentro de cada wrapper un punto desplazado con translateY(-22px). El segundo wrapper arranca con animation-delay negativo de la mitad de la duración para ir en fase opuesta. Usa colores de acento y secundario. Duración ~1.1s linear infinite.`,
  code:`.do-wrap { width: 56px; aspect-ratio: 1; position: relative; }
.do-orbit {
  position: absolute; inset: 0;
  animation: do-spin 1.1s linear infinite;
}
.do-orbit:nth-child(2) { animation-delay: -0.55s; }
.do-dot {
  position: absolute; top: 0; left: 50%;
  width: 12px; height: 12px; border-radius: 50%;
  transform: translateX(-50%);
}
.do-orbit:nth-child(1) .do-dot { background: #7b5cff; }
.do-orbit:nth-child(2) .do-dot { background: #00e0c6; }
@keyframes do-spin { to { transform: rotate(360deg); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldDoSpin{to{transform:rotate(360deg)}}.ldDoWrap{width:56px;aspect-ratio:1;position:relative}.ldDoOrbit{position:absolute;inset:0;animation:ldDoSpin 1.1s linear infinite}.ldDoOrbit.b{animation-delay:-.55s}.ldDoDot{position:absolute;top:0;left:50%;width:12px;height:12px;border-radius:50%;transform:translateX(-50%)}.ldDoOrbit.a .ldDoDot{background:#7b5cff}.ldDoOrbit.b .ldDoDot{background:#00e0c6}</style><div class="ldDoWrap"><div class="ldDoOrbit a"><div class="ldDoDot"></div></div><div class="ldDoOrbit b"><div class="ldDoDot"></div></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
