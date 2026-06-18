import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-iridescence', title:'Iridescence', cat:'Shaders WebGL',
  tags:['iridescence','iridiscente','tornasol','aceite','react bits','holográfico'],
  desc:'Superficie iridiscente tornasolada, como aceite o nácar holográfico. Colores que cambian con el flujo.',
  meta:['WebGL','iridescent','React Bits'],
  prompt:`Fragment shader "Iridescence" (React Bits): una superficie tornasolada que cambia de color como una mancha de aceite, nácar o holograma, con los colores fluyendo según la posición y el tiempo.
Usa funciones trigonométricas sobre las UV para generar bandas de color del arcoíris que se desplazan y mezclan suavemente. Saturado y brillante.
Fondo llamativo para marcas creativas, música o moda futurista.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;uv.x*=u_res.x/u_res.y;
      float t=u_t*.5;float d=length(uv-.5);
      vec3 col;col.r=.5+.5*sin(uv.x*5.+t+d*6.);col.g=.5+.5*sin(uv.y*5.+t*1.2+d*6.+2.);col.b=.5+.5*sin((uv.x+uv.y)*4.+t*.8+d*6.+4.);
      col=mix(col,vec3(dot(col,vec3(.33))),.2);gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
