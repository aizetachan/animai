import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'noise-grain', title:'Film Grain Shader', cat:'Shaders WebGL',
  tags:['grano','noise','film','textura','overlay','cine'],
  desc:'Grano de película animado sobre un degradado. Capa de textura premium tipo editorial/cine.',
  meta:['WebGL','Hash noise','Overlay'],
  prompt:`Fragment shader WebGL de grano de película (film grain) como capa overlay.
Genera ruido por hash de las coords + u_time (fract(sin(dot)*43758.5)). Mézclalo a baja opacidad sobre el contenido con blend "overlay" o "soft-light".
Da textura analógica a heros editoriales. Mantén el grano fino (no más de 1-2px) y baja densidad en móvil.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec3 base=mix(vec3(.08,.06,.14),vec3(.42,.32,.9),uv.y);base=mix(base,vec3(0.,.8,.72),uv.x*.3);
      float g=h(gl_FragCoord.xy+fract(u_t)*100.);base+=(g-.5)*.18;gl_FragColor=vec4(base,1.);}`);}
};
export default effect;
