/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-dual-ring', title:'Dual Ring', cat:'Loaders',
  tags:['css','loader','spinner','ring','aro','carga','0 js'],
  desc:'Dos arcos de un aro girando: el clásico spinner "dual ring" en puro CSS, sin SVG.',
  meta:['border','0 JS'],
  prompt:`Crea un spinner circular tipo "dual ring".
Un div cuadrado con border-radius:50% y border de 5px, donde border-color del top y left son del color de acento y el resto transparent, de modo que solo se ven dos arcos opuestos.
Anímalo con @keyframes rotate de 0 a 360deg, 1.2s linear infinite. Sin SVG ni JS.`,
  code:`.dual-ring {
  width: 48px; aspect-ratio: 1; border-radius: 50%;
  border: 5px solid #7b5cff;
  border-color: #7b5cff transparent #7b5cff transparent;
  animation: dr-spin 1.2s linear infinite;
}
@keyframes dr-spin { to { transform: rotate(360deg); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldDr{to{transform:rotate(360deg)}}</style><div style="width:54px;aspect-ratio:1;border-radius:50%;border:5px solid #7b5cff;border-color:#7b5cff transparent #00e0c6 transparent;animation:ldDr 1.2s linear infinite"></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
