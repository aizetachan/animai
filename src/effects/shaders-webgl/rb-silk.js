import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-silk', title:'Silk', cat:'Shaders WebGL',
  tags:['silk','seda','tela','onda','react bits','suave','fondo'],
  desc:'Ondas de seda que fluyen suavemente, como tela mecida por el viento. Fondo sedoso de React Bits.',
  meta:['WebGL','flow','React Bits'],
  prompt:`Fragment shader tipo "Silk" (React Bits): un patrón de ondas suaves y entrelazadas que fluyen lentamente como seda mecida, con un sutil brillo direccional.
Combina varias funciones seno desfasadas sobre las UV desplazadas con el tiempo para crear pliegues de tela; ilumina las crestas. Tono monocromo elegante.
Fondo premium, calmado y sofisticado para marcas de lujo o portfolios.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;uv.x*=u_res.x/u_res.y;
      float t=u_t*.4;float v=0.;
      v+=sin((uv.x+uv.y)*4.+t);v+=sin((uv.x-uv.y)*5.-t*.8);v+=sin(uv.y*6.+t*.6);
      v=v/3.;float sh=.5+.5*sin(v*3.14159+t);
      vec3 a=vec3(.16,.12,.28),b=vec3(.55,.45,.85);vec3 col=mix(a,b,sh);
      col+=pow(sh,4.)*.3;gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
