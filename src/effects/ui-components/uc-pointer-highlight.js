/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-pointer-highlight', title:'Pointer Highlight', cat:'UI Components',
  tags:['pointer','highlight','resaltar','recuadro','box','cursor','aceternity'],
  desc:'Un recuadro animado enmarca una palabra mientras un puntero la señala, como un destacado en vivo.',
  meta:['Aceternity UI','SVG rect','transform'],
  prompt:`Recrea el Pointer Highlight de Aceternity: una palabra dentro de una frase queda enmarcada por un recuadro que se dibuja con animación, y un cursor/puntero aparece en la esquina, como si alguien resaltara la palabra.
Elementos: un texto con una palabra clave envuelta en un span relativo; un borde (rect SVG o div con border) que enmarca la palabra; un icono de puntero (flecha) que se desliza hasta la esquina del recuadro.
Técnica: el recuadro aparece animando su escala/clip o el stroke-dashoffset de un rect SVG para "dibujar" el contorno. El puntero entra con un translate desde fuera y se posa en la esquina inferior derecha. En auto-demo, ejecuta el ciclo (entrar puntero → dibujar marco → mantener → desvanecer) en bucle.
Color del marco #7b5cff, puntero blanco con sombra, acento #00e0c6 en relleno tenue. Timings: dibujado ~0.6s, hold ~1.4s, salida ~0.4s.`,
  code:`<p>The best <span class="ph">framework</span> ever</p>
<style>
.ph{position:relative;display:inline-block;padding:2px 4px}
.ph::before{content:"";position:absolute;inset:0;border:2px solid #7b5cff;border-radius:6px;background:rgba(123,92,255,.12);transform:scale(.8);opacity:0;animation:phBox .6s ease forwards}
.ph .ptr{position:absolute;right:-14px;bottom:-14px;width:16px;height:16px;color:#fff;animation:phPtr .6s ease forwards}
@keyframes phBox{to{transform:scale(1);opacity:1}}
@keyframes phPtr{from{transform:translate(20px,20px);opacity:0}to{transform:translate(0,0);opacity:1}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0a0a16';
    s.innerHTML='<style>'
      +'@keyframes ucPhBox{0%{transform:scale(.7);opacity:0}30%{opacity:1}55%{transform:scale(1);opacity:1}85%{transform:scale(1);opacity:1}100%{transform:scale(1.04);opacity:0}}'
      +'@keyframes ucPhPtr{0%{transform:translate(26px,26px);opacity:0}30%{transform:translate(0,0);opacity:1}85%{transform:translate(0,0);opacity:1}100%{transform:translate(8px,8px);opacity:0}}'
      +'.ucph{color:#cfd2e6;font:600 22px system-ui,sans-serif;text-align:center;line-height:1.5}'
      +'.ucph .w{position:relative;display:inline-block;padding:2px 6px;color:#fff}'
      +'.ucph .w .box{position:absolute;inset:0;border:2px solid #7b5cff;border-radius:7px;background:rgba(123,92,255,.14);box-shadow:0 0 14px rgba(0,224,198,.25);animation:ucPhBox 2.6s ease-in-out infinite}'
      +'.ucph .w .ptr{position:absolute;right:-10px;bottom:-12px;animation:ucPhPtr 2.6s ease-in-out infinite}'
      +'</style>'
      +'<p class="ucph">The best <span class="w">framework<span class="box"></span>'
      +'<svg class="ptr" width="18" height="18" viewBox="0 0 24 24" fill="#fff" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))"><path d="M4 2 L20 11 L13 13 L11 20 Z"/></svg>'
      +'</span> ever</p>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
