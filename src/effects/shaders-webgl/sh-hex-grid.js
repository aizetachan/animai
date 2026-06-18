import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-hex-grid', title:'Hex Grid Glow', cat:'Shaders WebGL',
  tags:['hexágonos','grid','rejilla','glow','panal','shader','tech'],
  desc:'Rejilla hexagonal donde cada celda late y brilla con una pulsación radial.',
  meta:['WebGL','Hex tiling','UI tech'],
  prompt:`Fragment shader WebGL1 de una rejilla hexagonal brillante (estilo panal tech).
Técnica: teselado hexagonal. Convierte el UV a coordenadas de hexágono mediante dos candidatos de celda (la red hex se obtiene con vec2(1.0, 1.732) y un desfase de medio paso) y elige el centro más cercano; la distancia al borde del hexágono se calcula con la métrica hexagonal max(dot con direcciones a 60 grados). Cada celda obtiene un id estable para hashear una fase; haz que late con sin(u_t + fase) y propaga una onda radial desde el centro. Pinta el borde fino + un glow interior. Paleta violeta (#7b5cff) a turquesa (#00e0c6).`,
  code:`// Fragment GLSL (WebGL1) — usar con shaderPreview(el, frag)
// shaderPreview ya inyecta: precision highp float; uniform vec2 u_res; uniform float u_t;
float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+34.56); return fract(p.x*p.y); }
// Devuelve: xy = uv local al centro del hex, zw = id de la celda
vec4 hexCoords(vec2 uv){
  vec2 r=vec2(1.0,1.732);
  vec2 h=r*0.5;
  vec2 a=mod(uv,r)-h;
  vec2 b=mod(uv-h,r)-h;
  vec2 gv = dot(a,a)<dot(b,b) ? a : b;
  vec2 id = uv-gv;
  return vec4(gv,id);
}
float hexDist(vec2 p){
  p=abs(p);
  return max(dot(p,normalize(vec2(1.0,1.732))), p.x);
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
  uv*=6.0;
  vec4 hc=hexCoords(uv);
  vec2 gv=hc.xy; vec2 id=hc.zw;
  float d=hexDist(gv);
  float rnd=hash21(id);
  float dist=length(id)*0.4;
  float pulse=0.5+0.5*sin(u_t*2.0 - dist + rnd*6.28318);
  float edge=smoothstep(0.5,0.46,d);
  float border=smoothstep(0.44,0.5,d)*smoothstep(0.51,0.5,d);
  vec3 base=mix(vec3(0.48,0.36,1.0),vec3(0.0,0.88,0.78),pulse);
  vec3 col=base*edge*(0.08+0.55*pulse);
  col+=base*border*1.4;
  col+=base*(0.015/(abs(d-0.5)+0.02))*pulse*0.4;
  col*= (0.4+0.6*smoothstep(2.0,0.0,length(uv)));
  gl_FragColor=vec4(col,1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+34.56); return fract(p.x*p.y); }
    vec4 hexCoords(vec2 uv){
      vec2 r=vec2(1.0,1.732);
      vec2 h=r*0.5;
      vec2 a=mod(uv,r)-h;
      vec2 b=mod(uv-h,r)-h;
      vec2 gv = dot(a,a)<dot(b,b) ? a : b;
      vec2 id = uv-gv;
      return vec4(gv,id);
    }
    float hexDist(vec2 p){
      p=abs(p);
      return max(dot(p,normalize(vec2(1.0,1.732))), p.x);
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;
      uv*=6.0;
      vec4 hc=hexCoords(uv);
      vec2 gv=hc.xy; vec2 id=hc.zw;
      float d=hexDist(gv);
      float rnd=hash21(id);
      float dist=length(id)*0.4;
      float pulse=0.5+0.5*sin(u_t*2.0 - dist + rnd*6.28318);
      float edge=smoothstep(0.5,0.46,d);
      float border=smoothstep(0.44,0.5,d)*smoothstep(0.51,0.5,d);
      vec3 base=mix(vec3(0.48,0.36,1.0),vec3(0.0,0.88,0.78),pulse);
      vec3 col=base*edge*(0.08+0.55*pulse);
      col+=base*border*1.4;
      col+=base*(0.015/(abs(d-0.5)+0.02))*pulse*0.4;
      col*= (0.4+0.6*smoothstep(2.0,0.0,length(uv)));
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
