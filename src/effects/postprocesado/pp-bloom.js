import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-bloom', title:'Bloom Glow', cat:'Postprocesado',
  tags:['bloom','glow','resplandor','hdr','brillo','threshold','postprocessing','luminance'],
  desc:'Bloom selectivo: las zonas más brillantes de la escena se desbordan con un resplandor suave.',
  meta:['canvas','bloom','threshold','additive'],
  prompt:`Recrea un bloom (resplandor HDR) selectivo de postprocesado sobre una escena.
Algoritmo clásico de bloom:
1) Bright-pass / threshold: extrae solo los píxeles cuya luminancia (0.299R+0.587G+0.114B) supera un umbral; el resto a negro. smoothstep(threshold, threshold+knee, lum) para una transición suave.
2) Downsample + blur: reduce esa máscara de brillo a una pirámide de mipmaps y aplica blur gaussiano separable (horizontal + vertical) en cada nivel; sumar los niveles da el halo de tamaño variable.
3) Combine: suma aditivamente el resultado borroso a la escena original: color = scene + bloom*intensity.
Parámetros: threshold (qué brilla), intensity (fuerza del halo), radius/niveles (tamaño del desbordamiento).
En canvas, el blur gaussiano se aproxima con ctx.filter='blur(Npx)' dibujando la capa de brillo en composición 'lighter' (aditiva) sobre la escena. Varios pases de blur de radios crecientes simulan la pirámide.`,
  code:`// Bloom (UnrealBloomPass) idiomático con three / R3F
// npm install @react-three/postprocessing postprocessing
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'

<EffectComposer>
  <Bloom
    intensity={1.4}          // fuerza del halo
    luminanceThreshold={0.7} // bright-pass: qué se considera "brillante"
    luminanceSmoothing={0.3} // knee del umbral
    kernelSize={KernelSize.LARGE}
    mipmapBlur                // pirámide de mipmaps (halo grande y barato)
  />
</EffectComposer>

/* Equivalente del bright-pass en GLSL:
   float l = dot(scene.rgb, vec3(0.299,0.587,0.114));
   vec3 bright = scene.rgb * smoothstep(uThresh, uThresh+uKnee, l);
   // blur(bright) en pirámide -> color = scene + blur*intensity; */`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    // capa de brillo (bright-pass) en su propio canvas
    const bright=document.createElement('canvas');const bxc=bright.getContext('2d');
    function dot(r,g,b){return 0.299*r+0.587*g+0.114*b;}
    function drawScene(ctx,W,H){
      ctx.fillStyle='#05060c';ctx.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2;
      // orbes brillantes que se mueven (fuentes del bloom)
      const orbs=[
        {c:'#7b5cff',a:t*0.9,r:0.30},
        {c:'#00e0c6',a:t*1.3+2.0,r:0.26},
        {c:'#ffffff',a:t*0.5+4.0,r:0.18}
      ];
      orbs.forEach(or=>{
        const ox=cx+Math.cos(or.a)*W*or.r, oy=cy+Math.sin(or.a*1.2)*H*or.r;
        const rad=Math.min(W,H)*0.16;
        const g=ctx.createRadialGradient(ox,oy,0,ox,oy,rad);
        g.addColorStop(0,or.c);g.addColorStop(0.4,or.c);g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(ox,oy,rad,0,6.2832);ctx.fill();
      });
      // líneas tenues (no deben florecer: están por debajo del umbral)
      ctx.strokeStyle='rgba(70,80,120,0.5)';ctx.lineWidth=1;
      for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,H*(i+0.5)/6);ctx.lineTo(W,H*(i+0.5)/6+Math.sin(t+i)*8);ctx.stroke();}
    }
    (function loop(){if(!run)return;t+=0.016;
      const W=o.W(),H=o.H();
      // 1) escena base
      drawScene(x,W,H);
      // 2) bright-pass: extraer solo lo brillante a 'bright'
      bright.width=Math.max(1,W);bright.height=Math.max(1,H);
      bxc.clearRect(0,0,W,H);
      drawScene(bxc,W,H);
      const img=bxc.getImageData(0,0,W,H),dt=img.data;
      const TH=170; // umbral de luminancia (0..255)
      for(let i=0;i<dt.length;i+=4){
        const l=dot(dt[i],dt[i+1],dt[i+2]);
        const k=Math.max(0,Math.min(1,(l-TH)/40)); // smoothstep simple
        dt[i]*=k;dt[i+1]*=k;dt[i+2]*=k;dt[i+3]=255;
      }
      bxc.putImageData(img,0,0);
      // 3) combine aditivo: pirámide de blurs crecientes en 'lighter'
      x.save();
      x.globalCompositeOperation='lighter';
      const passes=[[2,0.5],[6,0.5],[14,0.45],[26,0.35]];
      passes.forEach(p=>{
        x.globalAlpha=p[1];
        x.filter='blur('+p[0]+'px)';
        x.drawImage(bright,0,0,W,H);
      });
      x.filter='none';x.globalAlpha=1;x.globalCompositeOperation='source-over';
      x.restore();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
