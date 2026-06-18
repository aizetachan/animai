/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-gooey-filter', title:'Gooey Filter', cat:'SVG',
  tags:['svg','gooey','filter','blur','metaball','fusion','liquido'],
  desc:'Fusion liquida tipo metaball de varios circulos con un filtro SVG gooey.',
  meta:['SVG filter','feGaussianBlur','feColorMatrix'],
  prompt:`Crea el clasico efecto "gooey" (metaball) con un filtro SVG aplicado a un grupo de formas.
Tecnica: define un <filter> con dos primitivas encadenadas:
1) feGaussianBlur sobre el SourceGraphic (stdDeviation ~6-12) para difuminar los bordes.
2) feColorMatrix en modo 'matrix' que recorta el canal alpha con una rampa de alto contraste:
   1 0 0 0 0 / 0 1 0 0 0 / 0 0 1 0 0 / 0 0 0 18 -7
   El factor grande (18) en alpha multiplica y el offset (-7) corta, de modo que solo las zonas donde
   el blur se solapa (alpha alto) quedan opacas, fundiendo formas cercanas en una sola masa.
Aplica filter al grupo y anima la posicion de los circulos para que se atraigan y separen.`,
  code:`<svg width="100%" height="100%">
  <defs>
    <filter id="gooey">
      <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur"/>
      <feColorMatrix in="blur" mode="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"/>
      <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
    </filter>
  </defs>
  <g filter="url(#gooey)">
    <circle r="22" fill="#7b5cff"/>
    <circle r="18" fill="#00e0c6"/>
  </g>
</svg>
// Anima cx/cy de cada circulo con senos desfasados; al solaparse se fusionan.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='background:#0a0a14;width:100%;height:100%';
    s.innerHTML='<svg width="100%" height="100%" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid slice">'
      +'<defs><filter id="gly"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/>'
      +'<feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="g"/>'
      +'<feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs>'
      +'<g filter="url(#gly)">'
      +'<circle id="c0" r="26" fill="#7b5cff"/>'
      +'<circle id="c1" r="20" fill="#00e0c6"/>'
      +'<circle id="c2" r="16" fill="#9b7bff"/>'
      +'<circle id="c3" r="13" fill="#2af0d6"/>'
      +'</g></svg>';
    el.appendChild(s);
    const cs=[s.querySelector('#c0'),s.querySelector('#c1'),s.querySelector('#c2'),s.querySelector('#c3')];
    const cx=130,cy=100;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.018;
      cs.forEach((c,i)=>{
        const a=t*(1+i*.35)+i*1.7, rad=20+i*16+Math.sin(t*1.3+i)*14;
        c.setAttribute('cx',(cx+Math.cos(a)*rad).toFixed(1));
        c.setAttribute('cy',(cy+Math.sin(a*1.2)*rad*.8).toFixed(1));
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
