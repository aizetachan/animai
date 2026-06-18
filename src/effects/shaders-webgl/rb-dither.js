import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-dither', title:'Dither Waves', cat:'Shaders WebGL',
  tags:['dither','dithering','retro','bayer','react bits','8bit','tramado'],
  desc:'Ondas con tramado dither tipo Bayer, estética retro de consola/Mac antiguo. Patrón de puntos ordenado.',
  meta:['WebGL','bayer dither','Retro'],
  prompt:`Fragment shader "Dither" (React Bits): un campo de ondas/gradiente al que se aplica un dithering ordenado (matriz Bayer) que lo convierte en un patrón de puntos en blanco y negro, estética retro de Mac clásico / Game Boy / print.
Calcula un valor de brillo (ondas), y compáralo con el umbral de una matriz Bayer 4x4 según la posición del píxel para decidir negro/blanco.
Fondo retro-cool para marcas con personalidad lo-fi.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    float bayer(vec2 p){int x=int(mod(p.x,4.)),y=int(mod(p.y,4.));
      int idx=x+y*4;float m[16];m[0]=0.;m[1]=8.;m[2]=2.;m[3]=10.;m[4]=12.;m[5]=4.;m[6]=14.;m[7]=6.;m[8]=3.;m[9]=11.;m[10]=1.;m[11]=9.;m[12]=15.;m[13]=7.;m[14]=13.;m[15]=5.;
      float v=0.;for(int i=0;i<16;i++){if(i==idx)v=m[i];}return v/16.;}
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;
      float wave=.5+.5*sin(uv.x*6.+u_t)*sin(uv.y*6.-u_t*.7);
      float th=bayer(gl_FragCoord.xy);float on=step(th,wave);
      vec3 col=mix(vec3(.04,.04,.09),vec3(.48,.36,1.),on);gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
