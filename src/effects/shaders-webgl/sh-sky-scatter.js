import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'sh-sky-scatter', title:'Atmospheric Sky', cat:'Shaders WebGL',
  tags:['cielo','sky','scattering','atmosfera','sol','amanecer','fondo'],
  desc:'Cielo con dispersion atmosferica (Rayleigh/Mie) y un sol que sube y baja cambiando del azul cenital al naranja del horizonte.',
  meta:['WebGL','Sin librerias','60fps'],
  prompt:`Fragment shader WebGL de cielo con dispersion atmosferica simplificada.
Tecnica (modelo Rayleigh/Mie aproximado, estilo Preetham/Hosek simplificado):
- Construye un rayo de vista 'dir' desde uv mapeando la pantalla a una boveda (eleva el angulo segun la altura de pantalla).
- El sol 'sunDir' se mueve en altura con u_t (sin), simulando amanecer->cenit->atardecer.
- Calcula mu = dot(dir, sunDir). Aplica fase de Rayleigh ~ (1+mu*mu) y un termino direccional de Mie (lobulo fuerte hacia el sol) para el halo solar.
- Color base: betaR (coeficientes Rayleigh ~vec3(5.8e-6,13.5e-6,33.1e-6) normalizados) dan el azul; el horizonte se enrojece cuando el sol baja (mas masa de aire -> mas scattering -> azul absorbido).
- Mezcla cielo azul cenital con naranja de horizonte segun la altura del rayo y la altura del sol.
- Anade un disco solar brillante con smoothstep sobre mu, y un degradado de saturacion hacia el horizonte.
Parametros: velocidad solar lenta, intensidad del sol, exponente de Mie (g~0.76).`,
  code:`// Fragment (GLSL ES 1.0). Helpers proveen: uniform vec2 u_res; uniform float u_t;
void main(){
  vec2 uv = gl_FragCoord.xy/u_res.xy;
  // rayo de vista sobre una boveda: y de pantalla -> elevacion
  vec3 dir = normalize(vec3((uv.x-0.5)*1.6, uv.y*0.9+0.02, 0.6));
  // sol: sube y baja con el tiempo
  float sunH = sin(u_t*0.12)*0.5 + 0.35; // altura -0.15..0.85
  vec3 sunDir = normalize(vec3(0.15, sunH, 0.6));
  float sunUp = clamp(sunDir.y, 0.0, 1.0);

  float mu = max(dot(dir, sunDir), 0.0);
  float rayleigh = 0.75*(1.0 + mu*mu); // fase Rayleigh
  // fase de Mie (Henyey-Greenstein) para halo solar
  float g = 0.76;
  float mie = (1.0-g*g)/pow(1.0 + g*g - 2.0*g*mu, 1.5);

  // colores cenit vs horizonte; el horizonte enrojece al bajar el sol
  vec3 zenith = vec3(0.18, 0.36, 0.72);
  vec3 horizon = mix(vec3(0.95,0.55,0.25), vec3(0.55,0.65,0.85), sunUp);
  float h = clamp(dir.y*1.4, 0.0, 1.0);
  vec3 sky = mix(horizon, zenith, h);

  // oscurecer cielo de noche cuando el sol cae
  sky *= mix(0.25, 1.0, smoothstep(-0.1, 0.25, sunDir.y));

  vec3 col = sky*rayleigh*0.8;
  // halo de Mie tintado calido
  col += vec3(1.0,0.8,0.55)*mie*0.06*smoothstep(-0.05,0.2,sunDir.y);
  // disco solar
  float disc = smoothstep(0.9995, 0.99995, mu);
  col += vec3(1.0,0.95,0.85)*disc*2.0*smoothstep(-0.05,0.1,sunDir.y);

  col = pow(col, vec3(0.9)); // ligero gamma
  gl_FragColor = vec4(col, 1.0);
}`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){
      vec2 uv=gl_FragCoord.xy/u_res.xy;
      vec3 dir=normalize(vec3((uv.x-0.5)*1.6, uv.y*0.9+0.02, 0.6));
      float sunH=sin(u_t*0.12)*0.5+0.35;
      vec3 sunDir=normalize(vec3(0.15,sunH,0.6));
      float sunUp=clamp(sunDir.y,0.0,1.0);
      float mu=max(dot(dir,sunDir),0.0);
      float rayleigh=0.75*(1.0+mu*mu);
      float g=0.76;
      float mie=(1.0-g*g)/pow(1.0+g*g-2.0*g*mu,1.5);
      vec3 zenith=vec3(0.18,0.36,0.72);
      vec3 horizon=mix(vec3(0.95,0.55,0.25),vec3(0.55,0.65,0.85),sunUp);
      float h=clamp(dir.y*1.4,0.0,1.0);
      vec3 sky=mix(horizon,zenith,h);
      sky*=mix(0.25,1.0,smoothstep(-0.1,0.25,sunDir.y));
      vec3 col=sky*rayleigh*0.8;
      col+=vec3(1.0,0.8,0.55)*mie*0.06*smoothstep(-0.05,0.2,sunDir.y);
      float disc=smoothstep(0.9995,0.99995,mu);
      col+=vec3(1.0,0.95,0.85)*disc*2.0*smoothstep(-0.05,0.1,sunDir.y);
      col=pow(col,vec3(0.9));
      gl_FragColor=vec4(col,1.0);
    }`);}
};
export default effect;
