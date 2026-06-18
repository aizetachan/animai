import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-twist', title:'Twist Swirl', cat:'Postprocesado',
  tags:['twist','swirl','remolino','espiral','distorsion','warp','postprocessing'],
  desc:'Remolino que retuerce la imagen desde el centro: cuanto más cerca del núcleo, mayor el giro.',
  meta:['webgl','twist','swirl'],
  prompt:`Implementa una distorsión twist/swirl que rota las coordenadas UV alrededor de un centro con un ángulo que depende del radio.
Algoritmo: centra el píxel (p = uv - center, corrige aspecto). Calcula r = length(p). Define un ángulo de torsión angle = strength * (1 - r/radius) cuando r < radius (suavizado con smoothstep), 0 fuera. Rota p por ese ángulo con una matriz de rotación 2D y vuelve a sumar el center. Muestrea la escena en las coordenadas retorcidas. El núcleo gira mucho y el giro decae hacia el borde, formando una espiral.
Parámetros: strength (radianes, p.ej. 3-6), radius (0.4-0.7), center. Anima strength con sin(t) para un latido de remolino.`,
  code:`// Fragment GLSL — twist/swirl sobre escena procedural
vec2 uv = gl_FragCoord.xy / u_res.xy;
vec2 center = vec2(0.5);
vec2 p = uv - center;
p.x *= u_res.x/u_res.y;          // aspecto
float r = length(p);
float radius = 0.6;
float strength = 4.0 * sin(u_t*0.6);
float t = smoothstep(radius, 0.0, r) * strength; // giro decae con el radio
float s = sin(t), c = cos(t);
p = mat2(c,-s,s,c) * p;
p.x /= u_res.x/u_res.y;
vec2 suv = p + center;
gl_FragColor = vec4(scene(suv), 1.0);`,
  /* @render-start */
  render(el){
    const frag=`
    vec3 scene(vec2 uv){
      // tablero/gradiente de marca para que el twist se vea claro
      vec2 g = uv * 10.0;
      float checker = mod(floor(g.x)+floor(g.y), 2.0);
      vec3 a = vec3(0.482,0.361,1.0);
      vec3 b = vec3(0.0,0.878,0.776);
      vec3 col = mix(a, b, checker);
      // gradiente diagonal animado
      col *= 0.55 + 0.45*sin((uv.x+uv.y)*8.0 + u_t);
      // líneas finas
      col += 0.12*step(0.92, fract(g.x)) ;
      col += 0.12*step(0.92, fract(g.y));
      // viñeta suave
      float v = smoothstep(1.1, 0.2, length(uv-0.5));
      return col*v + 0.02;
    }
    void main(){
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      vec2 center = vec2(0.5);
      vec2 p = uv - center;
      p.x *= u_res.x/u_res.y;
      float r = length(p);
      float radius = 0.62;
      float strength = 4.2 * sin(u_t*0.6);
      float tw = smoothstep(radius, 0.0, r) * strength;
      float s = sin(tw), cc = cos(tw);
      p = mat2(cc,-s,s,cc) * p;
      p.x /= u_res.x/u_res.y;
      vec2 suv = p + center;
      vec3 col = scene(suv);
      col = pow(col, vec3(0.9));
      gl_FragColor = vec4(col, 1.0);
    }`;
    return shaderPreview(el, frag);
  }
};
export default effect;
