import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-cross-hatch', title:'Cross-Hatch', cat:'Postprocesado',
  tags:['crosshatch','hatching','sketch','pencil','boceto','lapiz','ink'],
  desc:'Sombreado de líneas cruzadas estilo boceto a lápiz: más capas de tramado cuanto más oscuro el píxel.',
  meta:['WebGL','luminance','hatching'],
  prompt:`Fragment shader que convierte la luminancia de la imagen en tramado a lápiz (cross-hatch). Calcula lum = dot(color, vec3(0.299,0.587,0.114)). Define varios umbrales (p.ej. 0.75, 0.55, 0.35, 0.15): por cada umbral que la luminancia esté por debajo, dibuja una capa de líneas paralelas en un ángulo distinto (0°, 90°, 45°, -45°). Las líneas se generan con un patrón sin/mod sobre las coordenadas rotadas de gl_FragCoord; usa smoothstep para antialias. El resultado es papel blanco con trazos oscuros que se acumulan en las sombras.
Parámetros: density (separación de líneas), thickness (grosor del trazo), umbrales de luminancia. Ideal para look de ilustración, cómic o blueprint.`,
  code:`// Fragment shader (GLSL ES 1.0) — Cross-Hatch (pencil sketch)
// uniforms: sampler2D u_tex; vec2 u_res;
float hatch(vec2 frag, float angle, float spacing){
  float s=sin(angle), c=cos(angle);
  float coord = frag.x*c + frag.y*s;           // proyecta sobre la dirección
  return smoothstep(0.0,1.0, abs(sin(coord*3.14159/spacing)) );
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec3 col = texture2D(u_tex, uv).rgb;
  float lum = dot(col, vec3(0.299,0.587,0.114));
  float ink = 1.0; // empieza blanco
  if(lum < 0.75) ink = min(ink, hatch(gl_FragCoord.xy, 0.0,        6.0));
  if(lum < 0.55) ink = min(ink, hatch(gl_FragCoord.xy, 1.5708,    6.0));
  if(lum < 0.35) ink = min(ink, hatch(gl_FragCoord.xy, 0.7854,    5.0));
  if(lum < 0.15) ink = min(ink, hatch(gl_FragCoord.xy,-0.7854,    5.0));
  gl_FragColor = vec4(vec3(ink), 1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float lumScene(vec2 uv){
      // esfera procedural iluminada -> gradiente de luminancia animado
      vec2 c=uv-0.5; c.x*=u_res.x/u_res.y;
      float r=length(c);
      vec2 ld=vec2(cos(u_t*0.6),sin(u_t*0.6))*0.5;
      float diff=clamp(1.0-dot(normalize(c-ld*0.0+ld*0.0001),vec2(0.0))*0.0,0.0,1.0);
      float sphere=smoothstep(0.42,0.40,r);
      float shade=clamp(1.0-r*2.0 + dot(normalize(c+1e-4),normalize(ld+1e-4))*0.4,0.0,1.0);
      float bg=0.85+0.1*uv.y;
      return mix(bg, shade, sphere);
    }
    float hatch(vec2 frag,float angle,float spacing){
      float s=sin(angle),c=cos(angle);
      float coord=frag.x*c+frag.y*s;
      return smoothstep(0.0,0.6,abs(sin(coord*3.14159/spacing)));
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      float lum=lumScene(uv);
      float ink=1.0;
      if(lum<0.78) ink=min(ink,hatch(gl_FragCoord.xy,0.0,7.0));
      if(lum<0.58) ink=min(ink,hatch(gl_FragCoord.xy,1.5708,7.0));
      if(lum<0.40) ink=min(ink,hatch(gl_FragCoord.xy,0.7854,6.0));
      if(lum<0.20) ink=min(ink,hatch(gl_FragCoord.xy,-0.7854,6.0));
      vec3 paper=vec3(0.96,0.96,0.93);
      vec3 graphite=vec3(0.12,0.10,0.18);
      vec3 col=mix(graphite,paper,ink);
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
