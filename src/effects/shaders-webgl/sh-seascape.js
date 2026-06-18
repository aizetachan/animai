import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-seascape', title:'Seascape', cat:'Shaders WebGL',
  tags:['océano','olas','agua','raymarching','sea','water','tdm'],
  desc:'Océano raymarcheado con olas animadas, estilo Seascape de TDM.',
  meta:['WebGL','Raymarching','Ocean'],
  prompt:`Crea un oceano animado estilo "Seascape" (Alexander Alekseev / TDM) en un fragment shader WebGL (GLSL ES 1.0).
Tecnica:
- map(p): altura del agua sumando varias octavas de una funcion de ola. Cada octava usa sea_octave(uv,choppy): combina noise con sin/abs para olas afiladas. Aplica una matriz octava (octave_m) y modula amplitud (*=0.22) y frecuencia (*=1.9) por octava, con choppy variable. El tiempo desplaza las olas.
- heightMapTracing: raymarching por biseccion sobre la altura del mar (busca el cruce entre el rayo y la superficie).
- getNormalFromHeight: normal por diferencias finitas de map().
- getSeaColor: mezcla color profundo (azul) y de cresta + Fresnel (reflejo del cielo) + un componente especular y subsurface scattering en las crestas.
- Cielo: gradiente. Camara mirando ligeramente hacia abajo.
Parametros: 3 octavas en preview, SEA_HEIGHT=0.6, SEA_CHOPPY=4, SEA_SPEED=0.8, SEA_FREQ=0.16. Tinte turquesa (#00e0c6).`,
  code:`// Fragment GLSL ES 1.0 (u_res, u_t ya declarados por el runtime)
const int OCTAVES=3;
const float SEA_HEIGHT=0.6;
const float SEA_CHOPPY=4.0;
const float SEA_SPEED=0.8;
const float SEA_FREQ=0.16;
mat2 octave_m=mat2(1.6,1.2,-1.2,1.6);
float hash(vec2 p){float h=dot(p,vec2(127.1,311.7));return fract(sin(h)*43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return -1.0+2.0*mix(mix(hash(i+vec2(0.0,0.0)),hash(i+vec2(1.0,0.0)),u.x),
                      mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}
float sea_octave(vec2 uv,float choppy){
  uv+=noise(uv);
  vec2 wv=1.0-abs(sin(uv));
  vec2 swv=abs(cos(uv));
  wv=mix(wv,swv,wv);
  return pow(1.0-pow(wv.x*wv.y,0.65),choppy);
}
float map(vec3 p,float t){
  float freq=SEA_FREQ, amp=SEA_HEIGHT, choppy=SEA_CHOPPY;
  vec2 uv=p.xz; uv.x*=0.75;
  float h=0.0;
  for(int i=0;i<OCTAVES;i++){
    float d=sea_octave((uv+t)*freq,choppy);
    d+=sea_octave((uv-t)*freq,choppy);
    h+=d*amp;
    uv*=octave_m; freq*=1.9; amp*=0.22; choppy=mix(choppy,1.0,0.2);
  }
  return p.y-h;
}
vec3 getNormal(vec3 p,float eps,float t){
  vec3 n;
  n.y=map(p,t);
  n.x=map(vec3(p.x+eps,p.y,p.z),t)-n.y;
  n.z=map(vec3(p.x,p.y,p.z+eps),t)-n.y;
  n.y=eps;
  return normalize(n);
}
vec3 getSeaColor(vec3 p,vec3 n,vec3 l,vec3 eye,vec3 dist){
  float fresnel=clamp(1.0-dot(n,-eye),0.0,1.0);
  fresnel=pow(fresnel,3.0)*0.5;
  vec3 sky=vec3(0.4,0.7,1.0);
  vec3 water=vec3(0.0,0.32,0.36);
  vec3 reflected=sky;
  vec3 refracted=water+pow(max(dot(n,l),0.0),3.0)*vec3(0.0,0.88,0.78)*0.6;
  vec3 col=mix(refracted,reflected,fresnel);
  float atten=max(1.0-dot(dist,dist)*0.001,0.0);
  col+=water*(p.y-SEA_HEIGHT)*0.18*atten;
  float spec=pow(max(dot(reflect(eye,n),l),0.0),60.0);
  col+=vec3(spec);
  return col;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
  float t=u_t*SEA_SPEED;
  vec3 ro=vec3(0.0,3.5,t*2.0);
  vec3 rd=normalize(vec3(uv.x,uv.y-0.35,-1.0));
  // height map tracing (biseccion)
  vec3 p=ro; float tmin=0.0,tmax=40.0;
  float hx=map(ro+rd*tmax,t);
  if(hx>0.0){ p=ro+rd*tmax; }
  else{
    float hm=map(ro+rd*tmin,t);
    float tmid=0.0;
    for(int i=0;i<8;i++){
      tmid=mix(tmin,tmax,hm/(hm-hx));
      p=ro+rd*tmid;
      float hmid=map(p,t);
      if(hmid<0.0){tmax=tmid;hx=hmid;}else{tmin=tmid;hm=hmid;}
    }
  }
  vec3 dist=p-ro;
  vec3 n=getNormal(p,dot(dist,dist)*(0.1/u_res.x),t);
  vec3 light=normalize(vec3(0.0,0.9,0.4));
  vec3 sky=mix(vec3(0.2,0.45,0.85),vec3(0.55,0.78,1.0),pow(max(rd.y,0.0),0.5));
  vec3 sea=getSeaColor(p,n,light,rd,dist);
  vec3 col=mix(sky,sea,smoothstep(0.0,-0.02,rd.y));
  col=pow(col,vec3(0.75));
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    const int OCTAVES=3;
    const float SEA_HEIGHT=0.6;
    const float SEA_CHOPPY=4.0;
    const float SEA_SPEED=0.8;
    const float SEA_FREQ=0.16;
    mat2 octave_m=mat2(1.6,1.2,-1.2,1.6);
    float hash(vec2 p){float h=dot(p,vec2(127.1,311.7));return fract(sin(h)*43758.5453123);}
    float noise(vec2 p){
      vec2 i=floor(p),f=fract(p);
      vec2 u=f*f*(3.0-2.0*f);
      return -1.0+2.0*mix(mix(hash(i+vec2(0.0,0.0)),hash(i+vec2(1.0,0.0)),u.x),
                          mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
    }
    float sea_octave(vec2 uv,float choppy){
      uv+=noise(uv);
      vec2 wv=1.0-abs(sin(uv));
      vec2 swv=abs(cos(uv));
      wv=mix(wv,swv,wv);
      return pow(1.0-pow(wv.x*wv.y,0.65),choppy);
    }
    float map(vec3 p,float t){
      float freq=SEA_FREQ, amp=SEA_HEIGHT, choppy=SEA_CHOPPY;
      vec2 uv=p.xz; uv.x*=0.75;
      float h=0.0;
      for(int i=0;i<OCTAVES;i++){
        float d=sea_octave((uv+t)*freq,choppy);
        d+=sea_octave((uv-t)*freq,choppy);
        h+=d*amp;
        uv*=octave_m; freq*=1.9; amp*=0.22; choppy=mix(choppy,1.0,0.2);
      }
      return p.y-h;
    }
    vec3 getNormal(vec3 p,float eps,float t){
      vec3 n;
      n.y=map(p,t);
      n.x=map(vec3(p.x+eps,p.y,p.z),t)-n.y;
      n.z=map(vec3(p.x,p.y,p.z+eps),t)-n.y;
      n.y=eps;
      return normalize(n);
    }
    vec3 getSeaColor(vec3 p,vec3 n,vec3 l,vec3 eye,vec3 dist){
      float fresnel=clamp(1.0-dot(n,-eye),0.0,1.0);
      fresnel=pow(fresnel,3.0)*0.5;
      vec3 sky=vec3(0.4,0.7,1.0);
      vec3 water=vec3(0.0,0.32,0.36);
      vec3 reflected=sky;
      vec3 refracted=water+pow(max(dot(n,l),0.0),3.0)*vec3(0.0,0.88,0.78)*0.6;
      vec3 col=mix(refracted,reflected,fresnel);
      float atten=max(1.0-dot(dist,dist)*0.001,0.0);
      col+=water*(p.y-SEA_HEIGHT)*0.18*atten;
      float spec=pow(max(dot(reflect(eye,n),l),0.0),60.0);
      col+=vec3(spec);
      return col;
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
      float t=u_t*SEA_SPEED;
      vec3 ro=vec3(0.0,3.5,t*2.0);
      vec3 rd=normalize(vec3(uv.x,uv.y-0.35,-1.0));
      vec3 p=ro; float tmin=0.0,tmax=40.0;
      float hx=map(ro+rd*tmax,t);
      if(hx>0.0){ p=ro+rd*tmax; }
      else{
        float hm=map(ro+rd*tmin,t);
        float tmid=0.0;
        for(int i=0;i<8;i++){
          tmid=mix(tmin,tmax,hm/(hm-hx));
          p=ro+rd*tmid;
          float hmid=map(p,t);
          if(hmid<0.0){tmax=tmid;hx=hmid;}else{tmin=tmid;hm=hmid;}
        }
      }
      vec3 dist=p-ro;
      vec3 n=getNormal(p,dot(dist,dist)*(0.1/u_res.x),t);
      vec3 light=normalize(vec3(0.0,0.9,0.4));
      vec3 sky=mix(vec3(0.2,0.45,0.85),vec3(0.55,0.78,1.0),pow(max(rd.y,0.0),0.5));
      vec3 sea=getSeaColor(p,n,light,rd,dist);
      vec3 col=mix(sky,sea,smoothstep(0.0,-0.02,rd.y));
      col=pow(col,vec3(0.75));
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
