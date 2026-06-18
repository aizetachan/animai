/** @type {import('../types.js').Effect} */
const effect = {
  id:'text-scramble', title:'Scramble / Decode', cat:'Texto',
  tags:['texto','scramble','glitch','hacker','decode','gsap'],
  desc:'El texto se descifra desde caracteres aleatorios hasta la palabra final. Equivalente al ScrambleText de GSAP.',
  meta:['JS vanilla','Loop','~1.5kb'],
  prompt:`Implementa un efecto "scramble/decode" en JS vanilla (equivalente al ScrambleTextPlugin de GSAP).
Cada letra empieza como símbolo aleatorio y se resuelve a la correcta tras un retardo creciente por índice.
Usa requestAnimationFrame; expón setText(nuevo) para transiciones. Dispara al entrar en viewport. Estética cyber/tech.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.innerHTML='<div style="height:100%;display:grid;place-items:center"><span id="sc" style="font-family:monospace;font-size:26px;font-weight:700;color:#00e0c6;letter-spacing:.05em"></span></div>';
    el.appendChild(s);const node=s.querySelector('#sc');
    const words=['INITIALIZE','DEPLOY','ANIMAI','RENDER OK'],chars='!<>-_\\/[]{}=+*^?#@';
    let wi=0,raf,run=true;
    function play(target){const len=target.length,queue=[];let frame=0;
      for(let i=0;i<len;i++)queue.push({to:target[i],start:Math.floor(Math.random()*20),end:20+Math.floor(Math.random()*30)});
      (function up(){let out='',done=0;for(let i=0;i<len;i++){const q=queue[i];if(frame>=q.end){done++;out+=q.to;}else if(frame>=q.start){if(!q.cc||Math.random()<.28)q.cc=chars[Math.floor(Math.random()*chars.length)];out+='<span style="color:#7b5cff">'+q.cc+'</span>';}else out+=' ';}
        node.innerHTML=out;frame++;if(done===len){if(run)setTimeout(()=>{wi=(wi+1)%words.length;if(run)play(words[wi]);},1100);return;}if(run)raf=requestAnimationFrame(up);})();}
    play(words[0]);
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
