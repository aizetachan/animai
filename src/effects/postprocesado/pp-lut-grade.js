import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-lut-grade', title:'LUT Color Grade', cat:'Postprocesado',
  tags:['lut','color grading','gradación','cinematic','tone mapping','looks','remapeo'],
  desc:'Gradación de color cinematográfica (remapeo de tonos por canal) alternando varios looks.',
  meta:['webgl','postprocesado','LUT'],
  prompt:`Postprocesado de gradación de color (LUT) en un fragment shader WebGL.
Técnica: renderiza una escena base (gradiente/ruido suave) y luego remapea su color con una transformación tipo LUT.
Algoritmo del look: 1) lift/gamma/gain por canal — col = pow(col*gain, 1.0/gamma) + lift; 2) ajuste de temperatura (sube R, baja B para cálido; al revés para frío); 3) saturación: mezcla entre luma (dot(col,vec3(0.299,0.587,0.114))) y color; 4) contraste tipo S-curve alrededor de 0.5.
Define 3-4 paletas de coeficientes (teal&orange, frío azul, sepia, alto contraste) y mézclalas (mix) según un índice que avanza con u_t para alternar looks suavemente.
Parámetros: lift, gamma, gain por look, saturación, contraste, periodo de cambio.`,
  code:`// GLSL ES 1.0 fragment (uniforms u_res, u_t provistos)
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
  float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
// escena base procedural
vec3 scene(vec2 uv){
  float g=smoothstep(0.0,1.0,uv.y);
  float n=noise(uv*4.0+u_t*0.2)*0.5+noise(uv*9.0-u_t*0.1)*0.5;
  vec3 base=mix(vec3(0.15,0.18,0.30),vec3(0.85,0.78,0.62),g);
  base+= (n-0.5)*0.25;
  return clamp(base,0.0,1.0);
}
// gradación: lift/gamma/gain + temperatura + saturación + contraste
vec3 grade(vec3 c, vec3 lift, vec3 gamma, vec3 gain, float temp, float sat, float con){
  c=pow(max(c*gain,0.0),1.0/gamma)+lift;
  c.r+=temp*0.12; c.b-=temp*0.12;
  float l=dot(c,vec3(0.299,0.587,0.114));
  c=mix(vec3(l),c,sat);
  c=(c-0.5)*con+0.5;
  return clamp(c,0.0,1.0);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  vec3 col=scene(uv);
  // looks (teal&orange, frío, sepia)
  float ph=u_t*0.25; float k=fract(ph); float idx=floor(ph);
  vec3 a,b;
  // look A teal&orange
  vec3 cA=grade(col, vec3(0.0,0.01,0.04), vec3(0.95,1.0,1.1), vec3(1.15,1.0,0.85), 0.6, 1.25, 1.15);
  // look B frío azul
  vec3 cB=grade(col, vec3(0.02,0.02,0.06), vec3(1.1,1.0,0.9), vec3(0.85,0.95,1.2), -0.7, 1.1, 1.2);
  // look C sepia cálido
  vec3 cC=grade(col, vec3(0.05,0.02,0.0), vec3(0.9,0.95,1.05), vec3(1.2,1.05,0.8), 0.9, 0.6, 1.05);
  float m=mod(idx,3.0);
  if(m<0.5){a=cA;b=cB;} else if(m<1.5){a=cB;b=cC;} else {a=cC;b=cA;}
  vec3 outc=mix(a,b,smoothstep(0.0,1.0,k));
  // viñeta sutil
  float v=1.0-0.5*length(uv-0.5);
  outc*=v;
  gl_FragColor=vec4(outc,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
      float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
      return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
    vec3 scene(vec2 uv){
      float g=smoothstep(0.0,1.0,uv.y);
      float n=noise(uv*4.0+u_t*0.2)*0.5+noise(uv*9.0-u_t*0.1)*0.5;
      vec3 base=mix(vec3(0.15,0.18,0.30),vec3(0.85,0.78,0.62),g);
      base+=(n-0.5)*0.25;
      return clamp(base,0.0,1.0);
    }
    vec3 grade(vec3 c, vec3 lift, vec3 gamma, vec3 gain, float temp, float sat, float con){
      c=pow(max(c*gain,0.0),1.0/gamma)+lift;
      c.r+=temp*0.12; c.b-=temp*0.12;
      float l=dot(c,vec3(0.299,0.587,0.114));
      c=mix(vec3(l),c,sat);
      c=(c-0.5)*con+0.5;
      return clamp(c,0.0,1.0);
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec3 col=scene(uv);
      float ph=u_t*0.25; float k=fract(ph); float idx=floor(ph);
      vec3 a,b;
      vec3 cA=grade(col, vec3(0.0,0.01,0.04), vec3(0.95,1.0,1.1), vec3(1.15,1.0,0.85), 0.6, 1.25, 1.15);
      vec3 cB=grade(col, vec3(0.02,0.02,0.06), vec3(1.1,1.0,0.9), vec3(0.85,0.95,1.2), -0.7, 1.1, 1.2);
      vec3 cC=grade(col, vec3(0.05,0.02,0.0), vec3(0.9,0.95,1.05), vec3(1.2,1.05,0.8), 0.9, 0.6, 1.05);
      float m=mod(idx,3.0);
      if(m<0.5){a=cA;b=cB;} else if(m<1.5){a=cB;b=cC;} else {a=cC;b=cA;}
      vec3 outc=mix(a,b,smoothstep(0.0,1.0,k));
      float v=1.0-0.5*length(uv-0.5);
      outc*=v;
      gl_FragColor=vec4(outc,1.0);
    }`);}
};
export default effect;
