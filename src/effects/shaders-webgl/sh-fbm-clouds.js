import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-fbm-clouds', title:'FBM Clouds', cat:'Shaders WebGL',
  tags:['nubes','clouds','fbm','noise','fractal','cielo','sky'],
  desc:'Nubes de ruido fractal que se desplazan suavemente. Fondo de cielo procedural para heros y headers.',
  meta:['WebGL','fbm noise','60fps'],
  prompt:`Fragment shader WebGL de nubes con ruido fractal (fbm).
Técnica: fbm de varias octavas de value-noise. Desplaza el dominio con u_time para que las nubes deriven horizontalmente y mezcla dos capas a distinta escala/velocidad (parallax) para dar profundidad.
Algoritmo: c = fbm(uv*scale + vec2(t,0)); aplica smoothstep para definir bordes de nube y compón sobre un gradiente de cielo. Tinte de marca opcional (#7b5cff / #00e0c6).
Parámetros: escala de nubes, velocidad del viento, cobertura (umbral del smoothstep), octavas.`,
  code:`// Fragment (GLSL ES 1.0) — usar con shaderPreview(el, frag)
// Runtime inyecta: precision highp float; uniform vec2 u_res; uniform float u_t;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.0+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy; uv.x*=u_res.x/u_res.y;
  float t=u_t*0.04;
  // gradiente de cielo
  vec3 sky=mix(vec3(0.05,0.04,0.12), vec3(0.18,0.12,0.32), uv.y);
  sky=mix(sky, vec3(0.0,0.25,0.30), smoothstep(0.6,1.0,uv.y)*0.4);
  // capa lejana
  float far=fbm(uv*3.0+vec2(t*1.0,0.0));
  // capa cercana (más rápida)
  float near=fbm(uv*5.0+vec2(t*2.4,t*0.3));
  float clouds=mix(far,near,0.5);
  float coverage=smoothstep(0.45,0.85,clouds);
  vec3 cloudCol=mix(vec3(0.55,0.50,0.80), vec3(0.95,0.97,1.0), smoothstep(0.5,1.0,clouds));
  cloudCol=mix(cloudCol, vec3(0.0,0.88,0.78), smoothstep(0.8,1.0,clouds)*0.25);
  vec3 col=mix(sky, cloudCol, coverage);
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.0+vec2(1.7,9.2);a*=.5;}return v;}
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy; uv.x*=u_res.x/u_res.y;
      float t=u_t*0.04;
      vec3 sky=mix(vec3(0.05,0.04,0.12), vec3(0.18,0.12,0.32), uv.y);
      sky=mix(sky, vec3(0.0,0.25,0.30), smoothstep(0.6,1.0,uv.y)*0.4);
      float far=fbm(uv*3.0+vec2(t*1.0,0.0));
      float near=fbm(uv*5.0+vec2(t*2.4,t*0.3));
      float clouds=mix(far,near,0.5);
      float coverage=smoothstep(0.45,0.85,clouds);
      vec3 cloudCol=mix(vec3(0.55,0.50,0.80), vec3(0.95,0.97,1.0), smoothstep(0.5,1.0,clouds));
      cloudCol=mix(cloudCol, vec3(0.0,0.88,0.78), smoothstep(0.8,1.0,clouds)*0.25);
      vec3 col=mix(sky, cloudCol, coverage);
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
