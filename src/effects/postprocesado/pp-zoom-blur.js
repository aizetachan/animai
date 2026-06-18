import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-zoom-blur', title:'Zoom Blur', cat:'Postprocesado',
  tags:['zoom blur','radial','desenfoque','speed lines','impacto','postprocessing','webgl'],
  desc:'Desenfoque radial tipo zoom que estira la imagen desde el centro, sensación de aceleración o impacto.',
  meta:['webgl','zoom-blur','radial'],
  prompt:`Implementa zoom/radial blur muestreando la imagen varias veces a lo largo del rayo que va del centro al píxel.
Algoritmo: para cada píxel con coordenada uv centrada (uv-center), toma N muestras escalando la coordenada hacia el centro: sample_uv = center + (uv-center) * (1 - strength*(i/N)). Acumula color y promedia. La fuerza del blur crece con la distancia al centro, dejando el centro nítido y los bordes estirados radialmente.
Parámetros: strength (0.1-0.5), samples (8-24), center. Útil para transiciones de impacto, hiperespacio o foco dramático.`,
  code:`// Fragment GLSL — zoom (radial) blur sobre una escena procedural
vec2 uv = gl_FragCoord.xy / u_res.xy;
vec2 center = vec2(0.5);
vec2 dir = uv - center;
float strength = 0.35 + 0.2*sin(u_t);   // anima la intensidad
const int N = 18;
vec3 col = vec3(0.0);
for(int i=0;i<N;i++){
  float k = float(i)/float(N);
  vec2 suv = center + dir*(1.0 - strength*k);
  col += scene(suv);
}
col /= float(N);
gl_FragColor = vec4(col,1.0);`,
  /* @render-start */
  render(el){
    const frag=`
    vec3 scene(vec2 uv){
      // patrón procedural: anillos y franjas de color marca, con un sol central
      vec2 p = uv - vec2(0.5);
      p.x *= u_res.x/u_res.y;
      float r = length(p);
      float ang = atan(p.y, p.x);
      vec3 brand = mix(vec3(0.482,0.361,1.0), vec3(0.0,0.878,0.776), 0.5+0.5*sin(ang*6.0+u_t));
      float rings = 0.5 + 0.5*sin(r*38.0 - u_t*2.0);
      float core = smoothstep(0.18, 0.0, r);
      vec3 col = brand*rings*smoothstep(0.7,0.0,r);
      col += vec3(1.0,0.95,0.85)*core;
      // estrellas / puntos
      vec2 g = fract(uv*9.0)-0.5;
      float star = smoothstep(0.06,0.0,length(g))*step(0.92, fract(sin(dot(floor(uv*9.0),vec2(12.9,78.2)))*43758.5));
      col += star*0.6;
      return col;
    }
    void main(){
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      vec2 center = vec2(0.5);
      vec2 dir = uv - center;
      float strength = 0.32 + 0.22*sin(u_t*0.8);
      const int N = 18;
      vec3 col = vec3(0.0);
      for(int i=0;i<N;i++){
        float k = float(i)/float(N);
        vec2 suv = center + dir*(1.0 - strength*k);
        col += scene(suv);
      }
      col /= float(N);
      col = pow(col, vec3(0.85));
      gl_FragColor = vec4(col,1.0);
    }`;
    return shaderPreview(el, frag);
  }
};
export default effect;
