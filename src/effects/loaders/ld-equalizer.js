/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-equalizer', title:'Equalizer Bars', cat:'Loaders',
  tags:['css','loader','bars','equalizer','barras','audio','0 js'],
  desc:'Cinco barras verticales que suben y bajan con desfase, como un ecualizador de audio.',
  meta:['scaleY','delay','0 JS'],
  prompt:`Crea un loader de barras de ecualizador.
Cinco divs verticales en flex; cada uno hace scaleY (transform-origin:bottom) entre 0.3 y 1 con un animation-delay distinto para desincronizarlas. ~0.9s ease-in-out infinite alternate.`,
  code:`.eq { display:flex; gap:5px; align-items:flex-end; height:44px; }
.eq i { width:7px; height:100%; border-radius:3px; background:#7b5cff; transform-origin:bottom; animation: eq .9s ease-in-out infinite alternate; }
.eq i:nth-child(2){ animation-delay:-.7s } /* etc */
@keyframes eq { 0%{ transform:scaleY(.3) } 100%{ transform:scaleY(1) } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const dl=[-0.0,-0.7,-0.3,-0.9,-0.5];let bars='';for(let i=0;i<5;i++){bars+=`<i style="width:8px;height:100%;border-radius:3px;background:${i%2?'#00e0c6':'#7b5cff'};transform-origin:bottom;animation:ldEq .9s ease-in-out infinite alternate;animation-delay:${dl[i]}s"></i>`;}
    s.innerHTML=`<style>@keyframes ldEq{0%{transform:scaleY(.25)}100%{transform:scaleY(1)}}</style><div style="display:flex;gap:5px;align-items:flex-end;height:46px">${bars}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
