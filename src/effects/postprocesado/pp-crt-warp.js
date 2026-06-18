import { shaderPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-crt-warp', title:'CRT Screen Warp', cat:'Postprocesado',
  tags:['crt','warp','curvatura','tv','retro','barrel','postprocessing'],
  desc:'Curvatura de pantalla CRT con viñeta y brillo de fósforo. El monitor de tubo completo en un shader.',
  meta:['WebGL','barrel distortion','CRT'],
  prompt:`Fragment shader que simula una pantalla CRT completa: curvatura "barrel" de las UV (la imagen se abomba hacia el centro), scanlines, viñeta en los bordes y un leve brillo de fósforo.
Distorsiona las UV con un factor radial (barrel), descarta/oscurece fuera del borde curvo, añade líneas de escaneo y viñeta. Aplica sobre tu contenido/escena.
Para terminales retro, gaming arcade o estética vaporwave.`,
  /* @render-start */
  render(el){return shaderPreview(el,`
    void main(){vec2 uv=gl_FragCoord.xy/u_res.xy;vec2 cc=uv-.5;
      float d=dot(cc,cc);uv=uv+cc*d*.3; // barrel
      if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.){gl_FragColor=vec4(0.,0.,0.,1.);return;}
      vec3 col=mix(vec3(.1,.05,.2),vec3(.2,.7,.9),uv.y);col*=.7+.3*sin(uv.x*10.+u_t);
      float scan=.85+.15*sin(uv.y*u_res.y*1.5);col*=scan;
      float vig=smoothstep(.8,.3,length(cc));col*=vig;
      gl_FragColor=vec4(col,1.);}`);}
};
export default effect;
