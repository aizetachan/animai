/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-check-cross', title:'Check / Cross', cat:'Micro-interacciones',
  tags:['check','cross','tick','exito','error','toggle','micro'],
  desc:'Icono circular que muta entre un check de éxito y una cruz de error alternando en bucle.',
  meta:['svg','stroke-dashoffset','CSS+JS'],
  prompt:`Crea un indicador de estado que alterna entre check (éxito) y cruz (error).
Elementos: un círculo (SVG circle) y dentro dos paths: uno con forma de check y otro con forma de X. Usa stroke con stroke-dasharray/stroke-dashoffset para poder dibujarlos.
Técnica: dos estados con clase .ok y .err en el contenedor. En .ok el círculo y el check se dibujan (dashoffset → 0, color verde/acento) y la X queda oculta; en .err se dibuja la X y el círculo (color rojo) y el check oculto. Anima dashoffset con transition.
Demo: con un timer alterna las clases .ok/.err cada ~1.4s para ver el ciclo de mutación.`,
  code:`<svg class="cc" viewBox="0 0 52 52" width="80">
  <circle class="c" cx="26" cy="26" r="24" fill="none" stroke-width="3"/>
  <path class="check" fill="none" stroke-width="4" d="M14 27 l8 8 l16 -16"/>
  <path class="cross" fill="none" stroke-width="4" d="M17 17 l18 18 M35 17 l-18 18"/>
</svg>
<style>
.cc circle,.cc path{stroke-linecap:round;stroke-linejoin:round}
.cc .c{stroke-dasharray:151;stroke-dashoffset:151;transition:stroke-dashoffset .5s,stroke .3s}
.cc .check,.cc .cross{stroke-dasharray:60;stroke-dashoffset:60;transition:stroke-dashoffset .4s .3s}
.cc.ok .c{stroke-dashoffset:0;stroke:#00e0c6}
.cc.ok .check{stroke:#00e0c6;stroke-dashoffset:0}
.cc.err .c{stroke-dashoffset:0;stroke:#ff5d6c}
.cc.err .cross{stroke:#ff5d6c;stroke-dashoffset:0}
</style>
<script>
const cc=document.querySelector('.cc');let ok=true;
setInterval(()=>{cc.classList.remove('ok','err');void cc.offsetWidth;cc.classList.add(ok?'ok':'err');ok=!ok;},1400);
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.micc circle,.micc path{stroke-linecap:round;stroke-linejoin:round}'
      +'.micc .c{stroke-dasharray:151;stroke-dashoffset:151;transition:stroke-dashoffset .5s,stroke .3s}'
      +'.micc .check,.micc .cross{stroke-dasharray:60;stroke-dashoffset:60;transition:stroke-dashoffset .4s .3s}'
      +'.micc.ok .c{stroke-dashoffset:0;stroke:#00e0c6}'
      +'.micc.ok .check{stroke:#00e0c6;stroke-dashoffset:0}'
      +'.micc.err .c{stroke-dashoffset:0;stroke:#ff5d6c}'
      +'.micc.err .cross{stroke:#ff5d6c;stroke-dashoffset:0}'
      +'</style>'
      +'<svg class="micc" viewBox="0 0 52 52" width="92">'
      +'<circle class="c" cx="26" cy="26" r="24" fill="none" stroke-width="3"/>'
      +'<path class="check" fill="none" stroke-width="4" d="M14 27 l8 8 l16 -16"/>'
      +'<path class="cross" fill="none" stroke-width="4" d="M17 17 l18 18 M35 17 l-18 18"/>'
      +'</svg>';
    el.appendChild(s);
    const cc=s.querySelector('.micc');
    let ok=true;
    const tick=()=>{cc.classList.remove('ok','err');void cc.getBBox;cc.classList.add(ok?'ok':'err');ok=!ok;};
    tick();
    const t=setInterval(tick,1400);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
