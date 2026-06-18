import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-smoke', title:'Smoke', cat:'Shaders WebGL',
  tags:['humo','smoke','tinta','ink','fbm','advección','noise'],
  desc:'Humo/tinta ascendente por advección de ruido fractal. Fondo etéreo para hero o secciones moody.',
  meta:['WebGL','fbm noise','60fps'],
  prompt:`Fragment shader WebGL de humo/tinta procedural.
Técnica: domain warping sobre fbm (ruido fractal de varias octavas). Desplaza el dominio hacia arriba con u_time (advección) y aplica un warp con un segundo fbm para simular las volutas turbulentas del humo.
Algoritmo: p = uv; q = vec2(fbm(p + t*subida), fbm(p + offset)); density = fbm(p + warp*q + t). Atenúa por una columna vertical (gaussiana en x) y desvanece arriba. Mapea la densidad de negro a gris/blanco humeante con un tinte frío (#7b5cff / #00e0c6).
Parámetros: velocidad de ascenso, escala del warp, número de octavas.`,
  code:`// Fragment (GLSL ES 1.0) — usar con shaderPreview(el, frag)
// El runtime ya inyecta: precision highp float; uniform vec2 u_res; uniform float u_t;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy; uv.x*=u_res.x/u_res.y;
  float t=u_t*.35;
  vec2 p=uv*3.0;
  // advección ascendente
  p.y-=t*1.6;
  // domain warp turbulento
  vec2 q=vec2(fbm(p+vec2(0.,t)), fbm(p+vec2(5.2,1.3-t)));
  vec2 r=vec2(fbm(p+4.0*q+vec2(1.7,9.2)+t*.5), fbm(p+4.0*q+vec2(8.3,2.8)));
  float d=fbm(p+4.0*r);
  // columna de humo
  float col_mask=exp(-pow((uv.x-0.5)*3.0,2.0));
  float rise=smoothstep(0.0,0.35,gl_FragCoord.y/u_res.y)*smoothstep(1.0,0.45,gl_FragCoord.y/u_res.y);
  float density=clamp(d*1.6-0.25,0.0,1.0)*col_mask*(0.5+0.6*rise);
  vec3 smoke=mix(vec3(0.48,0.36,1.0),vec3(0.0,0.88,0.78),smoothstep(0.3,0.9,d));
  vec3 col=mix(vec3(0.02,0.02,0.04), smoke*1.1, density);
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.02;a*=.5;}return v;}
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy; uv.x*=u_res.x/u_res.y;
      float t=u_t*.35;
      vec2 p=uv*3.0;
      p.y-=t*1.6;
      vec2 q=vec2(fbm(p+vec2(0.,t)), fbm(p+vec2(5.2,1.3-t)));
      vec2 r=vec2(fbm(p+4.0*q+vec2(1.7,9.2)+t*.5), fbm(p+4.0*q+vec2(8.3,2.8)));
      float d=fbm(p+4.0*r);
      float col_mask=exp(-pow((uv.x-0.5)*3.0,2.0));
      float yy=gl_FragCoord.y/u_res.y;
      float rise=smoothstep(0.0,0.35,yy)*smoothstep(1.0,0.45,yy);
      float density=clamp(d*1.6-0.25,0.0,1.0)*col_mask*(0.5+0.6*rise);
      vec3 smoke=mix(vec3(0.48,0.36,1.0),vec3(0.0,0.88,0.78),smoothstep(0.3,0.9,d));
      vec3 col=mix(vec3(0.02,0.02,0.04), smoke*1.1, density);
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
