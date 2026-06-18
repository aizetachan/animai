import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-apollonian', title:'Apollonian', cat:'Shaders WebGL',
  tags:['fractal','apollonian','gasket','kaleidoscope','inversión','shader','psicodélico'],
  desc:'Empaquetado apoloniano fractal animado: círculos infinitos por inversión esférica.',
  meta:['WebGL','Inversión fractal','Fractal 2D'],
  prompt:`Fragment shader WebGL1 del empaquetado apoloniano (Apollonian gasket).
Técnica: itera una transformación de plegado/inversión sobre el plano. En cada paso aplica mod simétrico (p=mod(p-1,2)-1) y luego una inversión esférica dividiendo por el cuadrado de la distancia (k=t/dot(p,p); p*=k), acumulando la escala. La distancia final al fractal se obtiene de la escala acumulada. Anima el parámetro de inversión 't' con un seno de u_t para que el empaquetado respire.
Colorea según iteración y distancia con paleta violeta-turquesa, glow aditivo en los bordes.`,
  code:`// Fragment GLSL (WebGL1) — usar con shaderPreview(el, frag)
// shaderPreview ya inyecta: precision highp float; uniform vec2 u_res; uniform float u_t;
float apollonian(vec2 uv, float kp){
  vec2 p=uv*1.4;
  float scale=1.0;
  float orbit=1e5;
  for(int i=0;i<8;i++){
    p=mod(p-1.0,2.0)-1.0;
    float r2=dot(p,p);
    orbit=min(orbit,r2);
    float k=kp/r2;
    p*=k; scale*=k;
  }
  return abs(p.y)/scale - 0.0008 + orbit*0.0;
}
vec3 palette(float t){
  vec3 a=vec3(0.30,0.22,0.55), b=vec3(0.40,0.45,0.50);
  vec3 c=vec3(1.0,1.0,1.0), d=vec3(0.30,0.55,0.75);
  return a+b*cos(6.28318*(c*t+d));
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
  float kp=1.0+0.35*sin(u_t*0.5);
  float a=u_t*0.1;
  uv=mat2(cos(a),-sin(a),sin(a),cos(a))*uv;
  float d=apollonian(uv,kp);
  float edge=smoothstep(0.02,0.0,d);
  float glow=0.012/(abs(d)+0.012);
  vec3 col=palette(d*8.0+u_t*0.2)*edge;
  col+=mix(vec3(0.48,0.36,1.0),vec3(0.0,0.88,0.78),0.5+0.5*sin(d*20.0))*glow*0.6;
  col=col/(1.0+col);
  col=pow(col,vec3(0.5));
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float apollonian(vec2 uv, float kp){
      vec2 p=uv*1.4;
      float scale=1.0;
      for(int i=0;i<8;i++){
        p=mod(p-1.0,2.0)-1.0;
        float r2=dot(p,p);
        float k=kp/r2;
        p*=k; scale*=k;
      }
      return abs(p.y)/scale - 0.0008;
    }
    vec3 palette(float t){
      vec3 a=vec3(0.30,0.22,0.55), b=vec3(0.40,0.45,0.50);
      vec3 c=vec3(1.0,1.0,1.0), d=vec3(0.30,0.55,0.75);
      return a+b*cos(6.28318*(c*t+d));
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
      float kp=1.0+0.35*sin(u_t*0.5);
      float a=u_t*0.1;
      uv=mat2(cos(a),-sin(a),sin(a),cos(a))*uv;
      float d=apollonian(uv,kp);
      float edge=smoothstep(0.02,0.0,d);
      float glow=0.012/(abs(d)+0.012);
      vec3 col=palette(d*8.0+u_t*0.2)*edge;
      col+=mix(vec3(0.48,0.36,1.0),vec3(0.0,0.88,0.78),0.5+0.5*sin(d*20.0))*glow*0.6;
      col=col/(1.0+col);
      col=pow(col,vec3(0.5));
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
