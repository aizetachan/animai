/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-wave-dots', title:'Wave Dots', cat:'Loaders',
  tags:['css','loader','dots','wave','ola','mexican','puntos','0 js'],
  desc:'Siete puntos que suben y bajan en secuencia formando una ola (mexican wave).',
  meta:['translateY','delay','0 JS'],
  prompt:`Crea un loader de ola con puntos.
Una fila de 7 puntos; cada uno hace translateY arriba/abajo con @keyframes y un animation-delay incremental (i*0.1s) para que la onda recorra la fila. ~1s ease-in-out infinite.`,
  code:`.wd { display:flex; gap:7px; }
.wd i { width:11px; height:11px; border-radius:50%; background:#7b5cff; animation: wd 1s ease-in-out infinite; }
.wd i:nth-child(2){ animation-delay:.1s } /* i*0.1s */
@keyframes wd { 0%,60%,100%{ transform:translateY(0) } 30%{ transform:translateY(-16px) } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    let dots='';for(let i=0;i<7;i++)dots+=`<i style="width:12px;height:12px;border-radius:50%;background:${i%2?'#00e0c6':'#7b5cff'};animation:ldWd 1s ease-in-out infinite;animation-delay:${(i*0.1).toFixed(2)}s"></i>`;
    s.innerHTML=`<style>@keyframes ldWd{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-16px)}}</style><div style="display:flex;gap:7px">${dots}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
