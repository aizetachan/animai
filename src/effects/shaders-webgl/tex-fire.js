import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-fire', title:'Fire Shader', cat:'Shaders WebGL',
  tags:['fuego','fire','llama','shader','noise','calor'],
  desc:'Llamas procedurales animadas con ruido. Shader de fuego para fondos intensos o gaming.',
  meta:['WebGL','fbm noise','Fuego'],
  prompt:`Fragment shader WebGL de fuego procedural.
Usa fbm (ruido fractal) desplazado hacia arriba con u_time para simular llamas; mapea la intensidad a una paleta negro->rojo->naranja->amarillo. Atenúa hacia arriba y los bordes.
Para fondos de gaming, música intensa o secciones "hot". Expón intensidad como uniform.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.;a*=.5;}return v;}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;float n=fbm(vec2(uv.x*4.,uv.y*4.-u_t*2.));
      float flame=n*(1.-uv.y)*1.8;flame*=smoothstep(0.,.3,uv.y)*smoothstep(1.,.4,abs(uv.x-.5)*2.);
      vec3 col=vec3(0.);col+=vec3(1.,.2,0.)*smoothstep(.2,.5,flame);col+=vec3(1.,.6,0.)*smoothstep(.4,.7,flame);col+=vec3(1.,1.,.6)*smoothstep(.65,.9,flame);
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
