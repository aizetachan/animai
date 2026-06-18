import { shaderPreview } from '../_runtime.js';

const FRAG = `
vec3 pal(float t){
  return 0.5+0.5*cos(6.28318*(vec3(1.0)*t+vec3(0.0,0.35,0.6)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;

  // zoom infinito en bucle hacia un punto interesante del borde
  float zoom = exp(-mod(u_t*0.35, 6.0));
  vec2 center = vec2(-0.74364388703, 0.13182590421);
  vec2 c = center + uv * zoom * 3.0;

  vec2 z = vec2(0.0);
  float i = 0.0;
  const float MAX = 160.0;
  for(float k=0.0; k<MAX; k+=1.0){
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
    if(dot(z,z) > 64.0) break;
    i += 1.0;
  }

  vec3 col;
  if(i >= MAX){
    col = vec3(0.02,0.02,0.05); // interior
  } else {
    // smooth iteration count para gradiente continuo
    float sm = i - log2(log2(dot(z,z))) + 4.0;
    col = pal(sm*0.04 + u_t*0.08);
    col *= 0.4 + 0.6*sqrt(sm/MAX);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-mandelbrot', title:'Mandelbrot Zoom', cat:'Shaders WebGL',
  tags:['fractal','mandelbrot','zoom','matemático','procedural','escape-time','infinito'],
  desc:'Fractal de Mandelbrot con zoom infinito en bucle y paleta animada.',
  meta:['WebGL','Sin librerías','60fps'],
  prompt:`Fragment shader WebGL del fractal de Mandelbrot con zoom infinito.
Técnica escape-time: para cada pixel, c = centro + uv*zoom; itera z = z^2 + c (complejo: z.x*z.x - z.y*z.y, 2*z.x*z.y). Sale cuando dot(z,z) > radio de escape (p.ej. 64). Cuenta de iteraciones suavizada: sm = i - log2(log2(dot(z,z))) + offset para evitar bandas.
Zoom infinito en bucle: zoom = exp(-mod(u_t*vel, periodo)) apuntando a un punto del borde de Misiurewicz como (-0.74364, 0.13182).
Colorea con cosine-palette (Inigo Quilez) usando la cuenta suave + u_t para animar la paleta; interior en color oscuro.
Parámetros: MAX iteraciones (usa un const float en el for de GLSL ES 1.0), centro, velocidad de zoom, radio de escape, paleta. Marca: #7b5cff / #00e0c6.`,
  code:`// shaderPreview(el, frag) ya antepone:
// 'precision highp float; uniform vec2 u_res; uniform float u_t;'
const FRAG = \`
vec3 pal(float t){
  return 0.5+0.5*cos(6.28318*(vec3(1.0)*t+vec3(0.0,0.35,0.6)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;

  float zoom = exp(-mod(u_t*0.35, 6.0));
  vec2 center = vec2(-0.74364388703, 0.13182590421);
  vec2 c = center + uv * zoom * 3.0;

  vec2 z = vec2(0.0);
  float i = 0.0;
  const float MAX = 160.0;
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
    col = pal(sm*0.04 + u_t*0.08);
    col *= 0.4 + 0.6*sqrt(sm/MAX);
  }
  gl_FragColor = vec4(col, 1.0);
}\`;
return shaderPreview(el, FRAG);`,
  /* @render-start */
  render(el){ return shaderPreview(el, FRAG); }
};
export default effect;
