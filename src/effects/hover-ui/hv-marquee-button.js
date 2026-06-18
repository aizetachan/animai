/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-marquee-button', title:'Marquee Button', cat:'Hover & UI',
  tags:['button','botón','marquee','scroll','texto','loop','hover'],
  desc:'Botón cuyo texto se convierte en un marquee horizontal infinito al pasar el cursor.',
  meta:['transform','overflow','CSS+JS'],
  prompt:`Crea un botón cuyo texto, al hacer hover, se transforma en un marquee (cinta) horizontal en bucle.
Elementos: un .btn con overflow:hidden y dentro un .track que contiene el texto repetido 2 veces seguidas (para loop sin saltos).
Técnica: en reposo el texto está centrado y quieto. Al hover, anima el .track con @keyframes que va de translateX(0) a translateX(-50%) en loop lineal infinito (como el contenido está duplicado, el reinicio es imperceptible). Añade/quita la animación con una clase .on.
Detalle: cambia el fondo a color de acento al hover. Timings: marquee ~5s linear infinite; transición de color ~250ms.`,
  code:`<button class="mbtn"><span class="track"><span>EXPLORAR&nbsp;•&nbsp;EXPLORAR&nbsp;•&nbsp;</span><span>EXPLORAR&nbsp;•&nbsp;EXPLORAR&nbsp;•&nbsp;</span></span></button>
<style>
.mbtn{overflow:hidden;border:0;border-radius:12px;padding:14px 0;width:180px;background:#1a1a2e;color:#fff;font-weight:800;cursor:pointer;transition:background .25s}
.mbtn:hover{background:#7b5cff}
.track{display:inline-flex;white-space:nowrap;width:max-content}
.mbtn:hover .track{animation:mbMar 5s linear infinite}
@keyframes mbMar{to{transform:translateX(-50%)}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.hvmb{overflow:hidden;border:0;border-radius:12px;padding:15px 0;width:185px;background:#1a1a2e;color:#fff;font-weight:800;letter-spacing:.5px;transition:background .25s}'
      +'.hvmb.hvmb-on{background:#7b5cff}'
      +'.hvmb .hvmb-track{display:inline-flex;white-space:nowrap;width:max-content}'
      +'.hvmb.hvmb-on .hvmb-track{animation:hvmbMar 5s linear infinite}'
      +'@keyframes hvmbMar{to{transform:translateX(-50%)}}'
      +'</style>'
      +'<div class="hvmb"><span class="hvmb-track"><span>EXPLORAR&nbsp;&bull;&nbsp;EXPLORAR&nbsp;&bull;&nbsp;</span><span>EXPLORAR&nbsp;&bull;&nbsp;EXPLORAR&nbsp;&bull;&nbsp;</span></span></div>';
    el.appendChild(s);
    const btn=s.querySelector('.hvmb');
    let on=false;
    const t=setInterval(()=>{on=!on;btn.classList.toggle('hvmb-on',on);},2200);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
