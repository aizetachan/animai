/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-gradient-stops', title:'Animated Gradient Stops', cat:'SVG',
  tags:['svg','gradient','gradiente','stops','linearGradient','animado','color'],
  desc:'Gradiente SVG cuyos stops se animan recorriendo la forma, creando un flujo de color continuo.',
  meta:['SVG','linearGradient','stop offset'],
  prompt:`Crea un gradiente SVG (linearGradient) cuyos stops se animan para recorrer una forma.
Define 3-4 <stop> con stop-color de marca y anima su atributo "offset" desplazándolo cíclicamente (offset = fract(base + t*velocidad)).
Ordena los stops por offset creciente en cada frame, o usa gradientTransform (translate) sobre un gradiente que se repita. Aplica el gradiente como fill de un rect/path o como stroke. Ideal para texto, bordes y formas con flujo de color.`,
  code:`// Anima el atributo offset de cada stop por frame
function loop(t){
  stops.forEach((s,i)=>{
    const base = i/(stops.length-1)
    const off = ((base + t*0.15) % 1 + 1) % 1
    s.setAttribute('offset', off)
  })
  // reordena los stops por offset para que el gradiente sea válido
  stops.slice().sort((a,b)=>a.getAttribute('offset')-b.getAttribute('offset'))
       .forEach(s=>grad.appendChild(s))
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const cols=['#7b5cff','#00e0c6','#7b5cff','#00e0c6'];
    s.innerHTML=`<svg viewBox="0 0 200 120" width="84%" style="overflow:visible">
      <defs><linearGradient id="gst" x1="0" y1="0" x2="1" y2="0">
        ${cols.map((c,i)=>`<stop class="gs" offset="${i/(cols.length-1)}" stop-color="${c}"/>`).join('')}
      </linearGradient></defs>
      <rect x="14" y="34" width="172" height="52" rx="12" fill="url(#gst)"/>
      <text x="100" y="68" text-anchor="middle" font-size="22" font-weight="800" fill="#0a0a14" font-family="system-ui,sans-serif">FLOW</text>
    </svg>`;
    el.appendChild(s);
    const grad=s.querySelector('#gst');
    const stops=Array.from(s.querySelectorAll('.gs'));
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.006;
      stops.forEach((st,i)=>{const base=i/(stops.length-1);const off=((base+t)%1+1)%1;st.setAttribute('offset',off.toFixed(4));});
      stops.slice().sort((a,b)=>(+a.getAttribute('offset'))-(+b.getAttribute('offset'))).forEach(st=>grad.appendChild(st));
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
