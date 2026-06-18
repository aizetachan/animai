import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-plasma-globe', title:'Plasma / Lightning', cat:'Shaders WebGL',
  tags:['plasma','lightning','rayos','eléctrico','energía','shader','tesla'],
  desc:'Rayos eléctricos procedurales tipo bola de plasma. Energía cruda en un shader.',
  meta:['WebGL','noise ridges','Energía'],
  prompt:`Fragment shader de plasma/rayos eléctricos (bola de plasma Tesla).
Usa ruido fractal y la técnica de "ridges" (1 - abs(noise)) elevada a potencia para crear filamentos finos y brillantes que parecen descargas eléctricas, animados con el tiempo y emanando de un centro.
Para secciones de "potencia/energía", gaming o efectos hero impactantes. Azul-violeta eléctrico.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*abs(noise(p)*2.-1.);p*=2.;a*=.5;}return v;}
    void main(){vec2 uv=(gl_FragCoord.xy/u_res.xy-.5);uv.x*=u_res.x/u_res.y;
      float r=length(uv);float f=fbm(uv*4.+vec2(u_t*.3,0.));
      float bolt=pow(1.-f,3.)*smoothstep(.6,0.,r);
      vec3 col=vec3(.3,.4,1.)*bolt+vec3(.5,.2,1.)*bolt*bolt;col+=vec3(.05,.05,.15)*(1.-r);
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
