import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-starnest', title:'Star Nest', cat:'Shaders WebGL',
  tags:['starnest','nebulosa','estrellas','volumetrico','espacio','kaliset','fondo'],
  desc:'Nebulosa volumetrica de estrellas por capas usando plegado fractal (kaliset folding). Fondo cosmico para hero o gaming.',
  meta:['WebGL','Sin librerias','60fps'],
  prompt:`Fragment shader WebGL tipo "Star Nest" (Kali / Pablo Roman Andrioli).
Tecnica: raymarch fake hacia el espacio. Por cada uno de ~12 pasos (volsteps) avanza un punto p a lo largo de un rayo dir desde from.
En cada paso aplica un "kaliset folding": repetidamente p = abs(p)/dot(p,p) - formparam, acumulando la magnitud al cuadrado en a (variable de densidad).
La densidad a se eleva (a*a) y se modula con stepsize/tile para formar nubes y nucleos de estrellas.
Acumula color v sumando capas con un gradiente de saturacion (mezcla con vec3(s,s*s,s*s*s)).
Parametros clave: iterations=15, formuparam=0.53, volsteps=12, stepsize=0.1, zoom=0.8, tile=0.85, brightness=0.0015, darkmatter=0.3, distfading=0.73, saturation=0.85.
Anima rotando ligeramente la direccion del rayo y desplazando 'from' con u_t. Marca cromatica: tonos violeta #7b5cff y cian #00e0c6.`,
  code:`// Fragment (GLSL ES 1.0). Helpers proveen: uniform vec2 u_res; uniform float u_t;
#define ITER 15
#define VOLSTEPS 12
#define SPARSITY 0.5
void main(){
  vec2 uv = gl_FragCoord.xy/u_res.xy - 0.5;
  uv.x *= u_res.x/u_res.y;
  float zoom = 0.8;
  vec3 dir = vec3(uv*zoom, 1.0);
  float t = u_t*0.04;
  // rotacion lenta del rayo
  float a1 = 0.5, a2 = 0.8 + t*0.3;
  mat2 rot1 = mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
  mat2 rot2 = mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
  dir.xz *= rot1; dir.xy *= rot2;
  vec3 from = vec3(1.0, 0.5, 0.5) + vec3(t*2.0, t, -2.0);
  from.xz *= rot1; from.xy *= rot2;

  float s = 0.1, fade = 1.0;
  vec3 v = vec3(0.0);
  for(int r=0; r<VOLSTEPS; r++){
    vec3 p = from + s*dir*0.5;
    p = abs(vec3(0.85) - mod(p, vec3(0.85*2.0))); // tiling
    float pa, a = 0.0;
    pa = 0.0;
    for(int i=0; i<ITER; i++){
      p = abs(p)/dot(p,p) - 0.53; // kaliset folding
      a += abs(length(p)-pa);
      pa = length(p);
    }
    float dm = max(0.0, 0.3 - a*a*0.001); // dark matter
    a *= a*a; // densidad
    if(r>6) fade *= 1.0 - dm;
    v += fade;
    v += vec3(s, s*s, s*s*s)*a*0.0015*fade;
    fade *= 0.73; // distfading
    s += 0.1;
  }
  v = mix(vec3(length(v)), v, 0.85); // saturacion
  // tinte de marca violeta/cian
  v *= vec3(0.9, 0.95, 1.15);
  gl_FragColor = vec4(v*0.012, 1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    #define ITER 15
    #define VOLSTEPS 12
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy-0.5; uv.x*=u_res.x/u_res.y;
      vec3 dir=vec3(uv*0.8,1.0);
      float t=u_t*0.04;
      float a1=0.5,a2=0.8+t*0.3;
      mat2 r1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
      mat2 r2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
      dir.xz*=r1; dir.xy*=r2;
      vec3 from=vec3(1.0,0.5,0.5)+vec3(t*2.0,t,-2.0);
      from.xz*=r1; from.xy*=r2;
      float s=0.1,fade=1.0; vec3 v=vec3(0.0);
      for(int rr=0; rr<VOLSTEPS; rr++){
        vec3 p=from+s*dir*0.5;
        p=abs(vec3(0.85)-mod(p,vec3(1.7)));
        float pa=0.0,a=0.0;
        for(int i=0;i<ITER;i++){
          p=abs(p)/dot(p,p)-0.53;
          a+=abs(length(p)-pa); pa=length(p);
        }
        float dm=max(0.0,0.3-a*a*0.001);
        a*=a*a;
        if(rr>6) fade*=1.0-dm;
        v+=fade;
        v+=vec3(s,s*s,s*s*s)*a*0.0015*fade;
        fade*=0.73; s+=0.1;
      }
      v=mix(vec3(length(v)),v,0.85);
      v*=vec3(0.9,0.95,1.15);
      gl_FragColor=vec4(v*0.012,1.0);
    }`);}
};
export default effect;
