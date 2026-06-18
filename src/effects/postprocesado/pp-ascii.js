import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-ascii', title:'ASCII Render', cat:'Postprocesado',
  tags:['ascii','caracteres','postprocessing','terminal','arte','texto','retro'],
  desc:'La escena se renderiza con caracteres ASCII según el brillo. El filtro ASCII art clásico.',
  meta:['Canvas 2D','luminance','ASCII'],
  prompt:`Crea un postprocesado "ASCII art": muestrea el brillo de la escena/imagen por bloques y sustituye cada bloque por un carácter ASCII cuya densidad visual corresponde a ese brillo (de espacio a @).
Calcula la luminancia media de cada celda; mapéala a un índice en una rampa de caracteres " .:-=+*#%@". Dibuja el char en color sobre fondo oscuro.
Estética terminal/hacker/retro para fondos o reveals de imagen.`,
  code:`// ASCII render — brillo de cada celda -> carácter
const ramp = ' .:-=+*#%@'
for (let y = 0; y < H; y += cell)
  for (let x = 0; x < W; x += cell) {
    const lum = sampleBrightness(x, y, cell)        // 0..1
    const ch = ramp[Math.floor(lum * (ramp.length-1))]
    ctx.fillText(ch, x, y)
  }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const ramp=' .:-=+*#%@';const cell=9;let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.03;x.fillStyle='#06080a';x.fillRect(0,0,o.W(),o.H());x.font=cell+'px monospace';x.textBaseline='top';
      const cx=o.W()/2,cy=o.H()/2,R=Math.min(o.W(),o.H())*.4;
      for(let yy=0;yy<o.H();yy+=cell)for(let xx=0;xx<o.W();xx+=cell){const dx=xx-cx,dy=yy-cy,d=Math.hypot(dx,dy);let lum=Math.max(0,1-d/R)*(.6+.4*Math.sin(d*.08-t*2));lum=Math.max(0,Math.min(1,lum));const ch=ramp[Math.floor(lum*(ramp.length-1))];if(ch!==' '){x.fillStyle='hsl('+(160+lum*60)+',80%,'+(40+lum*40)+'%)';x.fillText(ch,xx,yy);}}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
