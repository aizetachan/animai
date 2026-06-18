/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-css-doodle-grid', title:'Generative Grid', cat:'CSS Art',
  tags:['css','generativo','generative','grid','patron','pattern','art','0 js'],
  desc:'Rejilla generativa de cuñas diagonales que rotan en una onda escalonada creando un patrón geométrico vivo, en CSS puro.',
  meta:['conic-gradient','grid','0 JS'],
  prompt:`Crea una rejilla de patrón generativo animado solo con CSS.
Haz un display:grid de 8x8 celdas. Cada celda es un cuadrado con un fondo de conic-gradient de dos colores de marca (#7b5cff y #00e0c6) que dibuja una cuña/triángulo diagonal.
Anima cada celda con @keyframes que rota la celda 90deg en pasos (steps) o de forma continua, pero con un animation-delay que depende de la posición (i+j) para que el giro recorra la rejilla como una ola diagonal. El resultado es un mosaico que parece reorganizarse solo. Sin JS para el patrón (el JS solo asigna delays).`,
  code:`/* Generative Grid - CSS (delays por celda) */
.gen { display:grid; grid-template-columns:repeat(8,1fr); width:240px; aspect-ratio:1; }
.gen i {
  background:conic-gradient(from 0deg, #7b5cff 0 90deg, #00e0c6 90deg 180deg, #07070d 180deg 360deg);
  animation:gen-turn 3.2s ease-in-out infinite;
}
@keyframes gen-turn { 0%,100% { transform:rotate(0); } 50% { transform:rotate(180deg); } }
/* delay = (col+row) * 0.08s asignado por nth-child o JS */`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const n=8;let cells='';
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){
      cells+=`<i style="animation-delay:${((r+c)*0.07).toFixed(2)}s"></i>`;
    }
    s.innerHTML=`<style>
      @keyframes artGen{0%,100%{transform:rotate(0)}50%{transform:rotate(180deg)}}
      .genWrap{display:grid;grid-template-columns:repeat(${n},1fr);width:200px;aspect-ratio:1;border-radius:8px;overflow:hidden}
      .genWrap i{background:conic-gradient(from 0deg,#7b5cff 0 90deg,#00e0c6 90deg 180deg,#0a0a14 180deg 360deg);animation:artGen 3.2s ease-in-out infinite}
    </style><div class="genWrap">${cells}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
