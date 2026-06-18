import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'plasma', title:'Plasma Flow', cat:'Shaders WebGL',
  tags:['plasma','psicodélico','retro','fondo','energía'],
  desc:'Plasma orgánico de alto contraste. Energía para páginas de producto, música o gaming.',
  meta:['WebGL','Sin librerías','60fps'],
  prompt:`Fragment shader WebGL de "plasma" para un fondo de sección.
Suma varias ondas seno desfasadas moduladas por u_time y mapea con un cosine-palette (Inigo Quilez).
Estética energética para producto/música/gaming. Expón un uniform de intensidad.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    vec3 pal(float t){return .5+.5*cos(6.28318*(vec3(1.)*t+vec3(.0,.33,.67)));}
    void main(){vec2 uv=(gl_FragCoord.xy/u_res.xy-.5);uv.x*=u_res.x/u_res.y;float t=u_t*.6;
      float v=sin(uv.x*8.+t)+sin(uv.y*8.-t)+sin((uv.x+uv.y)*6.+t)+sin(length(uv)*12.-t*1.5);
      vec3 col=pal(v*.15+.5+t*.05);col*=.6+.4*smoothstep(0.,1.,1.-length(uv));gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
