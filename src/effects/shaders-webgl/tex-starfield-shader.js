import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-starfield-shader', title:'Starfield Warp', cat:'Shaders WebGL',
  tags:['estrellas','warp','velocidad','shader','espacio','hiperespacio'],
  desc:'Estrellas que se alejan del centro a gran velocidad. El warp espacial en un fragment shader.',
  meta:['WebGL','radial','Espacio'],
  prompt:`Fragment shader WebGL de campo de estrellas en warp (salto al hiperespacio).
Genera estrellas por capas usando hash sobre coordenadas polares; desplaza el radio con u_time para que parezca que vuelan hacia/desde el centro, alargándolas como rayas (motion blur radial).
Para intros, loaders o secciones "launch". Azul-violeta sobre negro.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
    void main(){vec2 uv=(gl_FragCoord.xy/u_res.xy-.5);uv.x*=u_res.x/u_res.y;
      float a=atan(uv.y,uv.x),r=length(uv);float col=0.;
      for(float i=1.;i<4.;i++){float rr=fract(r*3.*i - u_t*(.4+i*.2));float seed=floor(a/6.28318*60.*i)+i*13.;
        float st=step(.96,hash(vec2(seed,floor(r*3.*i-u_t*(.4+i*.2)))));col+=st*smoothstep(.5,1.,rr)*(1./i);}
      vec3 c=mix(vec3(.4,.35,1.),vec3(.6,.9,1.),r*2.)*col;c+=vec3(.02,.02,.06);gl_FragColor=vec4(c,1.);}`);}
};
export default effect;
