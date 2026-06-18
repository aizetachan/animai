/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-split-flap', title:'Split-Flap Board', cat:'CSS Moderno',
  tags:['split flap','vestaboard','aeropuerto','flip','letras','tablero','retro'],
  desc:'Tablero de letras que giran como los paneles de aeropuerto (Vestaboard). Flip mecánico carácter a carácter.',
  meta:['flip','char cycle','Retro'],
  prompt:`Recrea un "split-flap display" (panel de aeropuerto / Vestaboard): cada celda cicla rápidamente por varios caracteres con una animación de giro (flip) hasta asentarse en la letra final, con un desfase por columna.
Cada celda recorre el abecedario haciendo flip vertical hasta llegar a su letra objetivo; las columnas terminan escalonadas. Sonido "tac-tac" opcional.
Para revelar palabras/cifras con encanto retro-mecánico.`,
  code:`// Split-flap — cada celda cicla chars hasta su objetivo
cells.forEach((cell, i) => {
  let current = 0
  const interval = setInterval(() => {
    cell.textContent = alphabet[current++ % alphabet.length]
    cell.classList.add('flip')
    if (alphabet[current] === target[i]) clearInterval(interval)
  }, 40 + i * 15)   // desfase por columna
})`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div id="sf" style="display:flex;gap:3px"></div>';
    el.appendChild(s);const sf=s.querySelector('#sf');const target='NAKAMA';const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZ';const cells=[];
    for(let i=0;i<target.length;i++){const c=document.createElement('div');c.style.cssText='width:26px;height:38px;background:#16162a;border-radius:5px;display:grid;place-items:center;color:#eef0f7;font-weight:800;font-size:20px;font-family:monospace;border-top:1px solid #2a2a3e;box-shadow:inset 0 -1px 0 #000';c.textContent='A';sf.appendChild(c);cells.push(c);}
    let raf,run=true,timers=[];
    function go(){timers.forEach(clearInterval);timers=[];cells.forEach((c,i)=>{let cur=Math.floor(Math.random()*26);const ti=setInterval(()=>{c.textContent=abc[cur%26];c.style.transform='scaleY(.6)';setTimeout(()=>c.style.transform='scaleY(1)',30);if(abc[cur%26]===target[i]){clearInterval(ti);}cur++;},50+i*18);timers.push(ti);});}
    go();let c2=0;(function loop(){if(!run)return;c2++;if(c2%160===0)go();raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);timers.forEach(clearInterval);el.innerHTML='';}};
  }
};
export default effect;
