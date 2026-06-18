import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-water', title:'Water Caustics', cat:'Shaders WebGL',
  tags:['agua','caustics','water','shader','luz','piscina','reflejo'],
  desc:'Cáusticas de agua: la luz danzante del fondo de una piscina. Shader fresco para fondos acuáticos.',
  meta:['WebGL','Caustics','Agua'],
  prompt:`Fragment shader WebGL de cáusticas de agua (los patrones de luz del fondo de una piscina).
Suma varias capas de ruido/seno desplazadas en distintas direcciones con u_time y elévalas a una potencia para crear las líneas brillantes características.
Tinta azul-cian. Para fondos de marcas de agua, viajes, bienestar o frescor.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;uv.x*=u_res.x/u_res.y;float t=u_t*.5;
      float c=0.;for(float i=1.;i<4.;i++){vec2 p=uv*i*3.+vec2(sin(t+i)*.5,cos(t*.8+i)*.5);c+=sin(p.x+t)*sin(p.y+t*1.1)/i;}
      c=pow(abs(c),2.)*1.5;vec3 base=vec3(.0,.25,.45);vec3 col=base+vec3(.2,.7,.9)*c;
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
