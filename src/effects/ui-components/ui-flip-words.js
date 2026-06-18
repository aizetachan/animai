/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-flip-words', title:'Flip Words', cat:'UI Components',
  tags:['flip','words','rotativo','texto','aceternity','cambio','vertical'],
  desc:'Una palabra cambia por otra con un giro/fundido vertical. El Flip Words de Aceternity para claims.',
  meta:['Aceternity UI','rotateX','Loop'],
  prompt:`Recrea el Flip Words de Aceternity: dentro de una frase fija, una palabra va cambiando por otras de una lista con una animación de salida (blur+translateY+rotateX) y entrada de la siguiente.
Usa AnimatePresence para montar/desmontar la palabra activa con variants. Loop con intervalo.
Perfecto para "Build [faster / better / together]".`,
  code:`// Aceternity UI — Flip Words (React + Framer Motion + AnimatePresence)
<AnimatePresence mode="wait">
  <motion.span key={word}
    initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -20, filter: 'blur(8px)', position: 'absolute' }}
    transition={{ duration: 0.4 }}>
    {word}
  </motion.span>
</AnimatePresence>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div style="font-size:22px;font-weight:800;color:#eef0f7">Build <span id="fw" style="display:inline-block;color:#00e0c6;transition:.4s">faster</span></div>';
    el.appendChild(s);const fw=s.querySelector('#fw');const words=['faster','better','together','smarter'];let i=0,to,run=true;
    (function go(){if(!run)return;fw.style.opacity='0';fw.style.transform='translateY(-16px)';fw.style.filter='blur(8px)';
      setTimeout(()=>{i=(i+1)%words.length;fw.textContent=words[i];fw.style.transform='translateY(10px)';requestAnimationFrame(()=>{fw.style.opacity='1';fw.style.transform='translateY(0)';fw.style.filter='blur(0)';});},420);
      to=setTimeout(go,2000);})();
    return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
