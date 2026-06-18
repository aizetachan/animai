/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-typewriter', title:'Typewriter Text', cat:'UI Components',
  tags:['typewriter','máquina','escribir','texto','aceternity','cursor'],
  desc:'Texto que se escribe carácter a carácter con cursor parpadeante. El Typewriter Effect de Aceternity.',
  meta:['Aceternity UI','typing','Cursor'],
  prompt:`Recrea el Typewriter Effect de Aceternity: el texto aparece carácter a carácter como si se escribiera, con un cursor que parpadea al final.
Incrementa el substring mostrado con un setInterval/rAF; al terminar, pausa y opcionalmente borra para escribir la siguiente frase (efecto rotativo).
Bueno para heros que listan propuestas de valor.`,
  code:`// Aceternity UI — Typewriter (React + Framer Motion)
const phrases = ['Diseñamos.', 'Animamos.', 'Enviamos.']
useEffect(() => {
  let i = 0, j = 0, deleting = false
  const tick = () => {
    setText(phrases[i].slice(0, j))
    if (!deleting && j < phrases[i].length) j++
    else if (deleting && j > 0) j--
    else if (!deleting) { deleting = true; setTimeout(tick, 1200); return }
    else { deleting = false; i = (i + 1) % phrases.length }
    setTimeout(tick, deleting ? 40 : 90)
  }
  tick()
}, [])`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div style="font-size:24px;font-weight:800;color:#eef0f7"><span id="tw"></span><span id="cur" style="color:#7b5cff">|</span></div>';
    el.appendChild(s);const tw=s.querySelector('#tw'),cur=s.querySelector('#cur');
    const ph=['Diseñamos.','Animamos.','Enviamos.'];let i=0,j=0,del=false,raf,run=true,blink=0;
    function tick(){if(!run)return;tw.textContent=ph[i].slice(0,j);if(!del&&j<ph[i].length)j++;else if(del&&j>0)j--;else if(!del){del=true;setTimeout(tick,1100);return;}else{del=false;i=(i+1)%ph.length;}setTimeout(tick,del?45:95);}
    tick();(function bl(){if(!run)return;blink++;cur.style.opacity=Math.floor(blink/30)%2?'0':'1';raf=requestAnimationFrame(bl);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
