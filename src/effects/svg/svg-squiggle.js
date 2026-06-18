/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-squiggle', title:'Rough Squiggle', cat:'SVG',
  tags:['svg','squiggle','rough','sketch','wobble','turbulence','dibujado'],
  desc:'Trazo dibujado a mano con wobble animado tipo rough.js usando feTurbulence + feDisplacementMap.',
  meta:['SVG filter','feTurbulence','feDisplacementMap'],
  prompt:`Crea un trazo con aspecto "dibujado a mano" (estilo rough.js / sketch) animado.
Tecnica: aplica a un path/forma un filtro SVG de displacement:
1) feTurbulence type="fractalNoise" con baseFrequency baja (~0.01-0.03) y numOctaves 1-2 -> genera un campo de ruido.
2) feDisplacementMap in="SourceGraphic" in2=ruido con scale ~4-8: desplaza cada pixel segun el ruido,
   produciendo bordes temblorosos e irregulares como hechos a lapiz.
Para el "wobble" animado: alterna entre 2-3 valores de seed del feTurbulence (p.ej. cada ~90ms) para que el
ruido salte y el trazo "vibre" como en una animacion frame-by-frame hand-drawn. Usa stroke sin fill, linecap round.`,
  code:`<svg>
  <defs>
    <filter id="rough">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="1" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="6"
        xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <path d="M10 50 H250" fill="none" stroke="#7b5cff" stroke-width="3"
        stroke-linecap="round" filter="url(#rough)"/>
</svg>
// Wobble: cada ~90ms cambia seed del feTurbulence entre {1,2,3} -> el trazo "vibra".`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='background:#0a0a14;display:grid;place-items:center;width:100%;height:100%';
    s.innerHTML='<svg width="100%" height="100%" viewBox="0 0 260 200">'
      +'<defs><filter id="rgh" x="-20%" y="-20%" width="140%" height="140%">'
      +'<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="1" result="n"/>'
      +'<feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>'
      +'</filter></defs>'
      +'<g filter="url(#rgh)" fill="none" stroke-linecap="round" stroke-linejoin="round">'
      +'<path d="M28 62 C 80 40, 150 84, 232 58" stroke="#7b5cff" stroke-width="4"/>'
      +'<path d="M28 104 C 90 130, 160 80, 232 110" stroke="#00e0c6" stroke-width="4"/>'
      +'<rect x="60" y="132" width="140" height="40" rx="8" stroke="#9b7bff" stroke-width="3"/>'
      +'</g></svg>';
    el.appendChild(s);
    const turb=s.querySelector('feTurbulence');
    const seeds=[1,3,7,12];let i=0,raf,run=true,last=0;
    (function loop(now){if(!run)return;
      if(now-last>90){i=(i+1)%seeds.length;turb.setAttribute('seed',seeds[i]);last=now;}
      raf=requestAnimationFrame(loop);})(0);
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
