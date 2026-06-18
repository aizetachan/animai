import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-tilt-shift', title:'Tilt-Shift', cat:'Postprocesado',
  tags:['tilt-shift','miniatura','desenfoque','bokeh','diorama','blur','postprocessing'],
  desc:'Desenfoque tilt-shift con una franja nítida central y bordes difuminados, efecto miniatura/diorama.',
  meta:['webgl','tilt-shift','blur'],
  prompt:`Implementa un desenfoque tilt-shift (efecto miniatura) que mantiene una franja horizontal nítida en el centro y difumina progresivamente arriba y abajo.
Algoritmo: calcula la distancia vertical del píxel al centro de la franja (abs(uv.y-focusY)). Define un radio nítido (focusHeight) y una transición (feather). El factor de blur = smoothstep(focusHeight, focusHeight+feather, distancia). Aplica un blur gaussiano separable (o multimuestra radial) cuyo tamaño de kernel escala con ese factor: cuanto más lejos de la franja, mayor desenfoque. Opcionalmente sube saturación y contraste para reforzar el look de maqueta.
Parámetros: focusY (0.5), focusHeight (0.10-0.18), feather (0.2), blurStrength (px máximos). La franja nítida puede animarse desplazándose verticalmente.`,
  code:`// Fragment GLSL — tilt-shift sobre escena procedural
vec2 uv = gl_FragCoord.xy / u_res.xy;
float focusY = 0.5;
float focusH = 0.14;     // mitad de la franja nítida
float feather = 0.22;
float d = abs(uv.y - focusY);
float blur = smoothstep(focusH, focusH + feather, d); // 0 nítido -> 1 borroso
float radius = blur * 0.020;  // tamaño del desenfoque en UV
// blur multimuestra (disco) escalado por radius
vec3 col = vec3(0.0); float tot = 0.0;
for(int i=0;i<16;i++){
  float a = float(i)*2.39996;        // ángulo dorado
  float rr = (float(i)/16.0);
  vec2 off = vec2(cos(a),sin(a)) * radius * rr;
  off.x *= u_res.y/u_res.x;          // corrige aspecto
  col += scene(uv + off); tot += 1.0;
}
col /= tot;
col = mix(vec3(dot(col,vec3(0.299,0.587,0.114))), col, 1.25); // +saturación
gl_FragColor = vec4(col, 1.0);`,
  /* @render-start */
  render(el){
    const frag=`
    vec3 scene(vec2 uv){
      // ciudad/diorama procedural: edificios en filas con colores de marca
      vec2 p = uv;
      vec3 sky = mix(vec3(0.05,0.07,0.14), vec3(0.10,0.12,0.22), uv.y);
      vec3 col = sky;
      // filas de "edificios"
      for(int row=0; row<3; row++){
        float fr = float(row);
        float baseY = 0.30 + fr*0.22;
        float cell = 0.10 - fr*0.015;
        float gx = floor(p.x/cell);
        float h = 0.10 + 0.10*fract(sin(gx*12.9+fr*7.0)*43758.5);
        float top = baseY + h;
        float inX = step(0.08, fract(p.x/cell)) * step(fract(p.x/cell), 0.92);
        float build = step(p.y, top) * step(baseY, p.y) * inX;
        vec3 bc = mix(vec3(0.482,0.361,1.0), vec3(0.0,0.878,0.776), fract(sin(gx*3.3+fr)*43758.5));
        bc *= 0.4 + fr*0.25;
        // ventanas
        float win = step(0.5, fract(p.y*60.0)) * step(0.5, fract(p.x/cell*6.0));
        bc += win*build*vec3(1.0,0.9,0.6)*0.35;
        col = mix(col, bc, build);
      }
      // suelo
      float ground = step(p.y, 0.30);
      col = mix(col, vec3(0.12,0.13,0.16), ground);
      // luz central animada
      col += vec3(0.05)*sin(uv.x*20.0 + u_t);
      return col;
    }
    void main(){
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      float focusY = 0.46 + 0.06*sin(u_t*0.5);
      float focusH = 0.13;
      float feather = 0.24;
      float d = abs(uv.y - focusY);
      float blur = smoothstep(focusH, focusH + feather, d);
      float radius = blur * 0.022;
      vec3 col = vec3(0.0); float tot = 0.0;
      for(int i=0;i<16;i++){
        float a = float(i)*2.39996;
        float rr = float(i)/16.0;
        vec2 off = vec2(cos(a),sin(a)) * radius * rr;
        off.x *= u_res.y/u_res.x;
        col += scene(uv + off); tot += 1.0;
      }
      col /= tot;
      col = mix(vec3(dot(col,vec3(0.299,0.587,0.114))), col, 1.3);
      col = pow(col, vec3(0.92));
      gl_FragColor = vec4(col, 1.0);
    }`;
    return shaderPreview(el, frag);
  }
};
export default effect;
