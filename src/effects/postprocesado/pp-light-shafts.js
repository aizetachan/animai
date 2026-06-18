import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-light-shafts', title:'Light Shafts', cat:'Postprocesado',
  tags:['light shafts','god rays','volumetric','scattering','luz','rayos','postprocessing'],
  desc:'Rayos de luz volumétricos (god rays) que se dispersan radialmente desde una fuente sobre la escena.',
  meta:['canvas','volumetric','god-rays','radial-blur'],
  prompt:`Implementa dispersión de luz volumétrica 2D (volumetric light scattering / god rays) tipo postprocesado.
Técnica del paper de GPU Gems: a partir del punto de la fuente de luz en pantalla (sx, sy), se hace un radial blur acumulativo muestreando la escena a lo largo del vector que va de cada píxel hacia la fuente.
Algoritmo por píxel: vec2 dir = (lightPos - uv); se dan N pasos (p.ej. 32) avanzando uv += dir * density / N; en cada paso se suma la luminancia de la escena multiplicada por un decay^i (decay ~0.95) y se acumula; resultado *= exposure (~0.3). El brillo decae con la distancia a la fuente.
En 2D/canvas se aproxima dibujando la fuente como gradiente radial brillante y proyectando "haces" (líneas/sectores) que se atenúan con la distancia, modulados por oclusores (siluetas oscuras que recortan los rayos). Parámetros clave: density, weight, decay, exposure, número de samples y posición de la fuente animada.`,
  code:`// Volumetric light scattering (god rays) — fragment GLSL idiomático
// uniform sampler2D tScene; uniform vec2 uLightPos; (en clip 0..1)
uniform float uDensity;  // 0.9
uniform float uWeight;   // 0.4
uniform float uDecay;    // 0.95
uniform float uExposure; // 0.3
const int SAMPLES = 32;

vec3 godRays(vec2 uv){
  vec2 delta = (uv - uLightPos) * uDensity / float(SAMPLES);
  vec2 pos = uv;
  float illum = 1.0;
  vec3 acc = texture2D(tScene, uv).rgb;
  for(int i=0;i<SAMPLES;i++){
    pos -= delta;
    vec3 s = texture2D(tScene, pos).rgb;
    s *= illum * uWeight;
    acc += s;
    illum *= uDecay;
  }
  return acc * uExposure;
}
// gl_FragColor = vec4(scene + godRays(uv), 1.0);`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.012;
      const W=o.W(),H=o.H();
      // fuente de luz animada en la parte superior
      const lx=W*(0.5+Math.sin(t*0.7)*0.32), ly=H*0.18;
      // fondo escena
      x.fillStyle='#06060e';x.fillRect(0,0,W,H);
      // halo de la fuente
      x.globalCompositeOperation='lighter';
      let g=x.createRadialGradient(lx,ly,0,lx,ly,Math.max(W,H)*0.7);
      g.addColorStop(0,'rgba(255,250,220,0.95)');
      g.addColorStop(0.12,'rgba(123,92,255,0.5)');
      g.addColorStop(0.5,'rgba(0,224,198,0.12)');
      g.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=g;x.fillRect(0,0,W,H);
      // haces radiales (god rays) con oclusores que los recortan
      const rays=26;
      for(let i=0;i<rays;i++){
        const a=(i/rays)*Math.PI*2;
        // oclusión animada: algunos haces parpadean (simula objetos que bloquean)
        const occ=0.4+0.6*Math.pow(Math.abs(Math.sin(a*2.0+t*0.9)),2.0);
        const len=Math.max(W,H)*1.1;
        const ex=lx+Math.cos(a)*len, ey=ly+Math.sin(a)*len;
        const lg=x.createLinearGradient(lx,ly,ex,ey);
        const hue=i%2? 'rgba(0,224,198,':'rgba(123,92,255,';
        lg.addColorStop(0,'rgba(255,250,230,'+(0.22*occ)+')');
        lg.addColorStop(0.3,hue+(0.10*occ)+')');
        lg.addColorStop(1,'rgba(0,0,0,0)');
        x.strokeStyle=lg;
        x.lineWidth=2+Math.sin(a*3.0+t)* 1.5+2.0;
        x.beginPath();x.moveTo(lx,ly);x.lineTo(ex,ey);x.stroke();
      }
      // núcleo brillante
      let core=x.createRadialGradient(lx,ly,0,lx,ly,Math.min(W,H)*0.12);
      core.addColorStop(0,'rgba(255,255,255,1)');
      core.addColorStop(1,'rgba(255,255,255,0)');
      x.fillStyle=core;x.beginPath();x.arc(lx,ly,Math.min(W,H)*0.12,0,6.2832);x.fill();
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
