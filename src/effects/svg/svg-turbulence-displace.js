/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-turbulence-displace', title:'Turbulence Displace', cat:'SVG',
  tags:['svg','filter','feTurbulence','feDisplacementMap','displace','distorsión','ondulación','warp'],
  desc:'feTurbulence + feDisplacementMap deforman texto y formas con una ondulación líquida continua.',
  meta:['SVG filter','feTurbulence','animado'],
  prompt:`Crea un filtro SVG que deforme texto/formas con ruido Perlin animado.
Usa feTurbulence (type="fractalNoise") para generar un mapa de ruido y feDisplacementMap para desplazar los píxeles del gráfico fuente según ese ruido (canales R y G → ejes X e Y, scale controla la intensidad).
Anima el aspecto líquido variando baseFrequency con el tiempo (o anima seed) por requestAnimationFrame, modificando el atributo del feTurbulence cada frame. Mantén numOctaves 2-3 para detalle.
Aplica filter:url(#id) a un <text> y a una forma. Colores de marca #7b5cff / #00e0c6.`,
  code:`<svg viewBox="0 0 260 200">
  <defs>
    <filter id="warp">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02"
                    numOctaves="2" seed="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise"
                         scale="22" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0c6"/>
    </linearGradient>
  </defs>
  <text x="130" y="110" filter="url(#warp)" fill="url(#g)"
        font-size="46" font-weight="800" text-anchor="middle">animai</text>
</svg>

<script>
// anima el ruido modificando baseFrequency por frame
const turb = document.querySelector('#warp feTurbulence');
let t = 0;
(function loop(){
  t += 0.01;
  const f = 0.012 + Math.sin(t) * 0.006;
  turb.setAttribute('baseFrequency', f.toFixed(4) + ' ' + (f*1.5).toFixed(4));
  requestAnimationFrame(loop);
})();
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#070710';
    s.innerHTML='<svg viewBox="0 0 260 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">'+
      '<defs>'+
      '<filter id="tdwarp" x="-20%" y="-20%" width="140%" height="140%">'+
      '<feTurbulence id="tdnoise" type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="3" result="n"/>'+
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G"/>'+
      '</filter>'+
      '<linearGradient id="tdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0c6"/></linearGradient>'+
      '</defs>'+
      '<g filter="url(#tdwarp)">'+
      '<rect x="42" y="44" width="176" height="112" rx="16" fill="none" stroke="#7b5cff" stroke-width="2.5" opacity="0.55"/>'+
      '<text x="130" y="116" fill="url(#tdg)" font-family="system-ui,sans-serif" font-size="44" font-weight="800" text-anchor="middle">animai</text>'+
      '</g></svg>';
    el.appendChild(s);
    const turb=s.querySelector('#tdnoise');let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.012;
      const f=0.012+Math.sin(t)*0.007;
      turb.setAttribute('baseFrequency',Math.abs(f).toFixed(4)+' '+Math.abs(f*1.6+0.004).toFixed(4));
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
