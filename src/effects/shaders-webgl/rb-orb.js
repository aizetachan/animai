import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-orb', title:'Orb', cat:'Shaders WebGL',
  tags:['orb','orbe','esfera','energía','react bits','glow','bola'],
  desc:'Un orbe de energía con superficie ondulante y halo brillante. La esfera reactiva de React Bits.',
  meta:['WebGL','sphere glow','React Bits'],
  prompt:`Fragment shader "Orb" (React Bits): un orbe de energía centrado con una superficie interna que ondula (ruido/seno) y un halo/glow exterior pulsante. Opcionalmente reacciona al cursor (hover-rotación).
Calcula la distancia al centro: dentro pinta el orbe con un patrón animado y fresnel en el borde; fuera, un glow que decae. Tono violeta-cian energético.
Hero icónico para marcas de IA y energía.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    void main(){vec2 uv=(gl_FragCoord.xy/u_res.xy-.5);uv.x*=u_res.x/u_res.y;
      float r=length(uv);float R=.32;
      float surf=noise(uv*6.+u_t*.5)*.5+noise(uv*12.-u_t*.3)*.5;
      vec3 col=vec3(0.);
      if(r<R){float fres=pow(r/R,3.);col=mix(vec3(.3,.15,.7),vec3(.2,.9,.85),surf);col+=fres*vec3(.6,.4,1.);}
      float glow=smoothstep(R+.2,R,r)*.6;col+=glow*vec3(.5,.3,1.)*(1.+.3*sin(u_t*2.));
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
