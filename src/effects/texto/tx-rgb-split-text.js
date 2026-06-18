/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-rgb-split-text', title:'RGB Split Text', cat:'Texto',
  tags:['texto','rgb','split','chromatic','aberracion','glitch','cromatico'],
  desc:'Texto con separacion cromatica roja/cian que oscila como una aberracion de canal RGB.',
  meta:['text-shadow','CSS','Aberracion'],
  prompt:`Crea un efecto de "RGB split" / aberracion cromatica sobre un texto.
Tecnica: un mismo texto se duplica visualmente en dos capas de color, una roja y una cian, ligeramente desplazadas en X. Puedes lograrlo con dos text-shadow (uno rojo a la izquierda, uno cian a la derecha) sobre el texto principal, o con dos pseudo-elementos ::before/::after que copian el texto via content y usan mix-blend-mode:screen.
Animacion: un @keyframes que oscila la distancia de separacion entre 0 y ~5px (y opcionalmente un leve jitter vertical) para que el texto "vibre". Timing ~2s ease-in-out infinite alternate, o un patron de pasos para sensacion glitch.
Datos: texto en blanco sobre fondo oscuro; colores rojo #ff0040 y cian #00e0c6/#00eaff. Mantenlo legible: la base sigue siendo blanca nitida.`,
  code:`<div class="rgb-split" data-text="GLITCH">GLITCH</div>
<style>
.rgb-split{position:relative;color:#fff;font-weight:800;font-size:48px;letter-spacing:-.02em}
.rgb-split::before,.rgb-split::after{content:attr(data-text);position:absolute;inset:0;mix-blend-mode:screen}
.rgb-split::before{color:#ff0040;animation:rsR 2.2s ease-in-out infinite alternate}
.rgb-split::after{color:#00eaff;animation:rsC 2.2s ease-in-out infinite alternate}
@keyframes rsR{from{transform:translateX(0)}to{transform:translateX(-5px)}}
@keyframes rsC{from{transform:translateX(0)}to{transform:translateX(5px)}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.innerHTML='<style>'
      +'@keyframes txrsR{0%{transform:translate(0,0)}50%{transform:translate(-5px,1px)}100%{transform:translate(-2px,-1px)}}'
      +'@keyframes txrsC{0%{transform:translate(0,0)}50%{transform:translate(5px,-1px)}100%{transform:translate(2px,1px)}}'
      +'.txrs{position:relative;color:#fff;font-weight:800;font-size:42px;letter-spacing:-.02em}'
      +'.txrs::before,.txrs::after{content:attr(data-text);position:absolute;inset:0;mix-blend-mode:screen}'
      +'.txrs::before{color:#ff0040;animation:txrsR 2.2s ease-in-out infinite alternate}'
      +'.txrs::after{color:#00eaff;animation:txrsC 2.2s ease-in-out infinite alternate}'
      +'</style>'
      +'<div style="height:100%;display:grid;place-items:center"><div class="txrs" data-text="GLITCH">GLITCH</div></div>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
