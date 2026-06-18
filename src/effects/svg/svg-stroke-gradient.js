/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-stroke-gradient', title:'Stroke Gradient Flow', cat:'SVG',
  tags:['svg','gradient','stroke','flow','flujo','linearGradient','trazo','animate'],
  desc:'Un trazo SVG con gradiente que fluye a lo largo del path, como energía recorriendo la línea.',
  meta:['SVG','linearGradient','stroke','dashoffset'],
  prompt:`Trazo SVG cuyo gradiente parece "fluir" a lo largo del path.
Técnica 1 (gradiente animado): define un <linearGradient> con varios stops y aplícalo como stroke del path.
Anima el desplazamiento del gradiente moviendo x1/x2 (o gradientTransform translate) en bucle.
Técnica 2 (combo recomendado): pinta el path con el gradiente y SUPERPÓN un segundo path igual con
stroke-dasharray (un dash corto + hueco grande) y anima stroke-dashoffset; eso crea un "brillo" que recorre la línea.
Parámetros: gradiente #7b5cff -> #00e0c6 -> #7b5cff, gradientUnits userSpaceOnUse, velocidad ~60px/s,
dash del brillo: 30 visibles / largo total oculto, dashoffset de +L a 0.`,
  code:`// <defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
//   <stop offset="0"   stop-color="#7b5cff"/>
//   <stop offset=".5"  stop-color="#00e0c6"/>
//   <stop offset="1"   stop-color="#7b5cff"/>
// </linearGradient></defs>
// <path id="base" stroke="url(#g)" fill="none" stroke-width="6"/>
// <path id="glow" stroke="#fff" fill="none" stroke-width="6"/>  (brillo recorriendo)
const L = base.getTotalLength();
glow.style.strokeDasharray = '34 ' + L;   // un dash corto + hueco enorme
let t = 0;
function loop(){
  t += 0.016;
  // 1) gradiente que fluye via gradientTransform
  grad.setAttribute('gradientTransform','translate('+((t*80)%200)+' 0)');
  // 2) brillo recorriendo el trazo
  glow.style.strokeDashoffset = (L - (t*120 % (L+34)));
  requestAnimationFrame(loop);
}
loop();`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="0 0 200 120" width="80%" style="overflow:visible">'+
      '<defs><linearGradient id="ssg" gradientUnits="userSpaceOnUse" x1="-100" y1="0" x2="100" y2="0">'+
      '<stop offset="0" stop-color="#7b5cff"/><stop offset="0.5" stop-color="#00e0c6"/><stop offset="1" stop-color="#7b5cff"/>'+
      '</linearGradient></defs>'+
      '<path id="ssgBase" d="M18 88 C 56 14, 92 14, 100 60 S 156 108, 184 28" fill="none" stroke="url(#ssg)" stroke-width="6" stroke-linecap="round"/>'+
      '<path id="ssgGlow" d="M18 88 C 56 14, 92 14, 100 60 S 156 108, 184 28" fill="none" stroke="#eafff9" stroke-width="6" stroke-linecap="round" opacity="0.9"/>'+
      '</svg>';
    el.appendChild(s);
    const grad=s.querySelector('#ssg'),base=s.querySelector('#ssgBase'),glow=s.querySelector('#ssgGlow');
    const L=base.getTotalLength();
    glow.style.strokeDasharray='30 '+L.toFixed(1);
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=0.016;
      grad.setAttribute('gradientTransform','translate('+((t*90)%200).toFixed(1)+' 0)');
      glow.style.strokeDashoffset=(L-((t*130)%(L+30))).toFixed(1);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
