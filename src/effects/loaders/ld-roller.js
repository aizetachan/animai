/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-roller', title:'Roller Dots', cat:'Loaders',
  tags:['css','loader','spinner','dots','puntos','rotación','0 js'],
  desc:'Ocho puntos distribuidos en un aro que rota, con desfase de animación que crea la estela.',
  meta:['transform-origin','0 JS'],
  prompt:`Crea un loader de 8 puntos sobre un aro que rota.
Un contenedor cuadrado con 8 hijos; cada hijo rota desde el centro (transform-origin center) a un ángulo distinto (0,45,90...315deg) y lleva un punto (pseudo-elemento o div) colocado en el borde.
Anima el contenedor o cada punto con un delay escalonado negativo para la estela. 1.2s linear infinite.`,
  code:`.roller { width: 56px; aspect-ratio:1; position:relative; }
.roller div { animation: rl 1.2s cubic-bezier(.5,0,.5,1) infinite; transform-origin: 28px 28px; }
.roller div::after { content:""; position:absolute; width:6px; height:6px; border-radius:50%; background:#7b5cff; top:4px; left:26px; }
.roller div:nth-child(2){ animation-delay:-.1s } /* ...hasta -.7s */
@keyframes rl { to { transform: rotate(360deg); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    let d='';for(let i=0;i<8;i++){d+=`<div style="position:absolute;inset:0;transform:rotate(${i*45}deg);animation:ldRl 1.2s cubic-bezier(.5,0,.5,1) infinite;animation-delay:${-i*0.1}s"><span style="position:absolute;top:5px;left:50%;width:7px;height:7px;margin-left:-3.5px;border-radius:50%;background:#7b5cff"></span></div>`;}
    s.innerHTML=`<style>@keyframes ldRl{to{transform:rotate(360deg)}}</style><div style="width:60px;height:60px;position:relative">${d}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
