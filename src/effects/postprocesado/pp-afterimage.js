import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-afterimage', title:'Afterimage Trail', cat:'Postprocesado',
  tags:['afterimage','feedback','echo','estela','trail','persistencia','postprocessing'],
  desc:'Estela de fotogramas previos por feedback: cada frame se atenúa dejando ecos del objeto en movimiento.',
  meta:['canvas','feedback','afterimage'],
  prompt:`Crea una estela de afterimage por realimentación (feedback) del framebuffer.
Técnica: NO limpies el lienzo a opaco cada frame. En su lugar, pinta encima un rectángulo negro semitransparente (alpha = 1 - damp, con damp~0.88-0.96). Esto atenúa progresivamente el contenido anterior, dejando ecos cada vez más tenues del objeto. Luego dibuja el objeto en su nueva posición sobre esa capa.
Equivale al <Afterimage damp={0.92}> de postprocessing, que mezcla el frame previo con el actual: out = mix(current, previous, damp). Cuanto mayor el damp, más larga la estela. Ideal para movimiento rápido, cursores o trails neón.`,
  code:`// Afterimage por feedback (canvas 2D)
const damp = 0.92;                 // 0.85=estela corta, 0.96=muy larga
function frame(pos){
  // atenúa el frame previo en vez de borrarlo
  ctx.fillStyle = 'rgba(7,7,16,' + (1-damp) + ')';
  ctx.fillRect(0,0,W,H);
  // dibuja el objeto en su nueva posición (aditivo para brillo neón)
  ctx.globalCompositeOperation = 'lighter';
  drawObject(pos.x, pos.y);
  ctx.globalCompositeOperation = 'source-over';
}
// Postpro real (R3F):
// import { EffectComposer, Afterimage } from '@react-three/postprocessing'
// <EffectComposer><Afterimage damp={0.92} /></EffectComposer>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true,first=true;
    const damp=0.9;
    (function loop(){if(!run)return;t+=.02;
      const W=o.W(),H=o.H();
      if(first){x.fillStyle='#070710';x.fillRect(0,0,W,H);first=false;}
      // atenúa el frame anterior dejando ecos
      x.fillStyle='rgba(7,7,16,'+(1-damp)+')';x.fillRect(0,0,W,H);
      // objeto orbitando
      const cx=W/2+Math.cos(t)*(W*0.3);
      const cy=H/2+Math.sin(t*1.7)*(H*0.3);
      x.globalCompositeOperation='lighter';
      const g=x.createRadialGradient(cx,cy,0,cx,cy,16);
      g.addColorStop(0,'rgba(0,224,198,0.95)');
      g.addColorStop(0.5,'rgba(123,92,255,0.6)');
      g.addColorStop(1,'rgba(123,92,255,0)');
      x.fillStyle=g;x.beginPath();x.arc(cx,cy,16,0,6.283);x.fill();
      x.beginPath();x.arc(cx,cy,5,0,6.283);x.fillStyle='#ffffff';x.fill();
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
