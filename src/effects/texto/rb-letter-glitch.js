import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-letter-glitch', title:'Letter Glitch Grid', cat:'Texto',
  tags:['letter glitch','grid','caracteres','matrix','react bits','cambiar','terminal'],
  desc:'Rejilla de caracteres que cambian aleatoriamente con destellos de color. El Letter Glitch de React Bits.',
  meta:['grid chars','random','Terminal'],
  prompt:`Recrea "Letter Glitch" de React Bits: una rejilla densa de caracteres monoespaciados que cambian aleatoriamente, con algunas celdas iluminándose en colores de marca de forma intermitente (glitch).
Mantén una matriz de chars; cada frame, cambia algunos al azar y asigna a unos pocos un color brillante temporal que se desvanece a gris.
Fondo tech/terminal/hacker muy actual, distinto de la lluvia Matrix (esto es una rejilla estática que muta).`,
  code:`// Letter Glitch — rejilla de chars que mutan + glitch de color
cells.forEach(c => {
  if (Math.random() < 0.02) c.char = randChar()
  if (Math.random() < 0.005) { c.color = brandColor(); c.glow = 1 }
  c.glow *= 0.92                          // se apaga a gris
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const fs=14;const ch='ABCDEF0123456789#@$%&<>{}';let cells=[];
    function grid(){const cols=Math.ceil(o.W()/fs),rows=Math.ceil(o.H()/fs);cells=[];for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)cells.push({i,j,c:ch[(Math.random()*ch.length)|0],g:0,col:'#7b5cff'});}
    grid();let raf,run=true;const bc=['#7b5cff','#00e0c6','#ff5ca8'];
    (function loop(){if(!run)return;x.fillStyle='#08080f';x.fillRect(0,0,o.W(),o.H());x.font=fs+'px monospace';x.textBaseline='top';
      cells.forEach(cl=>{if(Math.random()<.02)cl.c=ch[(Math.random()*ch.length)|0];if(Math.random()<.004){cl.g=1;cl.col=bc[(Math.random()*3)|0];}cl.g*=.92;const v=Math.round(40+cl.g*180);x.fillStyle=cl.g>.1?cl.col:'rgb('+v*.4+','+v*.4+','+v*.5+')';x.globalAlpha=cl.g>.1?1:.5;x.fillText(cl.c,cl.i*fs,cl.j*fs);});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
