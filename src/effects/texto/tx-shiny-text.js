/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-shiny-text', title:'Shiny Text', cat:'Texto',
  tags:['texto','text','shiny','shimmer','brillo','gradient','loop'],
  desc:'Un barrido de brillo recorre el texto en bucle, como un reflejo metálico que cruza las letras.',
  meta:['background-clip','gradient','loop'],
  prompt:`Crea un efecto de texto brillante "shiny text" con un barrido (shimmer) infinito.
Elemento: un titular con color base tenue.
Técnica: aplica un linear-gradient como background donde una banda clara (highlight) está rodeada por el color base; recorta el fondo al texto con background-clip:text y -webkit-text-fill-color:transparent.
Usa background-size mayor que el texto (p.ej. 200%) y anima background-position de un extremo a otro con @keyframes para que la banda brillante cruce las letras.
Keyframes: 0% { background-position: 100% center; } 100% { background-position: -100% center; }
Timings: duración ~3s, linear, infinite. La banda clara debe ser estrecha respecto al gradiente para que el brillo sea un destello, no un degradado uniforme.`,
  code:`<h1 class="shiny">SHINY TEXT</h1>
<style>
.shiny{
  color:#5a5a6e;
  background:linear-gradient(120deg,#5a5a6e 40%,#fff 50%,#5a5a6e 60%);
  background-size:200% 100%;
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:shinySweep 3s linear infinite;
}
@keyframes shinySweep{
  0%{background-position:100% center}
  100%{background-position:-100% center}
}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0b0b12';
    s.innerHTML='<style>'
      +'@keyframes txshSweep{0%{background-position:100% center}100%{background-position:-100% center}}'
      +'.txsh{font:800 28px/1 system-ui,sans-serif;letter-spacing:.06em;white-space:nowrap;color:#4a4a5e;'
      +'background:linear-gradient(120deg,#4a4a5e 38%,#00e0c6 47%,#fff 50%,#7b5cff 53%,#4a4a5e 62%);'
      +'background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;'
      +'animation:txshSweep 3s linear infinite}'
      +'</style>'
      +'<h1 class="txsh">SHINY TEXT</h1>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
