import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'aurora', title:'Aurora Gradient', cat:'Shaders WebGL',
  tags:['gradiente','fondo','hero','color','flujo','mesh'],
  desc:'Gradiente líquido en movimiento perpetuo. El clásico fondo de hero que se mueve solo sin distraer.',
  meta:['WebGL','Fragment shader','~0.4kb'],
  prompt:`Crea un fondo de hero a pantalla completa con un fragment shader WebGL.
Efecto: gradiente "aurora" líquido que fluye lentamente mezclando 3 colores de marca usando ruido fbm animado con u_time.
Velocidad MUY lenta (ambiente, no distracción). Paleta: #7b5cff, #00e0c6, #1a1330.
Respeta prefers-reduced-motion congelando el tiempo. En móvil baja dpr a 1.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float n(vec2 p){return sin(p.x)*sin(p.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=1.9;a*=.5;}return v;}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;uv.x*=u_res.x/u_res.y;float t=u_t*.25;
      float f=fbm(uv*3.+vec2(t,t*.7))+fbm(uv*5.-t*.5);
      vec3 a=vec3(.48,.36,1.),b=vec3(0.,.88,.78),c=vec3(.10,.07,.18);
      vec3 col=mix(c,a,smoothstep(-.3,.6,f));col=mix(col,b,smoothstep(.2,1.1,f*.8+uv.y*.5));
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
