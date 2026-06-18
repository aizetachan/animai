import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-shockwave', title:'Shockwave', cat:'Postprocesado',
  tags:['shockwave','onda','ripple','distorsion','impacto','wave','postprocessing'],
  desc:'Onda expansiva que distorsiona la imagen desde un punto, propagándose hacia fuera en bucle.',
  meta:['webgl','shockwave','ripple'],
  prompt:`Implementa una onda expansiva (shockwave) que desplaza las UV radialmente sobre un anillo que crece desde un centro.
Algoritmo: p = uv - center (corrige aspecto), r = length(p). El frente de onda está en waveRadius = fract(t*speed) (en bucle). La diferencia diff = r - waveRadius. La fuerza del desplazamiento es un pulso estrecho: pulse = (1 - smoothstep(0, thickness, abs(diff))) * exp(-r*falloff). Desplaza la coordenada a lo largo de la normal normalize(p): suv = uv - normalize(p) * pulse * amplitude. Muestrea la escena en suv. Añade un realce de brillo/aberración cromática en el anillo para resaltar el frente.
Parámetros: speed, thickness (0.05-0.1), amplitude (0.03-0.06), falloff. Reinicia con fract(t) para bucle infinito.`,
  code:`// Fragment GLSL — shockwave/ripple sobre escena procedural
vec2 uv = gl_FragCoord.xy / u_res.xy;
vec2 center = vec2(0.5);
vec2 p = uv - center;
p.x *= u_res.x/u_res.y;
float r = length(p);
float wave = fract(u_t*0.5);           // frente que crece y reinicia
float diff = r - wave;
float thickness = 0.07;
float amplitude = 0.045;
float pulse = (1.0 - smoothstep(0.0, thickness, abs(diff)));
pulse *= exp(-r*2.0) * smoothstep(1.0, 0.0, wave); // se desvanece al final
vec2 dir = normalize(p + 1e-5);
vec2 suv = uv - dir * pulse * amplitude;
vec3 col = scene(suv);
col += pulse * 0.4;                      // brillo del frente
gl_FragColor = vec4(col, 1.0);`,
  /* @render-start */
  render(el){
    const frag=`
    vec3 scene(vec2 uv){
      // rejilla de marca con puntos, ideal para ver la deformación
      vec2 g = uv * 12.0;
      vec2 f = fract(g) - 0.5;
      float dot = smoothstep(0.18, 0.10, length(f));
      vec3 base = mix(vec3(0.05,0.06,0.12), vec3(0.10,0.10,0.20), uv.y);
      vec3 dc = mix(vec3(0.482,0.361,1.0), vec3(0.0,0.878,0.776), 0.5+0.5*sin(g.x*0.6+g.y*0.6+u_t));
      vec3 col = base + dc*dot;
      // líneas de rejilla
      col += vec3(0.10,0.12,0.20)*step(0.93, max(fract(g.x), fract(g.y)));
      return col;
    }
    void main(){
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      vec2 center = vec2(0.5);
      vec2 p = uv - center;
      p.x *= u_res.x/u_res.y;
      float r = length(p);
      float wave = fract(u_t*0.5);
      float diff = r - wave;
      float thickness = 0.07;
      float amplitude = 0.05;
      float pulse = (1.0 - smoothstep(0.0, thickness, abs(diff)));
      pulse *= exp(-r*1.8) * smoothstep(1.0, 0.0, wave);
      vec2 dir = normalize(p + vec2(1e-5));
      vec2 suv = uv - dir * pulse * amplitude;
      // aberración cromática en el frente
      vec3 col;
      col.r = scene(suv + dir*pulse*0.006).r;
      col.g = scene(suv).g;
      col.b = scene(suv - dir*pulse*0.006).b;
      col += pulse * vec3(0.3,0.35,0.45);
      col = pow(col, vec3(0.92));
      gl_FragColor = vec4(col, 1.0);
    }`;
    return shaderPreview(el, frag);
  }
};
export default effect;
