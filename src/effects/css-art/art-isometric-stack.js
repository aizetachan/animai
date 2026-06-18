/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-isometric-stack', title:'Isometric Stack', cat:'CSS Art',
  tags:['css','isometric','isometrico','cubos','3d','stack','transform'],
  desc:'Cubos isométricos 3D que se apilan y pulsan con caras de distinto tono.',
  meta:['transform 3d','keyframes','CSS'],
  prompt:`Crea cubos isométricos en CSS 3D apilados. El contenedor lleva perspective y un rotateX/rotateZ fijo para la vista isométrica.
Cada cubo es un elemento con transform-style:preserve-3d que contiene 3 caras (top, left, right) construidas con divs posicionados y rotados (rotateX/rotateY/translateZ), cada cara con un tono distinto del color de acento para dar volumen.
Apila varios cubos con translateZ creciente y anímalos con @keyframes que varían su translateZ/escala con delays escalonados, dando un efecto de pulso/apilado en bucle. Sin JS.`,
  code:`.scene { perspective: 600px; }
.iso { transform-style: preserve-3d; transform: rotateX(60deg) rotateZ(45deg); }
.cube, .cube > i { position: absolute; width: 60px; height: 60px; transform-style: preserve-3d; }
.cube { animation: isPulse 2s ease-in-out infinite; }
.cube .top   { background:#9b82ff; transform: translateZ(30px); }
.cube .left  { background:#6a4fe0; transform: rotateY(-90deg) translateZ(30px); }
.cube .right { background:#4a37b0; transform: rotateX(90deg) translateZ(30px); }
@keyframes isPulse { 0%,100%{ transform: translateZ(0) } 50%{ transform: translateZ(24px) } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const cube=(z,delay)=>'<div class="isCube" style="--z:'+z+'px;animation-delay:'+delay+'s"><i class="t"></i><i class="l"></i><i class="r"></i></div>';
    s.innerHTML='<style>'
      +'@keyframes isPulse{0%,100%{transform:translateZ(var(--z))}50%{transform:translateZ(calc(var(--z) + 24px))}}'
      +'.isScene{perspective:700px;width:170px;height:170px;display:grid;place-items:center}'
      +'.isStack{transform-style:preserve-3d;transform:rotateX(58deg) rotateZ(45deg);position:relative;width:54px;height:54px}'
      +'.isCube{position:absolute;width:54px;height:54px;transform:translateZ(var(--z));transform-style:preserve-3d;animation:isPulse 2.2s ease-in-out infinite}'
      +'.isCube i{position:absolute;width:54px;height:54px;display:block;border:1px solid rgba(7,7,13,.45)}'
      +'.isCube .t{background:#9b82ff;transform:translateZ(27px)}'
      +'.isCube .l{background:#6a4fe0;transform:rotateY(-90deg) translateZ(27px);transform-origin:left}'
      +'.isCube .r{background:#3fbfb0;transform:rotateX(90deg) translateZ(-27px);transform-origin:bottom}'
      +'</style>'
      +'<div class="isScene"><div class="isStack">'
      +cube(0,0)+cube(56,.25)+cube(112,.5)
      +'</div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
