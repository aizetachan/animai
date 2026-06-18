import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tunnel', title:'Hyperspace Tunnel', cat:'Shaders WebGL',
  tags:['túnel','velocidad','viaje','3d','inmersivo','loader'],
  desc:'Túnel infinito que da sensación de velocidad. Loaders, transiciones o secciones "launch".',
  meta:['WebGL','Polar coords','Inmersivo'],
  prompt:`Crea un túnel hiperespacial en fragment shader WebGL.
Pasa el UV a coordenadas polares; usa 1/radio como profundidad y avanza con u_time. Pinta anillos/rayas con fract().
Gradiente azulado-violeta. Perfecto para loaders o transiciones de página tipo "launch".`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=(gl_FragCoord.xy/u_res.xy-.5);uv.x*=u_res.x/u_res.y;float a=atan(uv.y,uv.x),r=length(uv);
      float depth=.3/r+u_t*.6;float rings=smoothstep(.4,.5,fract(depth*1.5));float spokes=smoothstep(.3,.5,fract(a/6.28318*16.+depth));
      float v=max(rings*.7,spokes*.5)*smoothstep(0.,.5,r);vec3 col=mix(vec3(.02,.02,.06),vec3(.5,.4,1.),v);col+=v*vec3(0.,.5,.5)*.5;gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
