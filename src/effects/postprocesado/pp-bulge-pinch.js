import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-bulge-pinch', title:'Bulge / Pinch', cat:'Postprocesado',
  tags:['bulge','pinch','lens','lente','distortion','fisheye','warp'],
  desc:'Lente que abomba (bulge) o pellizca (pinch) la imagen alrededor del centro. Distorsión radial animada.',
  meta:['WebGL','radial distortion','lens'],
  prompt:`Fragment shader de distorsión radial tipo lente. Centra las UV (uv-0.5), calcula el radio r=length(c) y reasigna el radio con una potencia: r' = pow(r, 1+k) donde k>0 pellizca (pinch) y k<0 abomba (bulge). Reconstruye uv = center + dir * (r'/r dentro de un radio de influencia, con un falloff suave smoothstep para que fuera del radio la imagen quede intacta. Anima k con sin(u_t) para alternar bulge<->pinch. Aplica sobre tu textura/escena; aquí se usa una rejilla procedural para visualizar la deformación.
Parámetros: strength (intensidad), radius (radio de influencia del lente), center (posición). Útil para zoom emotes, lupas, efectos de gota de agua.`,
  code:`// Fragment shader (GLSL ES 1.0) — Bulge / Pinch lens
// uniforms: sampler2D u_tex; vec2 u_res; float u_t; float u_strength; float u_radius;
vec2 lensDistort(vec2 uv, vec2 center, float radius, float strength){
  vec2 c = uv - center;
  float r = length(c) / radius;          // 0..1 dentro del lente
  if(r < 1.0){
    float p = pow(r, 1.0 + strength);    // strength>0 pinch, <0 bulge
    float falloff = smoothstep(1.0, 0.0, r); // borde suave
    float k = mix(1.0, p / max(r, 1e-4), falloff);
    return center + c * k;
  }
  return uv;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float strength = sin(u_t) * 0.9;       // alterna bulge/pinch
  uv = lensDistort(uv, vec2(0.5), 0.6, strength);
  gl_FragColor = texture2D(u_tex, uv);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    vec3 scene(vec2 uv){
      // rejilla procedural + diagonales para visualizar la deformación
      vec2 g=abs(fract(uv*9.0)-0.5);
      float line=smoothstep(0.06,0.0,min(g.x,g.y));
      vec3 bg=mix(vec3(0.05,0.04,0.12),vec3(0.10,0.05,0.20),uv.y);
      vec3 col=mix(bg,vec3(0.48,0.36,1.0),line);
      float diag=smoothstep(0.05,0.0,abs(fract((uv.x+uv.y)*6.0)-0.5));
      col=mix(col,vec3(0.0,0.88,0.78),diag*0.5);
      return col;
    }
    vec2 lensDistort(vec2 uv,vec2 center,float radius,float strength){
      vec2 c=uv-center; float r=length(c)/radius;
      if(r<1.0){
        float p=pow(r,1.0+strength);
        float fall=smoothstep(1.0,0.0,r);
        float k=mix(1.0,p/max(r,1e-4),fall);
        return center+c*k;
      }
      return uv;
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec2 center=vec2(0.5);
      float strength=sin(u_t)*0.9;
      vec2 duv=lensDistort(uv,center,0.62,strength);
      vec3 col=scene(duv);
      // halo del lente
      float ring=smoothstep(0.62,0.6,length(uv-center))*smoothstep(0.55,0.62,length(uv-center));
      col+=ring*vec3(0.48,0.36,1.0)*0.6;
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
