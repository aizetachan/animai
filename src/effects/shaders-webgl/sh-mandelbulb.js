import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-mandelbulb', title:'Mandelbulb', cat:'Shaders WebGL',
  tags:['fractal','mandelbulb','raymarching','3d','sdf','procedural','distance estimator'],
  desc:'Fractal 3D Mandelbulb renderizado por raymarching con estimador de distancia.',
  meta:['WebGL','Raymarching','Fractal'],
  prompt:`Crea un fractal 3D Mandelbulb en un fragment shader WebGL (GLSL ES 1.0).
Técnica: raymarching con distance estimator (DE).
- Define una función DE(p) que itera z = z^power + c sobre el espacio 3D usando coordenadas esféricas:
  r=length(z); theta=acos(z.z/r); phi=atan(z.y,z.x); zr=pow(r,power); zr y los ángulos se multiplican por power; z=zr*vec3(sin(theta*power)*cos(phi*power), sin(phi*power)*sin(theta*power), cos(theta*power)) + c.
- Acumula dr (derivada de la distancia): dr = pow(r,power-1)*power*dr + 1.
- Distancia estimada: 0.5*log(r)*r/dr.
- Power tipico = 8.0. Rota el punto en Y con u_t para animar.
- Marcha el rayo desde una camara, suma t hasta golpear (dist<eps) o superar maxDist.
- Colorea con un ambient occlusion barato basado en el numero de iteraciones / pasos consumidos, y aplica una paleta violeta-turquesa (#7b5cff / #00e0c6).
Parametros: power=8, iteraciones DE=8, pasos de marcha=80, eps=0.0015.`,
  code:`// Fragment GLSL ES 1.0 (uniforms u_res, u_t ya declarados por el runtime)
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float DE(vec3 p, out float trap){
  vec3 z=p; float dr=1.0; float r=0.0; float power=8.0; trap=1e10;
  for(int i=0;i<8;i++){
    r=length(z); if(r>2.0) break;
    float theta=acos(z.z/r);
    float phi=atan(z.y,z.x);
    dr=pow(r,power-1.0)*power*dr+1.0;
    float zr=pow(r,power);
    theta*=power; phi*=power;
    z=zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta))+p;
    trap=min(trap,r);
  }
  return 0.5*log(r)*r/dr;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
  vec3 ro=vec3(0.0,0.0,2.6);
  vec3 rd=normalize(vec3(uv,-1.6));
  float a=u_t*0.3;
  float t=0.0; float trap=0.0; float steps=0.0; bool hit=false;
  for(int i=0;i<80;i++){
    vec3 p=ro+rd*t;
    p.xz=rot(a)*p.xz; p.xy=rot(a*0.4)*p.xy;
    float d=DE(p,trap);
    if(d<0.0015){hit=true;break;}
    t+=d; steps+=1.0;
    if(t>6.0) break;
  }
  vec3 col=vec3(0.02,0.02,0.05);
  if(hit){
    float ao=1.0-steps/80.0;
    vec3 base=mix(vec3(0.48,0.36,1.0), vec3(0.0,0.88,0.78), trap);
    col=base*ao*ao + vec3(0.05);
  }
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
    float DE(vec3 p, out float trap){
      vec3 z=p; float dr=1.0; float r=0.0; float power=8.0; trap=1e10;
      for(int i=0;i<8;i++){
        r=length(z); if(r>2.0) break;
        float theta=acos(z.z/r);
        float phi=atan(z.y,z.x);
        dr=pow(r,power-1.0)*power*dr+1.0;
        float zr=pow(r,power);
        theta*=power; phi*=power;
        z=zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta))+p;
        trap=min(trap,r);
      }
      return 0.5*log(r)*r/dr;
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
      vec3 ro=vec3(0.0,0.0,2.6);
      vec3 rd=normalize(vec3(uv,-1.6));
      float a=u_t*0.3;
      float t=0.0; float trap=0.0; float steps=0.0; bool hit=false;
      for(int i=0;i<80;i++){
        vec3 p=ro+rd*t;
        p.xz=rot(a)*p.xz; p.xy=rot(a*0.4)*p.xy;
        float d=DE(p,trap);
        if(d<0.0015){hit=true;break;}
        t+=d; steps+=1.0;
        if(t>6.0) break;
      }
      vec3 col=vec3(0.02,0.02,0.05);
      if(hit){
        float ao=1.0-steps/80.0;
        vec3 base=mix(vec3(0.48,0.36,1.0), vec3(0.0,0.88,0.78), trap);
        col=base*ao*ao + vec3(0.05);
      }
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
