import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-image-distort', title:'Image Hover Distortion', cat:'3D / R3F',
  tags:['imagen','distorsión','hover','displacement','rgb','shader','codrops'],
  desc:'Una imagen se distorsiona con un shader al pasar el cursor. Displacement tipo Codrops.',
  meta:['shader','displacement','Hover'],
  prompt:`Crea una imagen que se distorsiona con un shader al hover (estilo Codrops/displacement).
En el fragment shader, desplaza las coordenadas UV con un mapa de ruido/displacement cuya intensidad crece con el hover y decae al salir. Añade un leve offset RGB para aberración cromática. La distorsión sigue/se concentra en la posición del cursor.
Para galerías y portfolios con factor "wow".`,
  code:`// Image hover distortion (fragment shader)
uniform float uHover;        // 0 -> 1 al pasar el cursor
uniform vec2  uMouse;
void main() {
  float d = distance(vUv, uMouse);
  vec2 disp = (vUv - uMouse) * uHover * 0.3 * smoothstep(0.5, 0.0, d);
  vec2 uv = vUv - disp;
  // aberración cromática
  float r = texture2D(tex, uv + disp*0.1).r;
  float g = texture2D(tex, uv).g;
  float b = texture2D(tex, uv - disp*0.1).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let mx=.5,my=.5,h=0,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=(e.clientX-b.left)/b.width;my=(e.clientY-b.top)/b.height;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.02;h+=((hover?1:0)-h)*.08;if(!hover){mx=.5+Math.cos(a)*.3;my=.5+Math.sin(a*1.3)*.3;}
      const step=7;for(let yy=0;yy<o.H();yy+=step)for(let xx=0;xx<o.W();xx+=step){const u=xx/o.W(),v=yy/o.H();const d=Math.hypot(u-mx,v-my);const k=h*.4*Math.max(0,1-d*2);const du=(u-mx)*k,dv=(v-my)*k;const su=u-du,sv=v-dv;const r=Math.round(120+su*130),g=Math.round(60+sv*160),b=Math.round(210-su*70);x.fillStyle='rgb('+r+','+g+','+b+')';x.fillRect(xx,yy,step,step);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
