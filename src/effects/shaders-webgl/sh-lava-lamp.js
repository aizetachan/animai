import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-lava-lamp', title:'Lava Lamp', cat:'Shaders WebGL',
  tags:['lava','metaballs','lamp','blobs','retro','calido','fondo'],
  desc:'Lampara de lava clasica: metaballs que ascienden y se funden, con gradiente calido. Fondo nostalgico y relajante.',
  meta:['WebGL','Sin librerias','60fps'],
  prompt:`Fragment shader WebGL de "lampara de lava".
Tecnica: campo de metaballs. Define ~6 blobs con centro animado (cada uno sube y baja en Y de forma desfasada con seno, y oscila en X).
El campo escalar es la suma de field += radius*radius / dot(uv-center, uv-center) (inverso del cuadrado de la distancia).
Aplica smoothstep sobre el campo para obtener la mascara del fluido (umbral ~1.0) -> isosuperficie organica que se fusiona.
Color: gradiente vertical calido del fondo (rojo oscuro a purpura) y la lava con cosine-palette caliente (naranja/amarillo) modulada por la altura.
Anade un leve halo/glow alrededor de los blobs. Marca cromatica: introduce un toque de violeta #7b5cff en la base.
Parametros: numBlobs=6, radio base ~0.12, velocidad de ascenso lenta (~0.2), viscosidad via smoothstep estrecho.`,
  code:`// Fragment (GLSL ES 1.0). Helpers proveen: uniform vec2 u_res; uniform float u_t;
vec3 pal(float t){ return 0.5+0.5*cos(6.28318*(vec3(1.0,0.7,0.4)*t+vec3(0.0,0.15,0.2))); }
void main(){
  vec2 uv = gl_FragCoord.xy/u_res.xy;
  vec2 p = uv; p.x *= u_res.x/u_res.y;
  float t = u_t*0.25;
  float field = 0.0;
  for(int i=0;i<6;i++){
    float fi = float(i);
    float ph = fi*1.7;
    // ascenso/descenso vertical desfasado, deriva horizontal
    float cy = 0.5 + 0.42*sin(t*(0.6+fi*0.07)+ph);
    float cx = (0.25 + 0.5*fract(fi*0.31)) + 0.08*sin(t*0.9+ph*2.0);
    cx *= u_res.x/u_res.y;
    float r = 0.10 + 0.04*sin(ph+t);
    vec2 d = p - vec2(cx, cy);
    field += r*r/dot(d,d);
  }
  // fondo calido con gradiente vertical (incluye toque violeta en base)
  vec3 bg = mix(vec3(0.18,0.03,0.10), vec3(0.10,0.02,0.18), uv.y);
  bg = mix(bg, vec3(0.30,0.05,0.06), 0.4);
  // isosuperficie
  float m = smoothstep(0.9, 1.3, field);
  float glow = smoothstep(0.4, 1.0, field)*0.5;
  vec3 lava = pal(uv.y*0.6 + 0.2);
  vec3 col = bg + glow*vec3(0.6,0.2,0.1);
  col = mix(col, lava, m);
  gl_FragColor = vec4(col, 1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    vec3 pal(float t){return 0.5+0.5*cos(6.28318*(vec3(1.0,0.7,0.4)*t+vec3(0.0,0.15,0.2)));}
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec2 p=uv; p.x*=u_res.x/u_res.y;
      float t=u_t*0.25;
      float field=0.0;
      for(int i=0;i<6;i++){
        float fi=float(i); float ph=fi*1.7;
        float cy=0.5+0.42*sin(t*(0.6+fi*0.07)+ph);
        float cx=(0.25+0.5*fract(fi*0.31))+0.08*sin(t*0.9+ph*2.0);
        cx*=u_res.x/u_res.y;
        float r=0.10+0.04*sin(ph+t);
        vec2 d=p-vec2(cx,cy);
        field+=r*r/dot(d,d);
      }
      vec3 bg=mix(vec3(0.18,0.03,0.10),vec3(0.10,0.02,0.18),uv.y);
      bg=mix(bg,vec3(0.30,0.05,0.06),0.4);
      float m=smoothstep(0.9,1.3,field);
      float glow=smoothstep(0.4,1.0,field)*0.5;
      vec3 lava=pal(uv.y*0.6+0.2);
      vec3 col=bg+glow*vec3(0.6,0.2,0.1);
      col=mix(col,lava,m);
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
