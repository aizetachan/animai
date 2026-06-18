import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-wave-image', title:'Wave Image Distortion', cat:'3D / R3F',
  tags:['wave','image','distorsión','codrops','onda','agua','shader'],
  desc:'Una imagen ondula como reflejo en el agua con una onda continua. Wave distortion de Codrops.',
  meta:['shader','wave','Codrops'],
  prompt:`Recrea el "wave image distortion" de Codrops: una imagen que ondula continuamente como si se reflejara en agua en movimiento, desplazando las UV con ondas seno.
En el shader, desplaza uv.x según sin(uv.y*freq + time) y uv.y según sin(uv.x*freq + time) con amplitud pequeña, muestreando la textura distorsionada. Opcional: intensidad reactiva al cursor/scroll.
Para fondos acuáticos o reveals de imagen oníricos.`,
  code:`// Wave image distortion (fragment shader)
void main() {
  vec2 uv = vUv;
  uv.x += sin(uv.y * 10.0 + uTime) * 0.02;
  uv.y += sin(uv.x * 10.0 + uTime * 1.2) * 0.02;
  gl_FragColor = texture2D(tex, uv);
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    function colAt(u,v){const r=Math.round(100+u*120),g=Math.round(60+v*150),b=Math.round(210-u*60);return[r,g,b];}
    (function loop(){if(!run)return;t+=.04;const step=6;for(let yy=0;yy<o.H();yy+=step)for(let xx=0;xx<o.W();xx+=step){let u=xx/o.W(),v=yy/o.H();u+=Math.sin(v*12+t)*.02;v+=Math.sin(u*12+t*1.2)*.02;const[r,g,b]=colAt(u,v);x.fillStyle='rgb('+r+','+g+','+b+')';x.fillRect(xx,yy,step,step);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
