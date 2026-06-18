import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-vhs', title:'VHS Glitch', cat:'Postprocesado',
  tags:['vhs','glitch','cinta','retro','distorsión','tracking','postprocessing'],
  desc:'Distorsión de cinta VHS con bandas de tracking, desplazamiento de color y ruido. Estética analógica.',
  meta:['Canvas 2D','tracking','VHS'],
  prompt:`Crea un postprocesado "VHS": bandas horizontales que se desplazan verticalmente (tracking), desplazamiento de color (canales RGB separados), ruido y ocasionales saltos/wobble de la imagen.
Combina líneas de tracking que cruzan, un offset RGB en zonas, ruido aleatorio y un leve jitter horizontal. Sobre tu contenido/escena.
Para estética retro analógica, music videos, marcas con vibe 80s/90s.`,
  code:`// VHS — tracking bands + RGB shift + noise + jitter
// 1) dibujar escena; 2) bandas: copiar franjas con offset X aleatorio
// 3) RGB shift: redibujar canales con pequeño desplazamiento
// 4) ruido por píxel a baja opacidad`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.03;x.fillStyle='#0a0810';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2;x.textAlign='center';x.textBaseline='middle';x.font='800 '+Math.min(o.W(),o.H())*.18+'px Inter';
      const jit=(Math.random()-.5)*4;x.globalCompositeOperation='lighter';x.fillStyle='rgba(255,0,80,.7)';x.fillText('VHS',cx-3+jit,cy);x.fillStyle='rgba(0,255,160,.7)';x.fillText('VHS',cx+jit,cy);x.fillStyle='rgba(60,120,255,.7)';x.fillText('VHS',cx+3+jit,cy);x.globalCompositeOperation='source-over';
      // tracking band
      const by=(t*60)%o.H();x.fillStyle='rgba(255,255,255,.06)';x.fillRect(0,by,o.W(),16);x.drawImage(o.c,0,by*Math.min(devicePixelRatio,2),o.c.width,16*Math.min(devicePixelRatio,2),(Math.random()-.5)*12,by,o.W(),16);
      // scanlines + noise
      x.fillStyle='rgba(0,0,0,.2)';for(let yy=0;yy<o.H();yy+=3)x.fillRect(0,yy,o.W(),1);
      for(let i=0;i<30;i++){x.fillStyle='rgba(255,255,255,'+Math.random()*.15+')';x.fillRect(Math.random()*o.W(),Math.random()*o.H(),2,1);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
