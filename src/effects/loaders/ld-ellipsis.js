/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-ellipsis', title:'Typing Ellipsis', cat:'Loaders',
  tags:['css','loader','dots','ellipsis','typing','puntos','0 js'],
  desc:'Tres puntos que aparecen, se desplazan y desaparecen: el indicador "escribiendo…" clásico.',
  meta:['scale','translate','0 JS'],
  prompt:`Crea el loader de 3 puntos tipo "escribiendo…".
Cuatro divs: el primero hace scale(0→1), los del medio se trasladan a la derecha, el último hace scale(1→0). Con delays iguales y cubic-bezier(0,1,1,0) se obtiene el efecto de aparición/desplazamiento/desaparición. 0.6s infinite.`,
  code:`.ell { position:relative; width:64px; height:16px; }
.ell div { position:absolute; top:5px; width:11px; height:11px; border-radius:50%; background:#7b5cff; animation-timing-function: cubic-bezier(0,1,1,0); }
.ell div:nth-child(1){ left:6px; animation: el1 .6s infinite; }
.ell div:nth-child(2){ left:6px; animation: el2 .6s infinite; }
.ell div:nth-child(3){ left:26px; animation: el2 .6s infinite; }
.ell div:nth-child(4){ left:45px; animation: el3 .6s infinite; }
@keyframes el1 { from{transform:scale(0)} to{transform:scale(1)} }
@keyframes el3 { from{transform:scale(1)} to{transform:scale(0)} }
@keyframes el2 { from{transform:translateX(0)} to{transform:translateX(19px)} }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes ldEl1{from{transform:scale(0)}to{transform:scale(1)}}@keyframes ldEl3{from{transform:scale(1)}to{transform:scale(0)}}@keyframes ldEl2{from{transform:translateX(0)}to{transform:translateX(22px)}}</style>'+
      '<div style="position:relative;width:72px;height:16px">'+
      '<div style="position:absolute;top:2px;left:6px;width:12px;height:12px;border-radius:50%;background:#7b5cff;animation:ldEl1 .6s infinite;animation-timing-function:cubic-bezier(0,1,1,0)"></div>'+
      '<div style="position:absolute;top:2px;left:6px;width:12px;height:12px;border-radius:50%;background:#7b5cff;animation:ldEl2 .6s infinite;animation-timing-function:cubic-bezier(0,1,1,0)"></div>'+
      '<div style="position:absolute;top:2px;left:28px;width:12px;height:12px;border-radius:50%;background:#00e0c6;animation:ldEl2 .6s infinite;animation-timing-function:cubic-bezier(0,1,1,0)"></div>'+
      '<div style="position:absolute;top:2px;left:50px;width:12px;height:12px;border-radius:50%;background:#7b5cff;animation:ldEl3 .6s infinite;animation-timing-function:cubic-bezier(0,1,1,0)"></div>'+
      '</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
