import { shaderPreview } from '../_runtime.js';

const FRAG = `
float hash21(vec2 p){
  p = fract(p*vec2(123.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}
vec3 pal(float t){
  return 0.5+0.5*cos(6.28318*(vec3(1.0)*t+vec3(0.0,0.35,0.6)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;
  uv *= 4.0;
  uv += vec2(u_t*0.25, u_t*0.1);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  // Cada celda decide orientación de los dos arcos Truchet
  float n = hash21(id);
  // anima la reorganización: el umbral oscila con el tiempo + ruido
  float flip = step(0.5, fract(n + u_t*0.15 + sin(n*6.28+u_t)*0.25));
  if(flip > 0.5) gv.x = -gv.x;

  // distancia a dos arcos de cuarto de círculo (radio 0.5) centrados en esquinas opuestas
  float d1 = abs(length(gv - vec2(0.5, 0.5)) - 0.5);
  float d2 = abs(length(gv - vec2(-0.5, -0.5)) - 0.5);
  float d  = min(d1, d2);

  float width = 0.12;
  float mask = smoothstep(width, width-0.04, d);

  vec3 bg = vec3(0.03,0.03,0.06);
  vec3 arc = pal(n + u_t*0.08);
  vec3 col = mix(bg, arc, mask);

  // glow sutil marca animai
  col += pal(n)*0.15*smoothstep(0.4, 0.0, d);
  gl_FragColor = vec4(col, 1.0);
}`;

/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-truchet', title:'Truchet Tiles', cat:'Shaders WebGL',
  tags:['truchet','tiles','mosaico','generativo','pattern','geometría','procedural'],
  desc:'Mosaico de tiles Truchet con arcos que se reorganizan en bucle.',
  meta:['WebGL','Sin librerías','60fps'],
  prompt:`Fragment shader WebGL de un mosaico Truchet animado para fondos generativos.
Técnica: divide el plano en una rejilla con floor/fract sobre las coordenadas UV (escaladas y desplazadas con u_t para scroll).
Para cada celda calcula un hash 2D (hash21) que decide la orientación de los dos arcos. Anima la reorganización oscilando un umbral con step() sobre fract(hash + u_t + sin) para que las tiles giren su orientación en bucle.
Cada arco es un cuarto de círculo de radio 0.5 centrado en esquinas opuestas: d = abs(length(gv - corner) - 0.5); usa min de los dos. Dibuja la línea con smoothstep alrededor de un ancho. Colorea con cosine-palette (Inigo Quilez) usando el hash y añade glow.
Parámetros: escala de rejilla (4.0), velocidad de scroll, velocidad de flip, ancho de línea, paleta. Marca: #7b5cff / #00e0c6.`,
  code:`// shaderPreview(el, frag) ya antepone:
// 'precision highp float; uniform vec2 u_res; uniform float u_t;'
const FRAG = \`
float hash21(vec2 p){
  p = fract(p*vec2(123.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}
vec3 pal(float t){
  return 0.5+0.5*cos(6.28318*(vec3(1.0)*t+vec3(0.0,0.35,0.6)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;
  uv *= 4.0;
  uv += vec2(u_t*0.25, u_t*0.1);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  float n = hash21(id);
  float flip = step(0.5, fract(n + u_t*0.15 + sin(n*6.28+u_t)*0.25));
  if(flip > 0.5) gv.x = -gv.x;

  float d1 = abs(length(gv - vec2(0.5, 0.5)) - 0.5);
  float d2 = abs(length(gv - vec2(-0.5, -0.5)) - 0.5);
  float d  = min(d1, d2);

  float width = 0.12;
  float mask = smoothstep(width, width-0.04, d);

  vec3 bg = vec3(0.03,0.03,0.06);
  vec3 arc = pal(n + u_t*0.08);
  vec3 col = mix(bg, arc, mask);
  col += pal(n)*0.15*smoothstep(0.4, 0.0, d);
  gl_FragColor = vec4(col, 1.0);
}\`;
return shaderPreview(el, FRAG);`,
  /* @render-start */
  render(el){ return shaderPreview(el, FRAG); }
};
export default effect;
