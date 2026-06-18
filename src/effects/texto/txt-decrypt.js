/** @type {import('../types.js').Effect} */
const effect = {
  id:'txt-decrypt', title:'Decrypt Reveal', cat:'Texto',
  tags:['decrypt','descifrar','hacker','texto','matrix','revelar','código'],
  desc:'El texto se descifra carácter a carácter desde símbolos aleatorios hasta el mensaje final.',
  meta:['scramble settle','reveal','Hacker'],
  prompt:`Crea un efecto "decrypt": cada carácter del mensaje empieza como un símbolo aleatorio que cambia rápidamente y, de izquierda a derecha, se va "fijando" en la letra correcta (los ya resueltos quedan fijos), como descifrando un código.
Mantén un índice de "resueltos" que avanza con el tiempo; los caracteres antes del índice muestran el final, los demás siguen aleatorizándose.
Para reveals tech/hacker de titulares o claims. Distinto del scramble continuo: aquí se resuelve y queda fijo.`,
  code:`// Decrypt reveal — los caracteres se fijan de izquierda a derecha
const glyphs = '!<>-_\\\\/[]{}=+*^?#'
text.split('').map((ch, i) =>
  i < resolved ? ch : glyphs[Math.floor(Math.random()*glyphs.length)]
).join('')
// resolved aumenta con el tiempo hasta text.length`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div id="dc" style="font-family:monospace;font-size:22px;font-weight:700;color:#00e0c6;letter-spacing:1px"></div>';
    el.appendChild(s);const dc=s.querySelector('#dc');const target='NAKAMA STUDIO';const gl='!<>-_\\\\/[]{}=+*^?#01';let resolved=0,raf,run=true,t=0,hold=0;
    (function loop(){if(!run)return;t++;if(hold>0){hold--;}else{if(t%4===0&&resolved<target.length)resolved++;if(resolved>=target.length){hold=60;resolved=0;}}
      let out='';for(let i=0;i<target.length;i++){if(target[i]===' '){out+=' ';continue;}out+=i<resolved?target[i]:gl[(Math.random()*gl.length)|0];}dc.textContent=out;raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
