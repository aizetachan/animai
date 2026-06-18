/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-tracing-beam', title:'Tracing Beam', cat:'UI Components',
  tags:['tracing','beam','haz','svg','line','scroll','aceternity'],
  desc:'Un haz luminoso recorre y dibuja una línea SVG vertical a medida que avanza el scroll.',
  meta:['Aceternity UI','SVG','stroke-dashoffset'],
  prompt:`Recrea el Tracing Beam de Aceternity: una línea SVG vertical que se "dibuja" de arriba a abajo con un degradado luminoso, como si el scroll trazara un haz junto al contenido.
Elementos: un SVG con un <path> vertical (puede tener curvas suaves), un gradiente lineal vertical del color de marca aplicado al stroke, y un punto/círculo brillante en la cabeza del haz.
Técnica: usa stroke-dasharray = longitud total del path (getTotalLength) y anima stroke-dashoffset de longitud→0 para revelar la línea. Sincroniza un círculo con glow que viaja por el path con getPointAtLength(progreso). En auto-demo, anima un valor de progreso 0→1 en bucle con un easing y reinicia.
Color: degradado de #7b5cff a #00e0c6, glow con drop-shadow. Timings: trazado ~2.5s ease-in-out, pausa breve y reinicio.`,
  code:`<svg width="60" height="400" viewBox="0 0 60 400">
  <defs><linearGradient id="tb" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7b5cff"/><stop offset="100%" stop-color="#00e0c6"/>
  </linearGradient></defs>
  <path id="p" d="M30 0 C 10 100, 50 200, 30 400" fill="none" stroke="url(#tb)" stroke-width="3"/>
  <circle id="head" r="5" fill="#fff"/>
</svg>
<script>
const path=document.getElementById('p'),head=document.getElementById('head');
const L=path.getTotalLength(); path.style.strokeDasharray=L;
function frame(t){ const k=Math.min(t/2500,1); path.style.strokeDashoffset=L*(1-k);
  const pt=path.getPointAtLength(L*k); head.setAttribute('cx',pt.x); head.setAttribute('cy',pt.y);
  if(k<1) requestAnimationFrame(()=>frame(t+16)); }
frame(0);
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0a0a16';
    s.innerHTML='<svg width="70" height="180" viewBox="0 0 70 180" style="overflow:visible">'
      +'<defs><linearGradient id="ucTbGrad" x1="0" y1="0" x2="0" y2="1">'
      +'<stop offset="0%" stop-color="#7b5cff"/><stop offset="100%" stop-color="#00e0c6"/></linearGradient></defs>'
      +'<path d="M35 4 C 8 50, 62 120, 35 176" fill="none" stroke="#1d1d33" stroke-width="3"/>'
      +'<path id="ucTbPath" d="M35 4 C 8 50, 62 120, 35 176" fill="none" stroke="url(#ucTbGrad)" stroke-width="3" stroke-linecap="round" style="filter:drop-shadow(0 0 4px #7b5cff)"/>'
      +'<circle id="ucTbHead" r="5" fill="#fff" style="filter:drop-shadow(0 0 7px #00e0c6)"/>'
      +'</svg>';
    el.appendChild(s);
    const path=s.querySelector('#ucTbPath'),head=s.querySelector('#ucTbHead');
    const L=path.getTotalLength();path.style.strokeDasharray=L;
    let raf,run=true,t0=performance.now();
    const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    function loop(now){
      if(!run)return;
      const cycle=3400,el2=(now-t0)%cycle;
      let k=Math.min(el2/2500,1);
      k=ease(k);
      path.style.strokeDashoffset=L*(1-k);
      const pt=path.getPointAtLength(Math.max(.001,L*k));
      head.setAttribute('cx',pt.x);head.setAttribute('cy',pt.y);
      head.style.opacity=k>=1?0:1;
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
