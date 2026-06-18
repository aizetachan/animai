import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-lens-flare', title:'Lens Flare', cat:'Postprocesado',
  tags:['lens flare','destello','halo','ghosts','estrella','óptica','postprocessing'],
  desc:'Destello de lente con halos fantasma, anillos y estrella anamórfica que sigue una fuente en movimiento.',
  meta:['canvas','lens-flare','ghosts','starburst'],
  prompt:`Recrea un lens flare óptico de postprocesado a partir de una fuente brillante en pantalla (lightPos en 0..1).
Componentes: (1) núcleo brillante con glow radial; (2) ghosts/fantasmas: copias del destello distribuidas a lo largo de la línea que une la fuente con el centro de la pantalla. Cada ghost i se coloca en pos = center + (lightPos-center) * (-scaleStep*i), con tamaño y color variables (dispersión cromática); (3) halo: anillo grande centrado cerca del centro con tinte iridiscente; (4) starburst/estrella: rayos finos radiales desde el núcleo, rotando levemente; (5) un destello horizontal anamórfico.
Técnica GLSL: ghosts se muestrean repitiendo la escena umbralizada (threshold) a lo largo del vector haloVec = (0.5 - texcoord) * uGhostDispersal, sumando texture2D en texcoord + haloVec*float(i). Parámetros: número de ghosts, ghostDispersal, haloWidth, distortion cromática (offset por canal RGB), intensidad. La intensidad global decae si la fuente se aleja del borde/centro.`,
  code:`// Lens flare ghosts + halo — fragment GLSL idiomático
// uniform sampler2D tThreshold;   // escena umbralizada (solo brillos)
uniform int   uGhosts;        // 6
uniform float uGhostDispersal;// 0.4
uniform float uHaloWidth;     // 0.45
uniform vec3  uDistortion;    // (-0.01, 0.0, 0.01) dispersión cromática

vec3 sampleChroma(vec2 uv, vec2 dir){
  return vec3(
    texture2D(tThreshold, uv + dir*uDistortion.r).r,
    texture2D(tThreshold, uv + dir*uDistortion.g).g,
    texture2D(tThreshold, uv + dir*uDistortion.b).b
  );
}
vec3 lensFlare(vec2 uv){
  vec2 texcoord = 1.0 - uv;            // invertir hacia el centro opuesto
  vec2 ghostVec = (vec2(0.5) - texcoord) * uGhostDispersal;
  vec2 dir = normalize(ghostVec);
  vec3 result = vec3(0.0);
  for(int i=0;i<8;i++){
    if(i>=uGhosts) break;
    vec2 offset = fract(texcoord + ghostVec * float(i));
    float w = pow(1.0 - length(vec2(0.5)-offset)/0.7071, 8.0);
    result += sampleChroma(offset, dir) * w;
  }
  // halo
  vec2 haloVec = dir * uHaloWidth;
  float d = abs(length(vec2(0.5)-fract(texcoord+haloVec)) - uHaloWidth);
  float hw = pow(1.0 - d/uHaloWidth, 5.0);
  result += sampleChroma(fract(texcoord+haloVec), dir) * hw;
  return result;
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    function star(cx,cy,r,rot,spokes,col,w){
      x.save();x.translate(cx,cy);x.rotate(rot);x.strokeStyle=col;x.lineWidth=w;
      for(let i=0;i<spokes;i++){const a=(i/spokes)*Math.PI*2;const lr=r*(0.4+(i%2?0.6:0.25));
        x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(a)*lr,Math.sin(a)*lr);x.stroke();}
      x.restore();
    }
    (function loop(){if(!run)return;t+=.012;
      const W=o.W(),H=o.H(),cx=W/2,cy=H/2;
      // fuente que se mueve
      const lx=cx+Math.cos(t*0.6)*W*0.34, ly=cy+Math.sin(t*0.9)*H*0.3;
      x.fillStyle='#070710';x.fillRect(0,0,W,H);
      x.globalCompositeOperation='lighter';
      // estrellas de fondo sutiles
      for(let i=0;i<24;i++){const sx=(Math.sin(i*12.9)*0.5+0.5)*W,sy=(Math.cos(i*78.2)*0.5+0.5)*H;x.fillStyle='rgba(180,190,220,'+(0.15+0.15*Math.sin(t*2+i))+')';x.fillRect(sx,sy,1.4,1.4);}
      // glow núcleo
      let g=x.createRadialGradient(lx,ly,0,lx,ly,Math.min(W,H)*0.45);
      g.addColorStop(0,'rgba(255,250,235,0.95)');
      g.addColorStop(0.2,'rgba(123,92,255,0.4)');
      g.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=g;x.fillRect(0,0,W,H);
      // estela anamórfica horizontal en el núcleo
      let an=x.createLinearGradient(0,ly,W,ly);
      an.addColorStop(0,'rgba(0,224,198,0)');an.addColorStop(0.5,'rgba(120,200,255,0.55)');an.addColorStop(1,'rgba(0,224,198,0)');
      x.fillStyle=an;x.fillRect(0,ly-1.2,W,2.4);
      // starburst
      star(lx,ly,Math.min(W,H)*0.4,t*0.3,16,'rgba(255,245,220,0.5)',1.0);
      // ghosts a lo largo de la línea fuente->centro
      const ghosts=7;const dx=cx-lx,dy=cy-ly;
      const cols=['255,120,120','120,255,180','120,180,255','255,220,120','180,120,255','120,255,255','255,160,200'];
      for(let i=1;i<=ghosts;i++){
        const f=(i/ghosts)*1.6-0.2; // pasando por el centro y más allá
        const gx=lx+dx*f, gy=ly+dy*f;
        const r=Math.min(W,H)*(0.02+0.05*(i%3));
        let gg=x.createRadialGradient(gx,gy,0,gx,gy,r);
        gg.addColorStop(0,'rgba('+cols[i-1]+',0.35)');
        gg.addColorStop(0.6,'rgba('+cols[i-1]+',0.12)');
        gg.addColorStop(1,'rgba(0,0,0,0)');
        x.fillStyle=gg;x.beginPath();x.arc(gx,gy,r,0,6.2832);x.fill();
        // anillos finos en algunos ghosts
        if(i%2===0){x.strokeStyle='rgba('+cols[i-1]+',0.2)';x.lineWidth=1.5;x.beginPath();x.arc(gx,gy,r*0.85,0,6.2832);x.stroke();}
      }
      // halo iridiscente centrado
      const hr=Math.min(W,H)*0.42;
      let ring=x.createRadialGradient(cx,cy,hr*0.78,cx,cy,hr);
      ring.addColorStop(0,'rgba(0,0,0,0)');
      ring.addColorStop(0.5,'rgba(123,92,255,0.12)');
      ring.addColorStop(0.7,'rgba(0,224,198,0.12)');
      ring.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=ring;x.beginPath();x.arc(cx,cy,hr,0,6.2832);x.fill();
      // núcleo blanco
      let c=x.createRadialGradient(lx,ly,0,lx,ly,Math.min(W,H)*0.06);
      c.addColorStop(0,'rgba(255,255,255,1)');c.addColorStop(1,'rgba(255,255,255,0)');
      x.fillStyle=c;x.beginPath();x.arc(lx,ly,Math.min(W,H)*0.06,0,6.2832);x.fill();
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
