/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-grid-pulse', title:'Grid Pulse', cat:'Loaders',
  tags:['css','loader','grid','squares','cuadrícula','pulse','0 js'],
  desc:'Rejilla 3×3 de cuadrados que pulsan con desfase diagonal, creando una onda.',
  meta:['grid','scale','delay','0 JS'],
  prompt:`Crea un loader de rejilla 3×3.
Un contenedor display:grid de 3 columnas con 9 celdas cuadradas. Cada celda hace scale(1→0.4→1) con opacidad, y se le asigna un animation-delay distinto según su posición diagonal (i+j) para que la onda recorra la rejilla. 1.3s ease-in-out infinite.`,
  code:`.gp { display:grid; grid-template-columns:repeat(3,14px); gap:6px; }
.gp i { width:14px; height:14px; border-radius:3px; background:#7b5cff; animation: gp 1.3s ease-in-out infinite; }
/* delay = (row + col) * 0.1s */
@keyframes gp { 0%,70%,100%{ transform:scale(1); opacity:1 } 35%{ transform:scale(.4); opacity:.4 } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    let cells='';for(let r=0;r<3;r++)for(let c=0;c<3;c++){const dl=((r+c)*0.12).toFixed(2);cells+=`<i style="width:15px;height:15px;border-radius:3px;background:${(r+c)%2?'#00e0c6':'#7b5cff'};animation:ldGp 1.3s ease-in-out infinite;animation-delay:${dl}s"></i>`;}
    s.innerHTML=`<style>@keyframes ldGp{0%,70%,100%{transform:scale(1);opacity:1}35%{transform:scale(.4);opacity:.4}}</style><div style="display:grid;grid-template-columns:repeat(3,15px);gap:6px">${cells}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
