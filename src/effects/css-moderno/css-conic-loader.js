/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-conic-loader', title:'Conic Spinner', cat:'CSS Moderno',
  tags:['css','loader','spinner','conic','carga','mask','0 js'],
  desc:'Spinner de carga con gradiente cónico y máscara. Loader elegante en puro CSS, sin SVG ni JS.',
  meta:['conic-gradient','mask','0 JS'],
  prompt:`Crea un spinner de carga moderno solo con CSS.
Un div redondo con background:conic-gradient(de transparente a color), recortado por dentro con mask:radial-gradient(farthest-side,#0000 calc(100% - 6px),#000 0) para dejar solo el aro.
Anímalo con @keyframes rotate 360deg infinite. Sin SVG, sin JS. Cambia el grosor con el offset de la máscara.`,
  code:`/* Spinner CSS puro con conic-gradient + mask */
.spinner {
  width: 48px; aspect-ratio: 1; border-radius: 50%;
  background: conic-gradient(from 0deg, #0000, #7b5cff);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 6px), #000 0);
          mask: radial-gradient(farthest-side, #0000 calc(100% - 6px), #000 0);
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes csp{to{transform:rotate(360deg)}}</style><div style="width:56px;aspect-ratio:1;border-radius:50%;background:conic-gradient(from 0deg,#0000,#7b5cff,#00e0c6);-webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 7px),#000 0);mask:radial-gradient(farthest-side,#0000 calc(100% - 7px),#000 0);animation:csp .9s linear infinite"></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
