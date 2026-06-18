import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-godrays', title:'God Rays', cat:'Shaders WebGL',
  tags:['god rays','volumetric','radial blur','light shafts','rayos','luz'],
  desc:'Rayos de luz radiales mediante radial blur de una fuente luminosa en el shader.',
  meta:['WebGL','Sin librerías','60fps'],
  prompt:`Fragment shader WebGL de "god rays" (light shafts) por radial blur.
Técnica: define una fuente de luz en pantalla. Para cada fragmento, da pasos (samples ~24-48) caminando desde el píxel hacia la posición de la luz, acumulando el brillo de una escena base (un disco/halo + nubes de ruido que ocluyen).
Aplica decay (caída por paso), density (espaciado), weight (peso por muestra) y exposure (ganancia final) — el clásico algoritmo de god rays de GPU Gems.
La suma direccional hacia la luz produce los haces radiales. Anima la oclusión y un leve vaivén de la luz con u_t.
Parámetros: NUM_SAMPLES, density, decay, weight, exposure.`,
  code:`// GLSL ES 1.0 fragment (uniforms u_res, u_t provistos)
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),
             mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}
// brillo de la escena base en una coord uv (luz + nubes que ocluyen)
float scene(vec2 uv, vec2 light, float t){
  float d=length(uv-light);
  float core=smoothstep(0.18,0.0,d);            // disco luminoso
  float clouds=noise(uv*4.0+vec2(t*0.3,t*0.1));
  clouds=smoothstep(0.45,0.9,clouds);
  return clamp(core - clouds*0.6, 0.0, 1.0);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  float asp=u_res.x/u_res.y;
  float t=u_t;
  vec2 light=vec2(0.5+0.18*sin(t*0.3), 0.62+0.06*cos(t*0.4));
  vec2 delta=(light-uv);
  const int NUM=40;
  float density=0.85, decay=0.96, weight=0.5, exposure=0.32;
  delta*=density/float(NUM);
  vec2 coord=uv; float illum=1.0; float col=0.0;
  for(int i=0;i<NUM;i++){
    coord+=delta;
    vec2 c=coord; c.x=(c.x-0.5)*asp+0.5;
    vec2 l=light; l.x=(l.x-0.5)*asp+0.5;
    float s=scene(c,l,t)*illum*weight;
    col+=s; illum*=decay;
  }
  col*=exposure;
  vec3 tint=mix(vec3(0.482,0.361,1.0), vec3(0.0,0.878,0.776), 0.5+0.5*sin(t*0.2));
  vec3 outc=vec3(col)*tint*2.2 + vec3(0.03,0.04,0.09);
  gl_FragColor=vec4(outc,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);}
    float scene(vec2 uv,vec2 light,float t){
      float d=length(uv-light);
      float core=smoothstep(0.18,0.0,d);
      float clouds=noise(uv*4.0+vec2(t*0.3,t*0.1));
      clouds=smoothstep(0.45,0.9,clouds);
      return clamp(core-clouds*0.6,0.0,1.0);
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      float asp=u_res.x/u_res.y;float t=u_t;
      vec2 light=vec2(0.5+0.18*sin(t*0.3),0.62+0.06*cos(t*0.4));
      vec2 delta=(light-uv);
      const int NUM=40;
      float density=0.85,decay=0.96,weight=0.5,exposure=0.32;
      delta*=density/float(NUM);
      vec2 coord=uv;float illum=1.0;float col=0.0;
      for(int i=0;i<NUM;i++){
        coord+=delta;
        vec2 c=coord;c.x=(c.x-0.5)*asp+0.5;
        vec2 l=light;l.x=(l.x-0.5)*asp+0.5;
        float s=scene(c,l,t)*illum*weight;
        col+=s;illum*=decay;
      }
      col*=exposure;
      vec3 tint=mix(vec3(0.482,0.361,1.0),vec3(0.0,0.878,0.776),0.5+0.5*sin(t*0.2));
      vec3 outc=vec3(col)*tint*2.2+vec3(0.03,0.04,0.09);
      gl_FragColor=vec4(outc,1.0);
    }`);}
};
export default effect;
