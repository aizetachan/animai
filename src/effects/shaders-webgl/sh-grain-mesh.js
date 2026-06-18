import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-grain-mesh', title:'Grain Gradient Mesh', cat:'Shaders WebGL',
  tags:['grain','grano','ruido','gradiente','agencia','textura','fondo'],
  desc:'Gradiente mesh con grano de película encima. El fondo granulado de agencia 2026.',
  meta:['WebGL','grain','Fondo'],
  prompt:`Fragment shader de gradiente suave con grano de película superpuesto (el look de agencia/editorial 2026).
Genera un gradiente mesh de marca y añade ruido de alta frecuencia (grain) animado por frame con baja opacidad encima. El grano evita el banding y da textura analógica premium.
Fondo elegante para portfolios y marcas de moda/cultura.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec3 c1=vec3(.42,.30,.95),c2=vec3(0.,.82,.72),c3=vec3(1.,.36,.66);
      float m=sin(uv.x*2.+u_t*.3)*.5+.5;vec3 g=mix(c1,c2,uv.y);g=mix(g,c3,m*.4);
      float grain=hash(uv*u_res.xy+u_t*60.);g+=(grain-.5)*.12;
      gl_FragColor=vec4(g,1.);}`);}
};
export default effect;
