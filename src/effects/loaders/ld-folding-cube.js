/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-folding-cube', title:'Folding Cube', cat:'Loaders',
  tags:['css','loader','cube','folding','cubo','plegado','0 js'],
  desc:'Cuatro cuadrantes que se pliegan en secuencia con escala 3D, el clásico "folding cube".',
  meta:['rotateX/Y','scale','0 JS'],
  prompt:`Crea el loader "folding cube".
Un contenedor con perspective y 4 hijos colocados en los 4 cuadrantes (rotados 0/90/180/270deg desde el centro). Cada hijo usa un pseudo-elemento que hace una animación de plegado: rotateX/rotateY de -180→0→0→-180 con scale, encadenados con delays de 0.3s. 2.4s infinite.`,
  code:`.fc { width:48px; aspect-ratio:1; transform: rotateZ(45deg); position:relative; }
.fc i { float:left; width:50%; height:50%; position:relative; transform: scale(1.1); }
.fc i::before { content:""; position:absolute; inset:0; background:#7b5cff; animation: fc 2.4s linear infinite both; transform-origin:100% 100%; }
.fc i:nth-child(2){ transform:scale(1.1) rotateZ(90deg) } /* ::before delay -.3s */
@keyframes fc { 0%,10%{ transform:perspective(140px) rotateX(-180deg); opacity:0 } 25%,75%{ transform:perspective(140px) rotateX(0); opacity:1 } 90%,100%{ transform:perspective(140px) rotateY(180deg); opacity:0 } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const rot=[0,90,270,180],dl=[0,-0.3,-0.9,-0.6];let q='';
    for(let i=0;i<4;i++){q+=`<i style="float:left;width:50%;height:50%;position:relative;transform:scale(1.1) rotateZ(${rot[i]}deg)"><span style="position:absolute;inset:0;background:${i%2?'#00e0c6':'#7b5cff'};animation:ldFc 2.4s linear infinite both;animation-delay:${dl[i]}s;transform-origin:100% 100%;display:block"></span></i>`;}
    s.innerHTML=`<style>@keyframes ldFc{0%,10%{transform:perspective(140px) rotateX(-180deg);opacity:0}25%,75%{transform:perspective(140px) rotateX(0);opacity:1}90%,100%{transform:perspective(140px) rotateY(180deg);opacity:0}}</style><div style="width:48px;height:48px;transform:rotateZ(45deg);position:relative">${q}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
