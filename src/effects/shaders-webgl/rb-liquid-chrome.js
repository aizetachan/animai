import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-liquid-chrome', title:'Liquid Chrome', cat:'Shaders WebGL',
  tags:['chrome','cromo','metal','líquido','react bits','reflejo','mercurio'],
  desc:'Metal cromado líquido que ondula como mercurio reflectante. Superficie metálica hipnótica.',
  meta:['WebGL','metal','React Bits'],
  prompt:`Fragment shader "Liquid Chrome" (React Bits): una superficie de cromo/mercurio líquido que ondula con reflejos metálicos brillantes que se deforman.
Genera bandas de alto contraste (blanco a negro) con funciones seno anidadas y distorsión de UV por tiempo, creando el aspecto de metal pulido líquido. Sin color o con un leve tinte frío.
Fondo industrial/futurista, muy de moda en marcas tech y música electrónica.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;uv.x*=u_res.x/u_res.y;uv*=3.;
      float t=u_t*.5;
      for(float i=1.;i<5.;i++){uv.x+=.4/i*sin(i*3.*uv.y+t)+.3;uv.y+=.4/i*cos(i*3.*uv.x+t)+.3;}
      float v=.5+.5*sin(uv.x+uv.y);v=pow(v,1.5);
      vec3 col=vec3(v)*vec3(.8,.85,1.);gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
