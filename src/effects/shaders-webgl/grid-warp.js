import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'grid-warp', title:'Warped Grid', cat:'Shaders WebGL',
  tags:['grid','rejilla','tech','warp','distorsión','saas'],
  desc:'Rejilla infinita que ondula como una membrana. Estética techy / SaaS / dev tools.',
  meta:['WebGL','Procedural','Loop infinito'],
  prompt:`Fragment shader WebGL: rejilla infinita en perspectiva que ondula.
Genera líneas con fract() del UV escalado; desplaza el UV con una onda seno dependiente de u_time.
Atenúa hacia el horizonte (fog) para falsa profundidad 3D. Ideal para fondos de SaaS / dev tools.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=(gl_FragCoord.xy/u_res.xy-.5);uv.x*=u_res.x/u_res.y;float t=u_t;
      uv.y+=sin(uv.x*4.+t)*.06;uv.x+=cos(uv.y*4.+t*.8)*.04;
      vec2 g=abs(fract(uv*9.)-.5);float line=smoothstep(.0,.06,min(g.x,g.y));float fog=smoothstep(.7,0.,length(uv));
      vec3 col=mix(vec3(.04,.04,.08),vec3(.48,.36,1.),(1.-line)*fog);col+=(1.-line)*fog*vec3(0.,.4,.4);gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
