import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'part-matrix', title:'Matrix Rain', cat:'Partículas',
  tags:['matrix','lluvia','código','verde','hacker','terminal','digital'],
  desc:'La lluvia de caracteres verde de Matrix. Fondo hacker/terminal icónico en canvas.',
  meta:['Canvas 2D','Columnas','Hacker'],
  prompt:`Recrea la "Matrix rain" en canvas 2D: columnas de caracteres (katakana/símbolos) que caen, con el carácter de cabeza más brillante y una estela que se desvanece.
Divide el ancho en columnas del ancho de la fuente; cada una tiene una posición Y que baja; pinta un rect semitransparente negro cada frame para el fade de estela.
Verde fósforo. Para secciones tech/hacker/IA.`,
  code:`// Matrix rain (canvas 2D)
ctx.fillStyle = 'rgba(0,0,0,0.06)'        // estela
ctx.fillRect(0, 0, W, H)
ctx.fillStyle = '#0f0'; ctx.font = fontSize + 'px monospace'
drops.forEach((y, i) => {
  const char = chars[Math.floor(Math.random() * chars.length)]
  ctx.fillText(char, i * fontSize, y * fontSize)
  drops[i] = (y * fontSize > H && Math.random() > 0.975) ? 0 : y + 1
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const fs=12;let cols=Math.floor(o.W()/fs);let drops=Array(cols).fill(0).map(()=>Math.random()*o.H()/fs);
    const ch='ｱｲｳｴｵｶｷ01ABCΣΔ#@%';let raf,run=true;
    (function loop(){if(!run)return;x.fillStyle='rgba(7,9,13,.08)';x.fillRect(0,0,o.W(),o.H());x.font=fs+'px monospace';
      cols=Math.floor(o.W()/fs);for(let i=0;i<cols;i++){if(drops[i]===undefined)drops[i]=0;const c=ch[Math.floor(Math.random()*ch.length)];const yy=drops[i]*fs;x.fillStyle='#0aff7a';x.fillText(c,i*fs,yy);x.fillStyle='rgba(10,255,122,.4)';x.fillText(ch[Math.floor(Math.random()*ch.length)],i*fs,yy-fs);drops[i]=(yy>o.H()&&Math.random()>.975)?0:drops[i]+1;}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
