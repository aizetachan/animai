/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-dominoes', title:'Dominoes', cat:'Loaders',
  tags:['css','loader','dominoes','domino','fichas','caida','fall','carga'],
  desc:'Una fila de fichas de domino que caen en cadena una tras otra y se reinician en bucle.',
  meta:['transform','0 JS'],
  prompt:`Crea un loader de fichas de domino cayendo en cadena.
Coloca una fila horizontal de ~6 barras verticales (fichas) delgadas y altas (ej. 8x34px), redondeadas, alineadas por su base (transform-origin: bottom).
Cada ficha usa un mismo @keyframes ld-fall que la inclina con transform:rotate desde 0deg (de pie) hasta ~70deg (caida) y luego de vuelta a 0 al final, con una pausa de pie. Para la cadena, da a cada ficha un animation-delay incremental (paso ~0.18s) de izquierda a derecha, de modo que parecen empujarse una a otra.
Duracion ~2s, ease-in-out, infinite. Para que la cadena se reinicie limpia, ajusta el porcentaje de caida y reposo en los keyframes. Solo CSS, sin JS.`,
  code:`.dom { display: flex; gap: 2px; align-items: flex-end; height: 40px; }
.dom i {
  display: block; width: 8px; height: 34px; border-radius: 3px;
  background: #7b5cff; transform-origin: bottom center;
  animation: dom-fall 2s ease-in-out infinite;
}
.dom i:nth-child(1){ animation-delay: 0s; }
.dom i:nth-child(2){ animation-delay: .18s; }
.dom i:nth-child(3){ animation-delay: .36s; }
.dom i:nth-child(4){ animation-delay: .54s; }
.dom i:nth-child(5){ animation-delay: .72s; }
.dom i:nth-child(6){ animation-delay: .90s; }
@keyframes dom-fall {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(72deg); }
  55%  { transform: rotate(72deg); }
  80%  { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const N=6;
    let fichas='';
    for(let i=0;i<N;i++){
      const col=i%2===0?'#7b5cff':'#00e0c6';
      fichas+='<i style="background:'+col+';box-shadow:0 0 8px '+col+';animation-delay:'+(i*0.18).toFixed(2)+'s"></i>';
    }
    s.innerHTML='<style>'+
      '.ldDomWrap{display:flex;gap:3px;align-items:flex-end;height:42px}'+
      '.ldDomWrap i{display:block;width:9px;height:36px;border-radius:3px;transform-origin:bottom center;animation:ldDomFall 2s ease-in-out infinite}'+
      '@keyframes ldDomFall{0%{transform:rotate(0deg)}25%{transform:rotate(72deg)}55%{transform:rotate(72deg)}80%{transform:rotate(0deg)}100%{transform:rotate(0deg)}}'+
      '</style>'+
      '<div class="ldDomWrap">'+fichas+'</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
