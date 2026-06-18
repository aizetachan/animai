import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-anamorphic', title:'Anamorphic Streak', cat:'Postprocesado',
  tags:['anamorphic','streak','bloom','horizontal','flare','blur','postprocessing'],
  desc:'Estelas horizontales anamórficas (azuladas) que brotan de los puntos más brillantes de la escena.',
  meta:['canvas','anamorphic','bloom','horizontal-blur'],
  prompt:`Implementa el flare anamórfico de postprocesado: las luces más brillantes de la escena generan una estela horizontal larga y azulada (efecto típico de lentes anamórficas de cine).
Pipeline: (1) threshold/luminance pass — extraer solo los píxeles por encima de un umbral; (2) blur direccional SOLO en el eje X (separable), con un kernel ancho (p.ej. 9-13 taps) y varios mips para alargar la estela; (3) tintar la estela en azul (multiplicar por un color tipo vec3(0.4,0.6,1.0)); (4) sumar additivamente sobre la escena original.
GLSL del blur horizontal: se suma texture2D(tBright, uv + vec2(texel.x*float(i)*spread, 0.0)) * weight[i] para i en [-N,N]; los pesos son gaussianos. Parámetros: threshold, spread (largo de la estela), tint, intensidad, número de taps. Para más realismo se hace en varias resoluciones (mip down) y se acumula.`,
  code:`// Anamorphic streak — blur horizontal separable sobre el bright-pass
// uniform sampler2D tBright;  // threshold pass
uniform vec2  uTexel;     // 1.0 / resolution
uniform float uSpread;    // 4.0  (largo de la estela)
uniform vec3  uTint;      // vec3(0.4, 0.6, 1.0)
uniform float uIntensity; // 1.6

vec3 anamorphicStreak(vec2 uv){
  float w[9];
  w[0]=0.05; w[1]=0.09; w[2]=0.12; w[3]=0.15; w[4]=0.18;
  w[5]=0.15; w[6]=0.12; w[7]=0.09; w[8]=0.05;
  vec3 sum = vec3(0.0);
  for(int i=0;i<9;i++){
    float off = float(i-4) * uTexel.x * uSpread;
    sum += texture2D(tBright, uv + vec2(off, 0.0)).rgb * w[i];
  }
  return sum * uTint * uIntensity;
}
// gl_FragColor = vec4(scene + anamorphicStreak(uv), 1.0);
// (encadenar 2-3 pasadas con uSpread creciente alarga la estela)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    // puntos brillantes de la "escena"
    const pts=[];for(let i=0;i<6;i++)pts.push({bx:Math.random(),by:0.2+Math.random()*0.6,ph:Math.random()*6.28,sp:0.3+Math.random()*0.5,r:2+Math.random()*3});
    (function loop(){if(!run)return;t+=.014;
      const W=o.W(),H=o.H();
      x.fillStyle='#06060d';x.fillRect(0,0,W,H);
      x.globalCompositeOperation='lighter';
      pts.forEach(p=>{
        const px=(p.bx*0.6+0.2+Math.sin(t*p.sp+p.ph)*0.12)*W;
        const py=p.by*H;
        const pulse=0.6+0.4*Math.sin(t*2.0+p.ph);
        const len=W*(0.42+0.18*pulse); // largo de la estela anamórfica
        // estela horizontal azulada (gradiente que se desvanece a ambos lados)
        const lg=x.createLinearGradient(px-len,py,px+len,py);
        lg.addColorStop(0,'rgba(60,120,255,0)');
        lg.addColorStop(0.5,'rgba(120,180,255,'+(0.45*pulse)+')');
        lg.addColorStop(1,'rgba(60,120,255,0)');
        x.fillStyle=lg;
        const th=3.0+2.0*pulse; // grosor fino
        x.fillRect(px-len,py-th/2,len*2,th);
        // segunda pasada más estrecha y brillante (mip acumulado)
        const lg2=x.createLinearGradient(px-len*0.5,py,px+len*0.5,py);
        lg2.addColorStop(0,'rgba(180,210,255,0)');
        lg2.addColorStop(0.5,'rgba(220,235,255,'+(0.5*pulse)+')');
        lg2.addColorStop(1,'rgba(180,210,255,0)');
        x.fillStyle=lg2;x.fillRect(px-len*0.5,py-1.0,len,2.0);
        // núcleo brillante del punto
        const cg=x.createRadialGradient(px,py,0,px,py,p.r*2.2);
        cg.addColorStop(0,'rgba(255,255,255,'+pulse+')');
        cg.addColorStop(0.5,'rgba(123,92,255,'+(0.5*pulse)+')');
        cg.addColorStop(1,'rgba(0,224,198,0)');
        x.fillStyle=cg;x.beginPath();x.arc(px,py,p.r*2.2,0,6.2832);x.fill();
      });
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
