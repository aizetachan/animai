import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-mesh-gradient', title:'Mesh Gradient (Stripe)', cat:'Shaders WebGL',
  tags:['mesh','gradient','stripe','suave','fondo','color','corporate'],
  desc:'Gradiente mesh suave que fluye entre 4 colores, tipo fondo de Stripe. Limpio y corporate.',
  meta:['WebGL','interpolación','Fondo'],
  prompt:`Fragment shader de "mesh gradient" suave tipo Stripe: cuatro (o más) colores en las esquinas que se interpolan y se desplazan lentamente con ruido para un fondo vivo pero sutil.
Mezcla los colores según la UV y añade un offset de ruido temporal para que las manchas de color se muevan despacio. Sin bordes duros, todo difuso.
Fondo corporate premium para heros y secciones de pricing.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;
      uv.x+=noise(uv*2.+u_t*.1)*.3-.15;uv.y+=noise(uv*2.-u_t*.12)*.3-.15;
      vec3 c1=vec3(.48,.36,1.),c2=vec3(0.,.88,.78),c3=vec3(1.,.36,.66),c4=vec3(.18,.13,.32);
      vec3 top=mix(c1,c2,uv.x),bot=mix(c4,c3,uv.x);vec3 col=mix(top,bot,uv.y);
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
