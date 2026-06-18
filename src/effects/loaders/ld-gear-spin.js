/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-gear-spin', title:'Gear Spin', cat:'Loaders',
  tags:['css','svg','loader','gear','engranaje','cog','rueda'],
  desc:'Dos engranajes SVG dentados girando en sentidos opuestos, como mecanismo en marcha.',
  meta:['svg','0 JS'],
  prompt:`Crea un loader de engranajes con SVG + CSS.
Define un <svg> con dos engranajes (cog) dibujados como <path> dentados, uno grande y otro pequeño que encajan.
Da a cada engranaje un transform-origin en su centro y animálo con @keyframes rotate 360deg infinite: el grande gira en un sentido (linear, ~3s) y el pequeño en sentido contrario y más rápido (~2s) para simular que engranan. Colorea con el acento de marca. Sin JS.`,
  code:`<svg width="120" height="90" viewBox="0 0 120 90">
  <path class="gear big" fill="#7b5cff" transform-origin="42px 45px" d="M42 18l3 8 9-2 4 8-7 6 4 8-8 4 2 9-9 1-3 8-8-4-7 5-6-7 5-7-5-7 7-5 1-9 9 0 4-8 8 3z"/>
  <circle cx="42" cy="45" r="9" fill="#07070d"/>
  <path class="gear small" fill="#00e0c6" transform-origin="90px 60px" d="M90 44l2 6 6-1 2 6-5 3 3 5-6 2 0 6-6-1-4 5-5-4 1-6-6-2 2-6 6 0 2-6 6 1z"/>
  <circle cx="90" cy="60" r="6" fill="#07070d"/>
</svg>
<style>
.gear { animation: gr-spin 3s linear infinite; }
.gear.small { animation: gr-spin-rev 2s linear infinite; }
@keyframes gr-spin { to { transform: rotate(360deg); } }
@keyframes gr-spin-rev { to { transform: rotate(-360deg); } }
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'+
      '.ldgr-big{transform-origin:42px 45px;animation:ldgrSpin 3s linear infinite}'+
      '.ldgr-sm{transform-origin:90px 60px;animation:ldgrSpinRev 2s linear infinite}'+
      '@keyframes ldgrSpin{to{transform:rotate(360deg)}}'+
      '@keyframes ldgrSpinRev{to{transform:rotate(-360deg)}}'+
      '</style>'+
      '<svg width="130" height="100" viewBox="0 0 120 90">'+
      '<path class="ldgr-big" fill="#7b5cff" d="M42 18l3 8 9-2 4 8-7 6 4 8-8 4 2 9-9 1-3 8-8-4-7 5-6-7 5-7-5-7 7-5 1-9 9 0 4-8 8 3z"/>'+
      '<circle cx="42" cy="45" r="9" fill="#07070d"/>'+
      '<path class="ldgr-sm" fill="#00e0c6" d="M90 44l2 6 6-1 2 6-5 3 3 5-6 2 0 6-6-1-4 5-5-4 1-6-6-2 2-6 6 0 2-6 6 1z"/>'+
      '<circle cx="90" cy="60" r="6" fill="#07070d"/>'+
      '</svg>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
