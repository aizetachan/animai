import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-domain-warp', title:'Domain Warping', cat:'Shaders WebGL',
  tags:['domain warping','fbm','noise','orgánico','fluido','iq','procedural'],
  desc:'Patrones orgánicos fluidos generados por fbm anidado (domain warping de Inigo Quilez).',
  meta:['WebGL','Sin librerías','60fps'],
  prompt:`Fragment shader WebGL de "domain warping" estilo Inigo Quilez.
Técnica: define ruido por valor (value noise) con hash de gradientes y un fbm (suma de octavas con frecuencia x2 y amplitud x0.5).
Aplica warping de dominio: q = fbm(p), r = fbm(p + q + offsets animados con u_t), color = fbm(p + r).
El anidamiento de fbm de fbm crea estructuras fluidas tipo nubes/tinta. Mapea el valor final con una paleta cosine y mezcla colores según q y r para dar profundidad.
Parámetros: número de octavas (4-6), escala espacial, velocidad temporal.`,
  code:`// GLSL ES 1.0 fragment (uniforms u_res, u_t provistos)
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
  return v;
}
void main(){
  vec2 uv=(gl_FragCoord.xy/u_res.xy-0.5);
  uv.x*=u_res.x/u_res.y;
  vec2 p=uv*3.0;
  float t=u_t*0.15;
  vec2 q=vec2(fbm(p+vec2(0.0,0.0)), fbm(p+vec2(5.2,1.3)));
  vec2 r=vec2(fbm(p+4.0*q+vec2(1.7+t,9.2)), fbm(p+4.0*q+vec2(8.3,2.8-t)));
  float f=fbm(p+4.0*r);
  vec3 c1=vec3(0.482,0.361,1.0);   // #7b5cff
  vec3 c2=vec3(0.0,0.878,0.776);   // #00e0c6
  vec3 col=mix(c1,c2,clamp(f*f*1.6,0.0,1.0));
  col=mix(col,vec3(0.04,0.05,0.12),clamp(length(q),0.0,1.0));
  col=mix(col,c2,clamp(r.x*0.6,0.0,1.0));
  col*=0.6+0.6*f;
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
      float a=hash(i),b=hash(i+vec2(1.0,0.0)),c=hash(i+vec2(0.0,1.0)),d=hash(i+vec2(1.0,1.0));
      return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
    float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
    void main(){
      vec2 uv=(gl_FragCoord.xy/u_res.xy-0.5);uv.x*=u_res.x/u_res.y;
      vec2 p=uv*3.0;float t=u_t*0.15;
      vec2 q=vec2(fbm(p),fbm(p+vec2(5.2,1.3)));
      vec2 r=vec2(fbm(p+4.0*q+vec2(1.7+t,9.2)),fbm(p+4.0*q+vec2(8.3,2.8-t)));
      float f=fbm(p+4.0*r);
      vec3 c1=vec3(0.482,0.361,1.0);vec3 c2=vec3(0.0,0.878,0.776);
      vec3 col=mix(c1,c2,clamp(f*f*1.6,0.0,1.0));
      col=mix(col,vec3(0.04,0.05,0.12),clamp(length(q),0.0,1.0));
      col=mix(col,c2,clamp(r.x*0.6,0.0,1.0));
      col*=0.6+0.6*f;
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
