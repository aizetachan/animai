import { shaderPreview } from '../_runtime.js';

const FRAG = `
vec3 pal(float t){
  return 0.5+0.5*cos(6.28318*(vec3(1.0)*t+vec3(0.0,0.35,0.6)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;
  uv *= 1.5;

  // parametro c animado recorriendo una curva en el plano complejo
  vec2 c = vec2(0.7885*cos(u_t*0.3), 0.7885*sin(u_t*0.21));

  vec2 z = uv;
  float i = 0.0;
  const float MAX = 140.0;
  for(float k=0.0; k<MAX; k+=1.0){
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
    if(dot(z,z) > 64.0) break;
    i += 1.0;
  }

  vec3 col;
  if(i >= MAX){
    col = vec3(0.02,0.02,0.05); // dentro del conjunto
  } else {
    float sm = i - log2(log2(dot(z,z))) + 4.0;
    col = pal(sm*0.05 + u_t*0.05);
    col *= 0.35 + 0.65*sqrt(sm/MAX);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-julia', title:'Julia Set', cat:'Shaders WebGL',
  tags:['fractal','julia','complejo','matemático','procedural','escape-time','animado'],
  desc:'Conjunto de Julia con parámetro c animado recorriendo el plano complejo.',
  meta:['WebGL','Sin librerías','60fps'],
  prompt:`Fragment shader WebGL del conjunto de Julia con parámetro c animado.
Técnica escape-time: z parte de la coordenada uv del pixel (a diferencia de Mandelbrot donde z parte de 0). Itera z = z^2 + c con c CONSTANTE por frame pero ANIMADO entre frames: c = 0.7885*(cos(u_t*a), sin(u_t*b)), recorriendo una curva en el plano complejo que muta la forma del fractal.
Sale cuando dot(z,z) > radio de escape. Cuenta suavizada sm = i - log2(log2(dot(z,z))) + offset.
Colorea con cosine-palette (Inigo Quilez) usando sm + u_t; interior oscuro.
Parámetros: MAX iteraciones (const float en el for de GLSL ES 1.0), magnitud de c (0.7885), velocidades de la curva de c, radio de escape, paleta. Marca: #7b5cff / #00e0c6.`,
  code:`// shaderPreview(el, frag) ya antepone:
// 'precision highp float; uniform vec2 u_res; uniform float u_t;'
const FRAG = \`
vec3 pal(float t){
  return 0.5+0.5*cos(6.28318*(vec3(1.0)*t+vec3(0.0,0.35,0.6)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;
  uv *= 1.5;

  vec2 c = vec2(0.7885*cos(u_t*0.3), 0.7885*sin(u_t*0.21));

  vec2 z = uv;
  float i = 0.0;
  const float MAX = 140.0;
  for(float k=0.0; k<MAX; k+=1.0){
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
    if(dot(z,z) > 64.0) break;
    i += 1.0;
  }

  vec3 col;
  if(i >= MAX){
    col = vec3(0.02,0.02,0.05);
  } else {
    float sm = i - log2(log2(dot(z,z))) + 4.0;
    col = pal(sm*0.05 + u_t*0.05);
    col *= 0.35 + 0.65*sqrt(sm/MAX);
  }
  gl_FragColor = vec4(col, 1.0);
}\`;
return shaderPreview(el, FRAG);`,
  /* @render-start */
  render(el){ return shaderPreview(el, FRAG); }
};
export default effect;
