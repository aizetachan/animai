import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'metaballs', title:'Liquid Metaballs', cat:'Shaders WebGL',
  tags:['metaballs','blob','líquido','organico'],
  desc:'Bolas líquidas que se fusionan y separan. Ideal como blob detrás de un mockup.',
  meta:['WebGL','SDF / field','GPU'],
  prompt:`Crea metaballs 2D en un fragment shader WebGL.
Define 3-4 puntos que orbitan con u_time; suma su campo 1/dist2 y aplica threshold suave (smoothstep) para el borde líquido.
Color con gradiente de marca y leve glow. Úsalo como blob ambiental detrás de un mockup.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=(gl_FragCoord.xy/u_res.xy-.5);uv.x*=u_res.x/u_res.y;float t=u_t;
      vec2 p1=vec2(sin(t*.7)*.3,cos(t*.5)*.25),p2=vec2(cos(t*.4)*.32,sin(t*.6)*.3),p3=vec2(sin(t*.9+1.)*.28,cos(t*.3+2.)*.22);
      float m=.02/dot(uv-p1,uv-p1)+.018/dot(uv-p2,uv-p2)+.016/dot(uv-p3,uv-p3);
      float e=smoothstep(.8,1.6,m);
      vec3 col=mix(vec3(.05,.04,.10),mix(vec3(.48,.36,1.),vec3(0.,.88,.78),uv.y+.5),e);col+=e*.15;gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
