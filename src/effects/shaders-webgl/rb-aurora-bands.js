import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-aurora-bands', title:'Aurora Bands', cat:'Shaders WebGL',
  tags:['aurora','boreal','bandas','react bits','cielo','norte','ondas'],
  desc:'Bandas de aurora boreal ondulando verticalmente en el cielo. Distinto del aurora de fondo suave.',
  meta:['WebGL','aurora','Cielo'],
  prompt:`Fragment shader "Aurora" (React Bits) en formato de bandas verticales: cortinas de luz de aurora boreal que ondulan de arriba a abajo, con color que transiciona verde-cian-violeta y bordes difusos.
Genera cortinas con funciones seno sobre X moduladas en altura, con desplazamiento temporal; aplica un gradiente de color por banda y fade en los extremos. Sobre cielo oscuro.
Fondo mágico para heros nocturnos/naturaleza/tech.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;
      float band=0.;for(float i=0.;i<3.;i++){float x=uv.x*2.+i*1.7;float curtain=noise(vec2(x,u_t*.3+i))*.4;float center=.5+sin(x*2.+u_t)*.15+curtain;float d=abs(uv.y-center);band+=smoothstep(.25,0.,d)*(.6-i*.15);}
      vec3 g=mix(vec3(0.,.9,.5),vec3(.4,.2,1.),uv.y);vec3 col=g*band;col+=vec3(.01,.02,.06);
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
