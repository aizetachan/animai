import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-emboss', title:'Emboss', cat:'Postprocesado',
  tags:['emboss','relieve','repujado','convolution','convolucion','edge','metal'],
  desc:'Relieve / repujado de la imagen mediante convolución emboss 3x3: resalta bordes como grabado en metal.',
  meta:['WebGL','convolution','kernel 3x3'],
  prompt:`Fragment shader de convolución emboss. Muestrea la imagen en una rejilla 3x3 alrededor del píxel (offset = 1/u_res) y aplica el kernel emboss:
[-2 -1  0]
[-1  1  1]
[ 0  1  2]
La suma de pesos = 1, por lo que las zonas planas quedan en su color y los bordes (diferencias en la diagonal) se realzan como luz/sombra, dando sensación de relieve. Para un look clásico de "metal repujado" se convierte a gris añadiendo 0.5 al resultado: gray = dot(emboss,luma)+0.5.
Parámetros: texel size (1/resolución), bias (0.5 para gris medio), ángulo del kernel (rota la dirección de la luz). Útil para grabados, sellos, UI metálica o detección de bordes estilizada.`,
  code:`// Fragment shader (GLSL ES 1.0) — Emboss (convolución 3x3)
// uniforms: sampler2D u_tex; vec2 u_res;
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 px = 1.0 / u_res.xy;            // tamaño de un texel
  // kernel emboss (suma de pesos = 1)
  vec3 sum = vec3(0.0);
  sum += texture2D(u_tex, uv + px*vec2(-1.0,-1.0)).rgb * -2.0;
  sum += texture2D(u_tex, uv + px*vec2( 0.0,-1.0)).rgb * -1.0;
  sum += texture2D(u_tex, uv + px*vec2(-1.0, 0.0)).rgb * -1.0;
  sum += texture2D(u_tex, uv                      ).rgb *  1.0;
  sum += texture2D(u_tex, uv + px*vec2( 1.0, 0.0)).rgb *  1.0;
  sum += texture2D(u_tex, uv + px*vec2( 0.0, 1.0)).rgb *  1.0;
  sum += texture2D(u_tex, uv + px*vec2( 1.0, 1.0)).rgb *  2.0;
  float gray = dot(sum, vec3(0.299,0.587,0.114)) + 0.5; // bias gris medio
  gl_FragColor = vec4(vec3(gray), 1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    vec3 scene(vec2 uv){
      // escena procedural con bordes y curvas para que el relieve se note
      vec3 bg=mix(vec3(0.06,0.05,0.14),vec3(0.12,0.06,0.22),uv.y);
      vec2 c=uv-0.5; c.x*=u_res.x/u_res.y;
      float r=length(c);
      float blob=smoothstep(0.30,0.28,r+0.05*sin(atan(c.y,c.x)*5.0+u_t));
      vec3 col=mix(bg,vec3(0.48,0.36,1.0),blob);
      // anillo turquesa
      float ring=smoothstep(0.02,0.0,abs(r-0.36));
      col=mix(col,vec3(0.0,0.88,0.78),ring);
      // rejilla fina
      vec2 g=abs(fract(uv*12.0)-0.5);
      col+=smoothstep(0.04,0.0,min(g.x,g.y))*0.12;
      return col;
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec2 px=1.0/u_res.xy;
      vec3 sum=vec3(0.0);
      sum+=scene(uv+px*vec2(-1.0,-1.0))*-2.0;
      sum+=scene(uv+px*vec2( 0.0,-1.0))*-1.0;
      sum+=scene(uv+px*vec2(-1.0, 0.0))*-1.0;
      sum+=scene(uv                   )* 1.0;
      sum+=scene(uv+px*vec2( 1.0, 0.0))* 1.0;
      sum+=scene(uv+px*vec2( 0.0, 1.0))* 1.0;
      sum+=scene(uv+px*vec2( 1.0, 1.0))* 2.0;
      float gray=dot(sum,vec3(0.299,0.587,0.114))+0.5;
      // tinte sutil hacia la marca en vez de gris puro
      vec3 col=vec3(gray)*mix(vec3(1.0),vec3(0.85,0.82,1.0),0.4);
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
