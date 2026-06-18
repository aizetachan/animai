import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-sobel-edge', title:'Sobel Edge', cat:'Postprocesado',
  tags:['sobel','edge detection','bordes','contorno','tinta','ink','outline'],
  desc:'Detección de bordes Sobel (look de tinta/contorno) sobre una escena procedural en movimiento.',
  meta:['webgl','postprocesado','Sobel'],
  prompt:`Postprocesado de detección de bordes Sobel en un fragment shader WebGL.
Técnica: 1) define una función luma(uv) que evalúe la escena base (ruido fbm + formas) y devuelva su brillo. 2) muestrea un vecindario 3x3 alrededor del pixel separados por px=1/u_res. 3) aplica los kernels Sobel:
  Gx = [-1 0 1; -2 0 2; -1 0 1], Gy = [-1 -2 -1; 0 0 0; 1 2 1].
  mag = sqrt(Gx*Gx + Gy*Gy). 4) el borde = smoothstep sobre mag; píntalo como tinta (línea oscura sobre fondo claro) o invierte para neón.
Anima la escena con u_t para ver los contornos moverse. Parámetros: tamaño del kernel (offset), umbral/ganancia del borde, grosor.`,
  code:`// GLSL ES 1.0 fragment (uniforms u_res, u_t provistos)
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
  float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
// luma de la escena base
float luma(vec2 uv){
  vec2 q=uv*3.0;
  float f=fbm(q+u_t*0.2);
  // un par de círculos en movimiento para dar bordes nítidos
  float c1=smoothstep(0.28,0.26,length(uv-vec2(0.35+0.12*sin(u_t),0.5)));
  float c2=smoothstep(0.22,0.20,length(uv-vec2(0.66,0.5+0.12*cos(u_t*0.8))));
  return clamp(f*0.8+c1+c2,0.0,1.0);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  vec2 px=1.5/u_res.xy;
  float tl=luma(uv+px*vec2(-1.,-1.)), tm=luma(uv+px*vec2(0.,-1.)), tr=luma(uv+px*vec2(1.,-1.));
  float ml=luma(uv+px*vec2(-1.,0.)),                              mr=luma(uv+px*vec2(1.,0.));
  float bl=luma(uv+px*vec2(-1.,1.)),  bm=luma(uv+px*vec2(0.,1.)), br=luma(uv+px*vec2(1.,1.));
  float gx=-tl-2.0*ml-bl + tr+2.0*mr+br;
  float gy=-tl-2.0*tm-tr + bl+2.0*bm+br;
  float mag=sqrt(gx*gx+gy*gy);
  float edge=smoothstep(0.15,0.6,mag);
  // tinta: línea de color marca sobre papel claro
  vec3 paper=vec3(0.93,0.94,0.97);
  vec3 ink=mix(vec3(0.482,0.361,1.0),vec3(0.0,0.878,0.776),uv.y);
  vec3 col=mix(paper,ink,edge);
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
      float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
      return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
    float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
    float luma(vec2 uv){
      vec2 q=uv*3.0;
      float f=fbm(q+u_t*0.2);
      float c1=smoothstep(0.28,0.26,length(uv-vec2(0.35+0.12*sin(u_t),0.5)));
      float c2=smoothstep(0.22,0.20,length(uv-vec2(0.66,0.5+0.12*cos(u_t*0.8))));
      return clamp(f*0.8+c1+c2,0.0,1.0);
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec2 px=1.5/u_res.xy;
      float tl=luma(uv+px*vec2(-1.,-1.)), tm=luma(uv+px*vec2(0.,-1.)), tr=luma(uv+px*vec2(1.,-1.));
      float ml=luma(uv+px*vec2(-1.,0.)),                              mr=luma(uv+px*vec2(1.,0.));
      float bl=luma(uv+px*vec2(-1.,1.)),  bm=luma(uv+px*vec2(0.,1.)), br=luma(uv+px*vec2(1.,1.));
      float gx=-tl-2.0*ml-bl + tr+2.0*mr+br;
      float gy=-tl-2.0*tm-tr + bl+2.0*bm+br;
      float mag=sqrt(gx*gx+gy*gy);
      float edge=smoothstep(0.15,0.6,mag);
      vec3 paper=vec3(0.93,0.94,0.97);
      vec3 ink=mix(vec3(0.482,0.361,1.0),vec3(0.0,0.878,0.776),uv.y);
      vec3 col=mix(paper,ink,edge);
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
