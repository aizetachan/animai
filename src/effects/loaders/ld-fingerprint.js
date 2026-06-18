/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-fingerprint', title:'Fingerprint Arcs', cat:'Loaders',
  tags:['css','loader','arcs','fingerprint','huella','concéntrico','0 js'],
  desc:'Arcos concéntricos que giran a velocidades y sentidos distintos, como una huella escaneando.',
  meta:['border-arc','rotate','0 JS'],
  prompt:`Crea un loader de arcos concéntricos.
Varios divs circulares concéntricos (tamaños decrecientes), cada uno mostrando solo un arco (border con solo top o top+right coloreado, resto transparent). Cada anillo gira con duración y dirección alternas (unos linear normal, otros reverse) para el efecto de huella. ~1.5s infinite.`,
  code:`.fp { width:64px; aspect-ratio:1; position:relative; }
.fp i { position:absolute; border-radius:50%; border:3px solid transparent; border-top-color:#7b5cff; animation: fp 1.5s linear infinite; }
.fp i:nth-child(1){ inset:0 }
.fp i:nth-child(2){ inset:8px; border-top-color:#00e0c6; animation-direction:reverse; animation-duration:1.2s }
.fp i:nth-child(3){ inset:16px; animation-duration:1.8s }
@keyframes fp { to { transform: rotate(360deg); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const cfg=[[0,'#7b5cff','normal','1.5s'],[8,'#00e0c6','reverse','1.1s'],[16,'#7b5cff','normal','1.9s'],[24,'#00e0c6','reverse','1.3s']];
    let rings='';for(const[ins,col,dir,dur]of cfg)rings+=`<i style="position:absolute;inset:${ins}px;box-sizing:border-box;border-radius:50%;border:3px solid transparent;border-top-color:${col};animation:ldFp ${dur} linear infinite;animation-direction:${dir}"></i>`;
    s.innerHTML=`<style>@keyframes ldFp{to{transform:rotate(360deg)}}</style><div style="width:64px;height:64px;position:relative">${rings}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
