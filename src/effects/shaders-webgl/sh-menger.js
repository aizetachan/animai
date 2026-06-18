import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-menger', title:'Menger Sponge', cat:'Shaders WebGL',
  tags:['fractal','menger','raymarching','3d','sponge','sdf','ifs'],
  desc:'Esponja de Menger raymarcheada: fractal IFS que rota con perforaciones infinitas.',
  meta:['WebGL','Raymarching','Fractal IFS'],
  prompt:`Fragment shader WebGL1 que renderiza una esponja de Menger por raymarching.
Técnica: define un SDF de caja (sdBox) y construye el fractal por iteración IFS: en cada iteración escala el espacio x3 (p=abs(mod(p*3,2)-1)) y resta una cruz infinita (mínimo de tres cajas tubo en cada eje) dividiendo la distancia por la escala acumulada. Marcha un rayo desde la cámara con un bucle de ~64 pasos hasta acercarse a la superficie.
Iluminación por normales con gradiente del SDF y oclusión ambiental basada en el número de pasos. Rota la cámara con u_t. Paleta violeta (#7b5cff) a turquesa (#00e0c6).`,
  code:`// Fragment GLSL (WebGL1) — usar con shaderPreview(el, frag)
// shaderPreview ya inyecta: precision highp float; uniform vec2 u_res; uniform float u_t;
float sdBox(vec3 p, vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0); }
float sdCross(vec3 p){
  float a=sdBox(vec3(p.x,p.y,p.z), vec3(1e5,1.0,1.0));
  float b=sdBox(vec3(p.y,p.z,p.x), vec3(1.0,1e5,1.0));
  float c=sdBox(vec3(p.z,p.x,p.y), vec3(1.0,1.0,1e5));
  return min(a,min(b,c));
}
float map(vec3 p){
  float d=sdBox(p, vec3(1.0));
  float s=1.0;
  for(int i=0;i<4;i++){
    vec3 a=mod(p*s,2.0)-1.0;
    s*=3.0;
    vec3 r=abs(1.0-3.0*abs(a));
    float c=sdCross(r)/s;
    d=max(d,c);
  }
  return d;
}
vec3 calcNormal(vec3 p){
  vec2 e=vec2(0.001,0.0);
  return normalize(vec3(
    map(p+e.xyy)-map(p-e.xyy),
    map(p+e.yxy)-map(p-e.yxy),
    map(p+e.yyx)-map(p-e.yyx)));
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
  float ang=u_t*0.4;
  vec3 ro=vec3(sin(ang)*3.0,1.6,cos(ang)*3.0);
  vec3 ww=normalize(-ro), uu=normalize(cross(vec3(0.0,1.0,0.0),ww)), vv=cross(ww,uu);
  vec3 rd=normalize(uv.x*uu+uv.y*vv+1.4*ww);
  float t=0.0; float steps=0.0; bool hit=false;
  for(int i=0;i<70;i++){
    vec3 p=ro+rd*t;
    float d=map(p);
    if(d<0.001){ hit=true; break; }
    t+=d; steps+=1.0;
    if(t>10.0) break;
  }
  vec3 col=vec3(0.02,0.02,0.05);
  if(hit){
    vec3 p=ro+rd*t;
    vec3 n=calcNormal(p);
    vec3 lig=normalize(vec3(0.6,0.8,0.4));
    float dif=clamp(dot(n,lig),0.0,1.0);
    float ao=1.0-steps/70.0;
    vec3 base=mix(vec3(0.48,0.36,1.0),vec3(0.0,0.88,0.78),0.5+0.5*n.y);
    col=base*(0.2+0.8*dif)*ao;
    col+=base*0.15;
  }
  col=pow(col,vec3(0.45));
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float sdBox(vec3 p, vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0); }
    float sdCross(vec3 p){
      float a=sdBox(vec3(p.x,p.y,p.z), vec3(1e5,1.0,1.0));
      float b=sdBox(vec3(p.y,p.z,p.x), vec3(1.0,1e5,1.0));
      float c=sdBox(vec3(p.z,p.x,p.y), vec3(1.0,1.0,1e5));
      return min(a,min(b,c));
    }
    float map(vec3 p){
      float d=sdBox(p, vec3(1.0));
      float s=1.0;
      for(int i=0;i<4;i++){
        vec3 a=mod(p*s,2.0)-1.0;
        s*=3.0;
        vec3 r=abs(1.0-3.0*abs(a));
        float c=sdCross(r)/s;
        d=max(d,c);
      }
      return d;
    }
    vec3 calcNormal(vec3 p){
      vec2 e=vec2(0.001,0.0);
      return normalize(vec3(
        map(p+e.xyy)-map(p-e.xyy),
        map(p+e.yxy)-map(p-e.yxy),
        map(p+e.yyx)-map(p-e.yyx)));
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
      float ang=u_t*0.4;
      vec3 ro=vec3(sin(ang)*3.0,1.6,cos(ang)*3.0);
      vec3 ww=normalize(-ro), uu=normalize(cross(vec3(0.0,1.0,0.0),ww)), vv=cross(ww,uu);
      vec3 rd=normalize(uv.x*uu+uv.y*vv+1.4*ww);
      float t=0.0; float steps=0.0; bool hit=false;
      for(int i=0;i<70;i++){
        vec3 p=ro+rd*t;
        float d=map(p);
        if(d<0.001){ hit=true; break; }
        t+=d; steps+=1.0;
        if(t>10.0) break;
      }
      vec3 col=vec3(0.02,0.02,0.05);
      if(hit){
        vec3 p=ro+rd*t;
        vec3 n=calcNormal(p);
        vec3 lig=normalize(vec3(0.6,0.8,0.4));
        float dif=clamp(dot(n,lig),0.0,1.0);
        float ao=1.0-steps/70.0;
        vec3 base=mix(vec3(0.48,0.36,1.0),vec3(0.0,0.88,0.78),0.5+0.5*n.y);
        col=base*(0.2+0.8*dif)*ao;
        col+=base*0.15;
      }
      col=pow(col,vec3(0.45));
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
