import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-voronoi', title:'Voronoi Cells', cat:'Shaders WebGL',
  tags:['voronoi','células','shader','orgánico','red','cristal'],
  desc:'Patrón de células Voronoi animadas. Textura orgánica tipo cristal, piel o red celular.',
  meta:['WebGL','Voronoi','Procedural'],
  prompt:`Fragment shader WebGL de Voronoi animado.
Genera puntos semilla en una rejilla con offset por hash; para cada píxel calcula la distancia a la semilla más cercana y dibuja bordes de célula (distancia entre las dos más cercanas).
Anima los puntos con u_time. Estética orgánica: cristal, células, redes. Colorea por ID de célula.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    vec2 hash(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5);}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;uv.x*=u_res.x/u_res.y;uv*=5.;
      vec2 g=floor(uv),f=fract(uv);float md=8.;vec2 mc;
      for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 o=vec2(float(x),float(y));vec2 p=hash(g+o);p=.5+.5*sin(u_t+6.28*p);float d=length(o+p-f);if(d<md){md=d;mc=g+o;}}
      vec3 a=vec3(.48,.36,1.),b=vec3(0.,.88,.78);vec3 col=mix(a,b,fract(sin(dot(mc,vec2(12.9,78.2)))*43758.5));
      col*=.4+.6*md;col+=smoothstep(.05,0.,md)*.5;gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
