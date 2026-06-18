import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-raymarch-sdf', title:'Raymarched Shapes', cat:'Shaders WebGL',
  tags:['sdf','raymarching','3d','esfera','caja','iluminación','smin'],
  desc:'Escena de formas SDF (esfera y caja) por raymarching con luz difusa, especular y rotación.',
  meta:['WebGL','Raymarching','SDF'],
  prompt:`Crea una escena 3D por raymarching de funciones de distancia con signo (SDF) en un fragment shader WebGL (GLSL ES 1.0).
Técnica:
- Define sdSphere(p,r)=length(p)-r y sdBox(p,b)=length(max(abs(p)-b,0.0))+min(max(...),0.0).
- map(p): combina una esfera y una caja con smooth-min (smin con k de blend) para fusionarlas organicamente. Rota el espacio con u_t (matriz 2D en XZ y XY).
- raymarch: avanza t sumando map(ro+rd*t) hasta dist<eps o t>maxDist.
- Normal por gradiente de diferencias finitas (calcNormal).
- Iluminacion: Lambert (max(dot(n,l),0)) + especular Blinn-Phong + un termino ambiental. Suelo a y=-1 opcional.
Parametros: 90 pasos, eps=0.001, maxDist=20, smin k=0.5. Paleta violeta/turquesa (#7b5cff / #00e0c6).`,
  code:`// Fragment GLSL ES 1.0 (u_res, u_t ya declarados por el runtime)
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float sdSphere(vec3 p,float r){return length(p)-r;}
float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
float smin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float map(vec3 p){
  vec3 q=p; q.xz=rot(u_t*0.5)*q.xz; q.xy=rot(u_t*0.3)*q.xy;
  float s=sdSphere(q-vec3(0.55,0.0,0.0),0.6);
  float b=sdBox(q+vec3(0.55,0.0,0.0),vec3(0.45));
  return smin(s,b,0.5);
}
vec3 calcNormal(vec3 p){
  vec2 e=vec2(0.001,0.0);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
  vec3 ro=vec3(0.0,0.0,3.0);
  vec3 rd=normalize(vec3(uv,-1.5));
  float t=0.0; bool hit=false;
  for(int i=0;i<90;i++){
    vec3 p=ro+rd*t; float d=map(p);
    if(d<0.001){hit=true;break;}
    t+=d; if(t>20.0) break;
  }
  vec3 col=mix(vec3(0.03,0.03,0.06), vec3(0.06,0.05,0.12), 1.0-length(uv));
  if(hit){
    vec3 p=ro+rd*t; vec3 n=calcNormal(p);
    vec3 l=normalize(vec3(0.7,0.8,0.6));
    float diff=max(dot(n,l),0.0);
    vec3 h=normalize(l-rd);
    float spec=pow(max(dot(n,h),0.0),48.0);
    vec3 base=mix(vec3(0.48,0.36,1.0), vec3(0.0,0.88,0.78), n.y*0.5+0.5);
    col=base*(0.15+0.85*diff)+vec3(1.0)*spec*0.6;
  }
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
    float sdSphere(vec3 p,float r){return length(p)-r;}
    float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
    float smin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
    float map(vec3 p){
      vec3 q=p; q.xz=rot(u_t*0.5)*q.xz; q.xy=rot(u_t*0.3)*q.xy;
      float s=sdSphere(q-vec3(0.55,0.0,0.0),0.6);
      float b=sdBox(q+vec3(0.55,0.0,0.0),vec3(0.45));
      return smin(s,b,0.5);
    }
    vec3 calcNormal(vec3 p){
      vec2 e=vec2(0.001,0.0);
      return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
      vec3 ro=vec3(0.0,0.0,3.0);
      vec3 rd=normalize(vec3(uv,-1.5));
      float t=0.0; bool hit=false;
      for(int i=0;i<90;i++){
        vec3 p=ro+rd*t; float d=map(p);
        if(d<0.001){hit=true;break;}
        t+=d; if(t>20.0) break;
      }
      vec3 col=mix(vec3(0.03,0.03,0.06), vec3(0.06,0.05,0.12), 1.0-length(uv));
      if(hit){
        vec3 p=ro+rd*t; vec3 n=calcNormal(p);
        vec3 l=normalize(vec3(0.7,0.8,0.6));
        float diff=max(dot(n,l),0.0);
        vec3 h=normalize(l-rd);
        float spec=pow(max(dot(n,h),0.0),48.0);
        vec3 base=mix(vec3(0.48,0.36,1.0), vec3(0.0,0.88,0.78), n.y*0.5+0.5);
        col=base*(0.15+0.85*diff)+vec3(1.0)*spec*0.6;
      }
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
