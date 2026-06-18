/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-only-loaders', title:'CSS Loaders Trio', cat:'CSS Moderno',
  tags:['loader','spinner','css','cargando','animación','puntos','barra'],
  desc:'Tres spinners de carga puramente CSS: anillo, puntos pulsantes y barra. Loaders sin JS.',
  meta:['@keyframes','spinner','0 JS'],
  prompt:`Crea un set de loaders/spinners en CSS puro: (1) un anillo que gira con un arco de color, (2) tres puntos que pulsan en secuencia, (3) una barra de progreso indeterminada que va y viene.
Cada uno con @keyframes: rotate para el anillo, scale con delay escalonado para los puntos, translateX para la barra. Todo con currentColor para tematizar fácil.
Para estados de carga ligeros y consistentes.`,
  code:`/* Spinner de anillo (CSS puro) */
.spinner {
  border: 3px solid rgba(255,255,255,.15);
  border-top-color: #7b5cff; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
/* puntos: scale con animation-delay escalonado; barra: translateX indeterminada */`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:flex;gap:28px;align-items:center;justify-content:center';
    s.innerHTML='<style>@keyframes spr{to{transform:rotate(360deg)}}@keyframes dotp{0%,80%,100%{transform:scale(.4);opacity:.4}40%{transform:scale(1);opacity:1}}@keyframes barp{0%{left:-40%}100%{left:100%}}</style>'+
      '<div style="width:34px;height:34px;border:3px solid rgba(255,255,255,.15);border-top-color:#7b5cff;border-radius:50%;animation:spr .8s linear infinite"></div>'+
      '<div style="display:flex;gap:6px">'+[0,1,2].map(i=>'<div style="width:9px;height:9px;border-radius:50%;background:#00e0c6;animation:dotp 1.2s ease-in-out infinite;animation-delay:'+(i*.15)+'s"></div>').join('')+'</div>'+
      '<div style="position:relative;width:70px;height:6px;background:#16162a;border-radius:3px;overflow:hidden"><div style="position:absolute;top:0;width:40%;height:100%;background:#ff5ca8;border-radius:3px;animation:barp 1.2s ease-in-out infinite"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
