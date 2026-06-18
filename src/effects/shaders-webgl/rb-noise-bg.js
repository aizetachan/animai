import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-noise-bg', title:'Animated Noise', cat:'Shaders WebGL',
  tags:['noise','ruido','grano','tv','react bits','estática','textura'],
  desc:'Ruido animado tipo estática de TV, sutil sobre un color. Textura de grano vivo de React Bits.',
  meta:['WebGL','noise','Textura'],
  prompt:`Fragment shader de ruido animado (estática de TV / grano de película) que se puede usar a baja opacidad sobre cualquier fondo para darle textura analógica.
Genera ruido aleatorio por píxel y por frame (hash con el tiempo). Para grano sutil, mézclalo a baja opacidad sobre un color base; subido, da estática total de TV.
Capa de textura premium para evitar el aspecto "plano digital".`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    void main(){vec2 uv=gl_FragCoord.xy;
      float n=hash(uv+fract(u_t)*100.);
      vec3 base=mix(vec3(.05,.05,.1),vec3(.16,.12,.28),gl_FragCoord.y/u_res.y);
      vec3 col=base+(n-.5)*.25;gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
