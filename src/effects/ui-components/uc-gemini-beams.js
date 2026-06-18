/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-gemini-beams', title:'Gemini Beams', cat:'UI Components',
  tags:['gemini','beams','svg','gradiente','haces','google','draw'],
  desc:'Haces SVG curvos con gradiente que se dibujan y fluyen desde un punto central, estilo Google Gemini.',
  meta:['SVG path','stroke-dash','Gradiente animado'],
  prompt:`Recrea los haces estilo Google Gemini: varias líneas SVG curvas (Bézier) que parten de un punto central y se abren en abanico, dibujándose con un trazo de gradiente que recorre cada path.
Técnica: para cada beam usa un <path> con d una curva cuadrática/cúbica. Aplica un trazo "fantasma" tenue de fondo y encima un trazo brillante con stroke-dasharray + stroke-dashoffset animado (un dash corto recorriendo el path) para simular el pulso de luz viajando. Usa varios linearGradient que mezclen #7b5cff y #00e0c6.
Animación: anima stroke-dashoffset en bucle (impulsos que recorren cada beam con desfases distintos) y un suave glow. Fondo oscuro.`,
  code:`// Estilo Google Gemini — haces SVG con gradiente que se dibujan
<svg viewBox="0 0 260 200">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#7b5cff"/>
      <stop offset="100%" stop-color="#00e0c6"/>
    </linearGradient>
  </defs>
  <path d="M130 180 C 90 120, 40 90, 20 40" stroke="url(#g1)"
        fill="none" stroke-width="2" stroke-linecap="round"
        stroke-dasharray="40 400" stroke-dashoffset="440"/>
</svg>
/* keyframes: stroke-dashoffset 440 -> 0 (impulso recorriendo el beam) */
@keyframes flow { to { stroke-dashoffset: 0; } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:radial-gradient(circle at 50% 100%,#15102e,#06060d)';
    const beams=[
      {d:'M130 195 C 110 130, 60 110, 24 38',  g:'gba'},
      {d:'M130 195 C 118 120, 88 80, 70 18',   g:'gbb'},
      {d:'M130 195 C 130 120, 130 70, 130 8',  g:'gba'},
      {d:'M130 195 C 142 120, 172 80, 190 18', g:'gbb'},
      {d:'M130 195 C 150 130, 200 110, 236 38',g:'gba'}
    ];
    const len=320;
    let paths='';
    beams.forEach((b,i)=>{
      paths+='<path d="'+b.d+'" stroke="#2a2540" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
      paths+='<path class="ugb-b ugb-b'+i+'" d="'+b.d+'" stroke="url(#'+b.g+')" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="46 '+len+'" stroke-dashoffset="'+(len+46)+'"/>';
    });
    s.innerHTML='<style>'
      +'@keyframes ugbFlow{0%{stroke-dashoffset:'+(len+46)+'}100%{stroke-dashoffset:0}}'
      +'@keyframes ugbCore{0%,100%{opacity:.5}50%{opacity:1}}'
      +'.ugb-svg{width:100%;height:100%;display:block;filter:drop-shadow(0 0 6px #7b5cff66)}'
      +'.ugb-b{animation:ugbFlow 2.6s linear infinite}'
      +'.ugb-b0{animation-delay:0s}.ugb-b1{animation-delay:.5s}.ugb-b2{animation-delay:.25s}.ugb-b3{animation-delay:.75s}.ugb-b4{animation-delay:1s}'
      +'.ugb-hub{animation:ugbCore 2.4s ease-in-out infinite}'
      +'</style>'
      +'<svg class="ugb-svg" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet">'
      +'<defs>'
      +'<linearGradient id="gba" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="#7b5cff" stop-opacity="0"/><stop offset="50%" stop-color="#7b5cff"/><stop offset="100%" stop-color="#00e0c6" stop-opacity="0"/></linearGradient>'
      +'<linearGradient id="gbb" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="#00e0c6" stop-opacity="0"/><stop offset="50%" stop-color="#00e0c6"/><stop offset="100%" stop-color="#ff5ca8" stop-opacity="0"/></linearGradient>'
      +'<radialGradient id="ghub"><stop offset="0%" stop-color="#fff"/><stop offset="40%" stop-color="#7b5cff"/><stop offset="100%" stop-color="#7b5cff" stop-opacity="0"/></radialGradient>'
      +'</defs>'
      +paths
      +'<circle class="ugb-hub" cx="130" cy="195" r="14" fill="url(#ghub)"/>'
      +'</svg>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
