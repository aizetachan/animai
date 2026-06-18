/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-motionpath', title:'Motion Path', cat:'SVG',
  tags:['svg','path','ruta','órbita','motionpath','gsap','seguir'],
  desc:'Un objeto recorre una curva siguiendo su orientación, como MotionPathPlugin de GSAP.',
  meta:['SVG path','getPointAtLength','Orientado'],
  prompt:`Mueve un elemento a lo largo de una ruta SVG (equivalente a MotionPathPlugin de GSAP).
Recorre el path con getPointAtLength(progress*total); orienta el objeto calculando el ángulo entre dos puntos consecutivos (atan2).
Úsalo para cohetes, naves, partículas guiadas o pelotas que botan por una curva definida. Loop progress 0->1.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg viewBox="0 0 200 120" width="85%" style="overflow:visible"><path id="track" d="M10 100 C 60 0, 140 0, 190 90 S 120 130, 60 60" fill="none" stroke="#1e1e3a" stroke-width="2" stroke-dasharray="4 5"/><g id="mover"><path d="M0 -7 L6 7 L0 3 L-6 7 Z" fill="#00e0c6"/></g></svg>';
    el.appendChild(s);const track=s.querySelector('#track'),mover=s.querySelector('#mover');const L=track.getTotalLength();let d=0,raf,run=true;
    (function loop(){if(!run)return;d=(d+1.1)%L;const pt=track.getPointAtLength(d),pt2=track.getPointAtLength((d+1)%L);const ang=Math.atan2(pt2.y-pt.y,pt2.x-pt.x)*180/Math.PI+90;mover.setAttribute('transform','translate('+pt.x+' '+pt.y+') rotate('+ang+')');raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
