/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-cafe-wall', title:'Café Wall Illusion', cat:'CSS Art',
  tags:['css','ilusion optica','illusion','cafe wall','grid','tiles','0 js'],
  desc:'Ilusión óptica "café wall": filas de cuadros blancos y negros desplazadas que parecen torcerse, con un sutil vaivén animado.',
  meta:['repeating gradients','0 JS'],
  prompt:`Recrea la ilusión óptica "Café Wall" solo con CSS.
Crea un contenedor de varias filas. Cada fila es un patrón de cuadros alternos blanco/negro hecho con background:repeating-linear-gradient(90deg,#fff 0 28px,#111 28px 56px). Entre filas hay una fina línea gris (mortero). Cada fila se desplaza horizontalmente la mitad respecto a la anterior usando background-position-x alternado (0 y 14px), lo que crea la ilusión de que las líneas grises se inclinan aunque sean perfectamente horizontales.
Anímalo con @keyframes que mueve background-position-x unos px en bucle alternate para reforzar el efecto de inestabilidad. Sin JS.`,
  code:`/* Café Wall Illusion - puro CSS */
.cafewall { display:flex; flex-direction:column; gap:3px; background:#888; padding:3px; }
.cafewall .row { height:26px; background:repeating-linear-gradient(90deg,#fff 0 28px,#111 28px 56px); }
.cafewall .row:nth-child(odd)  { --p:0px;   background-position-x:var(--p); }
.cafewall .row:nth-child(even) { --p:14px;  background-position-x:var(--p); }
.cafewall .row { animation:cw-shift 3s ease-in-out infinite alternate; }
@keyframes cw-shift { from { background-position-x:var(--p); } to { background-position-x:calc(var(--p) + 5px); } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const rows=Array.from({length:6},(_,i)=>`<div class="cwRow" style="--p:${i%2?14:0}px"></div>`).join('');
    s.innerHTML=`<style>
      @keyframes artCw{from{background-position-x:var(--p)}to{background-position-x:calc(var(--p) + 5px)}}
      .cwWrap{display:flex;flex-direction:column;gap:3px;background:#7f7f7f;padding:3px;border-radius:6px}
      .cwRow{width:200px;height:24px;background:repeating-linear-gradient(90deg,#fafafa 0 28px,#0a0a0a 28px 56px);background-position-x:var(--p);animation:artCw 3s ease-in-out infinite alternate}
    </style><div class="cwWrap">${rows}</div>`;
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
