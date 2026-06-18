import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'chromatic', title:'Chromatic Wave', cat:'Shaders WebGL',
  tags:['imagen','displacement','rgb','aberración','distorsión','hover'],
  desc:'Aberración cromática ondulante. Da textura premium a heros e imágenes al hacer hover.',
  meta:['WebGL','Chromatic','Sutil'],
  prompt:`Fragment shader WebGL de aberración cromática animada sobre una textura/imagen.
Muestrea la textura 3 veces (R,G,B) con offset UV que crece con ruido y u_time. Ondulación suave, sin glitch brusco.
Expón "amount" como uniform para controlarlo desde JS (p.ej. al scrollear).`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;float d=sin(uv.y*10.+u_t*2.)*.02+sin(uv.x*6.-u_t)*.015;
      float r=.5+.5*sin((uv.x+d)*6.+u_t),g=.5+.5*sin(uv.x*6.+u_t+1.),b=.5+.5*sin((uv.x-d)*6.+u_t+2.);
      vec3 col=vec3(r,g*.7,b)*vec3(.55,.45,1.);col=mix(col,vec3(0.,.85,.78),uv.y*.4);gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
