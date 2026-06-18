import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-halftone', title:'Halftone', cat:'Postprocesado',
  tags:['halftone','semitono','cmyk','tramado','print','offset','dots'],
  desc:'Tramado de semitonos CMYK (cuatro canales rotados) sobre un gradiente animado.',
  meta:['webgl','postprocesado','CMYK'],
  prompt:`Postprocesado de semitonos CMYK (offset/print) en un fragment shader WebGL.
Técnica: 1) genera una escena base de color (gradiente animado). 2) convierte RGB a CMYK: k=1-max(r,g,b); c=(1-r-k)/(1-k), m=(1-g-k)/(1-k), y=(1-b-k)/(1-k). 3) para cada canal rota las coordenadas del pixel por su ángulo de pantalla clásico (C 15º, M 75º, Y 0º, K 45º), construye una rejilla con fract() y compara la distancia al centro de la celda contra el valor del canal: el punto crece con la densidad del canal (dot = step(dist, sqrt(valor)*radio)).
4) compón restando cada tinta del blanco. Usa antialias con smoothstep en el borde del punto.
Parámetros: tamaño de celda (escala), ángulos por canal, radio máximo.`,
  code:`// GLSL ES 1.0 fragment (uniforms u_res, u_t provistos)
// densidad de un canal de tinta tramado a 'ang' grados
float halftone(vec2 frag, float ang, float amount, float cell){
  float s=sin(ang),c=cos(ang);
  mat2 R=mat2(c,-s,s,c);
  vec2 p=R*frag/cell;
  vec2 g=fract(p)-0.5;          // centro de celda
  float d=length(g)*2.0;        // 0 en centro, ~1 en borde
  float r=sqrt(clamp(amount,0.0,1.0)); // radio crece con densidad
  return 1.0-smoothstep(r-0.12,r+0.12,d);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  // escena base: gradiente animado en colores de marca
  vec3 col=mix(vec3(0.482,0.361,1.0),vec3(0.0,0.878,0.776),
               0.5+0.5*sin(uv.x*3.1416+u_t*0.6));
  col=mix(col,vec3(1.0,0.45,0.3),0.5+0.5*sin(uv.y*2.0-u_t*0.5));
  col*= (0.35+0.65*uv.y);
  // RGB -> CMYK
  float k=1.0-max(max(col.r,col.g),col.b);
  float inv=max(1.0-k,1e-3);
  float C=(1.0-col.r-k)/inv;
  float M=(1.0-col.g-k)/inv;
  float Y=(1.0-col.b-k)/inv;
  float cell=6.0;
  vec2 f=gl_FragCoord.xy;
  float dC=halftone(f,0.2618,C,cell); // 15º
  float dM=halftone(f,1.3090,M,cell); // 75º
  float dY=halftone(f,0.0,   Y,cell); // 0º
  float dK=halftone(f,0.7854,k,cell); // 45º
  // composición sustractiva sobre blanco
  vec3 outc=vec3(1.0);
  outc-=vec3(0.0,1.0,1.0)*dC; // cian quita R
  outc-=vec3(1.0,0.0,1.0)*dM; // magenta quita G
  outc-=vec3(1.0,1.0,0.0)*dY; // amarillo quita B
  outc-=vec3(1.0)*dK*0.9;     // negro
  gl_FragColor=vec4(clamp(outc,0.0,1.0),1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float halftone(vec2 frag, float ang, float amount, float cell){
      float s=sin(ang),c=cos(ang);
      mat2 R=mat2(c,-s,s,c);
      vec2 p=R*frag/cell;
      vec2 g=fract(p)-0.5;
      float d=length(g)*2.0;
      float r=sqrt(clamp(amount,0.0,1.0));
      return 1.0-smoothstep(r-0.12,r+0.12,d);
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec3 col=mix(vec3(0.482,0.361,1.0),vec3(0.0,0.878,0.776),
                   0.5+0.5*sin(uv.x*3.1416+u_t*0.6));
      col=mix(col,vec3(1.0,0.45,0.3),0.5+0.5*sin(uv.y*2.0-u_t*0.5));
      col*=(0.35+0.65*uv.y);
      float k=1.0-max(max(col.r,col.g),col.b);
      float inv=max(1.0-k,1e-3);
      float C=(1.0-col.r-k)/inv;
      float M=(1.0-col.g-k)/inv;
      float Y=(1.0-col.b-k)/inv;
      float cell=6.0;
      vec2 f=gl_FragCoord.xy;
      float dC=halftone(f,0.2618,C,cell);
      float dM=halftone(f,1.3090,M,cell);
      float dY=halftone(f,0.0,   Y,cell);
      float dK=halftone(f,0.7854,k,cell);
      vec3 outc=vec3(1.0);
      outc-=vec3(0.0,1.0,1.0)*dC;
      outc-=vec3(1.0,0.0,1.0)*dM;
      outc-=vec3(1.0,1.0,0.0)*dY;
      outc-=vec3(1.0)*dK*0.9;
      gl_FragColor=vec4(clamp(outc,0.0,1.0),1.0);
    }`);}
};
export default effect;
