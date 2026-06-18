import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-light-rays', title:'Light Rays', cat:'UI Components',
  tags:['light rays','rayos','god rays','volumetric','beams','react bits','glow'],
  desc:'Rayos de luz volumétricos descendentes desde un foco superior, parpadeando suavemente.',
  meta:['WebGL','volumetric rays','React Bits'],
  prompt:`Fragment shader "Light Rays": haces de luz volumétricos (god rays) que descienden desde un origen en la parte superior central.
Técnica: define un origen de luz arriba; calcula la dirección desde cada fragmento al origen y el ángulo respecto a la vertical. Usa funciones seno de varias frecuencias moduladas por el tiempo para crear bandas de intensidad según el ángulo (los rayos). Atenúa la intensidad con la distancia al origen (falloff) y aplica una máscara suave en los bordes. Suma color de marca cálido/violeta-cian, con un parpadeo lento.
Datos: origen aprox (0.5, 1.1) en uv [0..1], 2-3 frecuencias de rayos, falloff cuadrático, glow concentrado cerca del origen. Fondo oscuro.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec2 src=vec2(0.5,1.12);            // foco arriba-centro
      vec2 d=uv-src;
      float dist=length(d);
      float ang=atan(d.x, -d.y);          // 0 = recto hacia abajo
      // bandas de rayos por varias frecuencias
      float rays=0.0;
      rays+=0.55+0.45*sin(ang*22.0+u_t*0.7);
      rays+=0.55+0.45*sin(ang*41.0-u_t*0.5);
      rays+=0.55+0.45*sin(ang*13.0+u_t*0.3);
      rays/=3.0;
      rays=pow(rays,2.4);
      // limitar el cono de emisión y atenuar con distancia
      float cone=smoothstep(0.95,0.2,abs(ang));
      float falloff=1.0/(1.0+dist*dist*5.0);
      float flick=0.85+0.15*sin(u_t*1.7);
      float inten=rays*cone*falloff*flick*1.6;
      // glow del foco
      inten+=falloff*0.25;
      vec3 colA=vec3(0.48,0.36,1.0);      // violeta
      vec3 colB=vec3(0.0,0.88,0.78);      // cian
      vec3 col=mix(colB,colA,clamp(dist*1.3,0.0,1.0))*inten;
      col+=vec3(0.03,0.02,0.06);          // fondo oscuro
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
