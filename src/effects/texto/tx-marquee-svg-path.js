/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-marquee-svg-path', title:'Marquee on Path', cat:'Texto',
  tags:['marquee','svg','textPath','path','onda','wave','loop'],
  desc:'Texto en bucle continuo que recorre un path SVG ondulado, deslizándose a lo largo de la curva.',
  meta:['SVG textPath','startOffset','Loop'],
  prompt:`Crea un marquee de texto que sigue una curva ondulada usando SVG textPath.
Elementos: un <svg> con un <path> (curva sinusoidal/bezier, p.ej. d="M0,60 C ...") con id. Un <text> que contiene un <textPath href="#id"> con el texto repetido varias veces para llenar la curva.
Técnica de animación: anima el atributo startOffset del textPath de 0% a un valor negativo (o usa SMIL <animate>) para que el texto se desplace continuamente a lo largo del path, dando sensación de marquee curvo e infinito.
Timings: bucle lineal ~8s, repeatCount indefinite. El texto repetido debe encajar para que el loop sea perfecto (sin saltos). Usa la fuente de marca y color claro/acento.`,
  code:`<svg viewBox="0 0 300 120" width="300" height="120">
  <path id="mp-wave" fill="none" d="M-20,60 Q55,10 130,60 T280,60 T420,60"/>
  <text font="600 18px Inter,sans-serif" fill="#eef0f7">
    <textPath href="#mp-wave" startOffset="0">
      ANIMAI • KINETIC TYPE • ANIMAI • KINETIC TYPE •
      <animate attributeName="startOffset" from="0" to="-50%"
        dur="8s" repeatCount="indefinite"/>
    </textPath>
  </text>
</svg>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden';
    const NS='http://www.w3.org/2000/svg';
    s.innerHTML=
      '<svg viewBox="0 0 300 120" width="260" height="120" style="overflow:visible">'
      +'<defs><linearGradient id="mpgrad" x1="0" y1="0" x2="1" y2="0">'
      +'<stop offset="0" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0c6"/></linearGradient></defs>'
      +'<path id="mp-wave" fill="none" stroke="rgba(123,92,255,.18)" stroke-width="1.5" d="M-40,60 Q35,12 110,60 T260,60 T410,60 T560,60"/>'
      +'<text style="font:600 18px Inter,system-ui,sans-serif;letter-spacing:.04em" fill="url(#mpgrad)">'
      +'<textPath href="#mp-wave" startOffset="0">'
      +'ANIMAI • KINETIC TYPE • ANIMAI • KINETIC TYPE • '
      +'<animate attributeName="startOffset" from="0" to="-25%" dur="8s" repeatCount="indefinite"/>'
      +'</textPath></text>'
      +'</svg>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
