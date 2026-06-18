import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-topographic', title:'Topographic Lines', cat:'Shaders WebGL',
  tags:['topographic','curvas','nivel','mapa','líneas','contorno','data'],
  desc:'Curvas de nivel topográficas que ondulan como un mapa vivo. Estética data/IA.',
  meta:['WebGL','contour','Data'],
  prompt:`Fragment shader de líneas topográficas (curvas de nivel) animadas.
Genera un campo de altura con fbm (ruido fractal); dibuja líneas donde la altura cruza umbrales regulares (usa fract(height*N) y un umbral fino para el contorno). Desplaza el ruido con el tiempo para que las "montañas" ondulen.
Estética de mapa/data/IA para fondos de secciones técnicas.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.;a*=.5;}return v;}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;uv.x*=u_res.x/u_res.y;
      float h=fbm(uv*3.+vec2(0.,u_t*.15));float lines=fract(h*12.);
      float d=abs(lines-.5);float line=smoothstep(.06,0.,d*.5);
      vec3 base=vec3(.04,.04,.09);vec3 col=mix(base,mix(vec3(.48,.36,1.),vec3(0.,.88,.78),h),line);
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
