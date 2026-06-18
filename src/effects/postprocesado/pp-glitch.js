import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-glitch', title:'Glitch Effect', cat:'Postprocesado',
  tags:['glitch','postprocessing','distorsión','rgb','digital','error'],
  desc:'Glitch digital esporádico con desplazamiento RGB. El efecto "señal corrupta" de react-postprocessing.',
  meta:['@react-three/postprocessing','<Glitch>','GlitchMode'],
  prompt:`Añade un glitch digital a tu escena 3D con <Glitch> de @react-three/postprocessing.
Props: delay={[1.5,3.5]} (rango entre glitches), duration, strength, mode={GlitchMode.SPORADIC}, ratio (umbral fuerte/débil).
Va dentro de un <EffectComposer>. Genera cortes RGB y bloques desplazados. Estética cyberpunk/error de señal para intros o transiciones.`,
  code:`// npm install @react-three/postprocessing postprocessing
import { EffectComposer, Glitch } from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'

<EffectComposer>
  <Glitch
    delay={[1.5, 3.5]} duration={[0.6, 1.0]}
    strength={[0.3, 1.0]} mode={GlitchMode.SPORADIC}
    ratio={0.85} active />
</EffectComposer>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true,glitch=0;
    (function loop(){if(!run)return;t+=.03;if(Math.random()<.03)glitch=8+Math.random()*14;glitch*=.85;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.25;
      // base
      function shape(off,col){x.fillStyle=col;x.save();x.translate(off,0);x.beginPath();for(let a=0;a<=6;a++){const an=a/6*6.283;x.lineTo(cx+Math.cos(an)*R,cy+Math.sin(an)*R);}x.closePath();x.fill();x.restore();}
      x.globalCompositeOperation='lighter';shape(-glitch,'rgba(255,0,80,.7)');shape(glitch,'rgba(0,224,198,.7)');shape(0,'rgba(123,92,255,.7)');x.globalCompositeOperation='source-over';
      // scan glitch bands
      if(glitch>1)for(let i=0;i<3;i++){const gy=Math.random()*o.H(),gh=2+Math.random()*8;x.drawImage(o.c,0,gy*Math.min(devicePixelRatio,2),o.c.width,gh*Math.min(devicePixelRatio,2),(Math.random()-.5)*glitch*2,gy,o.W(),gh);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
