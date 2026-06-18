import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-gyroid', title:'Gyroid Slice', cat:'Shaders WebGL',
  tags:['gyroid','TPMS','isosuperficie','slice','procedural','geométrico','3d'],
  desc:'Corte animado de una superficie gyroid (TPMS). Patrón laberíntico orgánico para fondos tech.',
  meta:['WebGL','isosurface','60fps'],
  prompt:`Fragment shader WebGL que dibuja un corte (slice) de una superficie gyroid.
Definición: la gyroid es una superficie mínima triplemente periódica (TPMS) g = sin(x)cos(y)+sin(y)cos(z)+sin(z)cos(x). Tomamos un plano z = f(u_time) y evaluamos g sobre la rejilla 2D (x,y), animando z para "atravesar" el sólido.
Algoritmo: x=uv.x*freq, y=uv.y*freq, z=u_time*vel; valor = sin(x)cos(y)+sin(y)cos(z)+sin(z)cos(x); dibuja las líneas de iso-valor con abs(g) y smoothstep para grosor, y colorea con cosine-palette de marca (#7b5cff / #00e0c6).
Parámetros: frecuencia espacial, velocidad del corte, grosor de línea.`,
  code:`// Fragment (GLSL ES 1.0) — usar con shaderPreview(el, frag)
// Runtime inyecta: precision highp float; uniform vec2 u_res; uniform float u_t;
vec3 pal(float t){return 0.5+0.5*cos(6.28318*(vec3(1.0)*t+vec3(0.0,0.33,0.67)));}
void main(){
  vec2 uv=(gl_FragCoord.xy/u_res.xy-0.5);
  uv.x*=u_res.x/u_res.y;
  float freq=9.0;
  // ligera rotación para que el corte derive
  float a=u_t*0.08; mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));
  vec2 p=R*uv*freq;
  float x=p.x, y=p.y, z=u_t*0.7;
  float g=sin(x)*cos(y)+sin(y)*cos(z)+sin(z)*cos(x);
  // líneas de iso-valor
  float line=smoothstep(0.06,0.0,abs(g));
  // relleno suave por bandas
  float band=0.5+0.5*sin(g*3.0+u_t*0.5);
  vec3 base=pal(0.55+g*0.12+u_t*0.03)*0.5;
  vec3 col=base*(0.3+0.7*band);
  col+=vec3(0.48,0.36,1.0)*line*0.9;
  col+=vec3(0.0,0.88,0.78)*smoothstep(0.10,0.0,abs(g-1.0))*0.5;
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    vec3 pal(float t){return 0.5+0.5*cos(6.28318*(vec3(1.0)*t+vec3(0.0,0.33,0.67)));}
    void main(){
      vec2 uv=(gl_FragCoord.xy/u_res.xy-0.5);
      uv.x*=u_res.x/u_res.y;
      float freq=9.0;
      float a=u_t*0.08; mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));
      vec2 p=R*uv*freq;
      float x=p.x, y=p.y, z=u_t*0.7;
      float g=sin(x)*cos(y)+sin(y)*cos(z)+sin(z)*cos(x);
      float line=smoothstep(0.06,0.0,abs(g));
      float band=0.5+0.5*sin(g*3.0+u_t*0.5);
      vec3 base=pal(0.55+g*0.12+u_t*0.03)*0.5;
      vec3 col=base*(0.3+0.7*band);
      col+=vec3(0.48,0.36,1.0)*line*0.9;
      col+=vec3(0.0,0.88,0.78)*smoothstep(0.10,0.0,abs(g-1.0))*0.5;
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
