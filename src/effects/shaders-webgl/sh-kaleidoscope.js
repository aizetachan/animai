import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-kaleidoscope', title:'Kaleidoscope', cat:'Shaders WebGL',
  tags:['kaleidoscope','caleidoscopio','espejos','simetría','polar','psicodélico'],
  desc:'Caleidoscopio por pliegue de espejos en el ángulo polar sobre un patrón animado.',
  meta:['WebGL','Sin librerías','60fps'],
  prompt:`Fragment shader WebGL de "caleidoscopio".
Técnica: convierte la coordenada centrada a polares (a = atan(y,x), r = length). Pliega el ángulo en N sectores:
sect = TAU/N; a = mod(a, sect); a = abs(a - sect*0.5) (reflexión = efecto espejo).
Reconstruye xy = r*vec2(cos,sin) y muéstrea un patrón procedural animado (ondas seno + ruido) con rotación lenta por u_t.
La repetición angular + reflexión produce la simetría radial clásica del caleidoscopio. Mapea con paleta cosine.
Parámetros: número de espejos N, velocidad de rotación, escala del patrón.`,
  code:`// GLSL ES 1.0 fragment (uniforms u_res, u_t provistos)
#define TAU 6.28318530718
vec3 pal(float t){ return 0.5+0.5*cos(TAU*(t+vec3(0.0,0.33,0.67))); }
float pattern(vec2 p){
  float v=sin(p.x*6.0)+sin(p.y*6.0)+sin(length(p)*8.0);
  return v;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
  float a=atan(uv.y,uv.x);
  float r=length(uv);
  float N=8.0;
  float sect=TAU/N;
  a=mod(a,sect);
  a=abs(a-sect*0.5);          // pliegue / espejo
  a+=u_t*0.2;                 // rotación lenta
  vec2 p=r*vec2(cos(a),sin(a))*5.0;
  float t=u_t*0.5;
  float v=pattern(p+vec2(t,-t))+pattern(p*1.7-vec2(t));
  vec3 col=pal(v*0.12+r*0.6+t*0.1);
  col*=0.7+0.5*smoothstep(1.0,0.0,r);
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    #define TAU 6.28318530718
    vec3 pal(float t){return 0.5+0.5*cos(TAU*(t+vec3(0.0,0.33,0.67)));}
    float pattern(vec2 p){return sin(p.x*6.0)+sin(p.y*6.0)+sin(length(p)*8.0);}
    void main(){
      vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
      float a=atan(uv.y,uv.x);float r=length(uv);
      float N=8.0;float sect=TAU/N;
      a=mod(a,sect);a=abs(a-sect*0.5);a+=u_t*0.2;
      vec2 p=r*vec2(cos(a),sin(a))*5.0;
      float t=u_t*0.5;
      float v=pattern(p+vec2(t,-t))+pattern(p*1.7-vec2(t));
      vec3 col=pal(v*0.12+r*0.6+t*0.1);
      col*=0.7+0.5*smoothstep(1.0,0.0,r);
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
