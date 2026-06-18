import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-scanline', title:'CRT Scanlines', cat:'Postprocesado',
  tags:['scanline','crt','retro','tv','vintage','líneas','postprocessing'],
  desc:'Líneas de barrido tipo monitor CRT con <Scanline>. El look de TV/monitor viejo sobre la escena.',
  meta:['@react-three/postprocessing','<Scanline>','CRT'],
  prompt:`Añade líneas de escaneo CRT con <Scanline density={1.25}> de @react-three/postprocessing.
Superpone líneas horizontales oscuras periódicas, como un monitor de tubo. Combínalo con un leve <Noise> y <Vignette> para el combo "retro TV/terminal".
Ideal para estética vaporwave, terminales hacker o intros vintage.`,
  code:`// npm install @react-three/postprocessing postprocessing
import { EffectComposer, Scanline, Noise, Vignette } from '@react-three/postprocessing'

<EffectComposer>
  <Scanline density={1.25} />
  <Noise opacity={0.04} />
  <Vignette offset={0.3} darkness={0.7} />
</EffectComposer>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.02;const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.3;
      const g=x.createRadialGradient(cx,cy,0,cx,cy,R);g.addColorStop(0,'#00e0c6');g.addColorStop(1,'#0a3530');x.fillStyle='#06080a';x.fillRect(0,0,o.W(),o.H());
      x.fillStyle=g;x.beginPath();x.arc(cx,cy,R*(.9+Math.sin(t)*.05),0,6.28);x.fill();
      // scanlines
      x.fillStyle='rgba(0,0,0,.35)';for(let yy=0;yy<o.H();yy+=3)x.fillRect(0,yy+(Math.sin(t)*1|0),o.W(),1.4);
      // vignette
      const v=x.createRadialGradient(cx,cy,R*.5,cx,cy,o.W()*.7);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=v;x.fillRect(0,0,o.W(),o.H());
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
