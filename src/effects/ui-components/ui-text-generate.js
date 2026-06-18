/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-text-generate', title:'Text Generate', cat:'UI Components',
  tags:['text','generate','fade','blur','aceternity','reveal','palabras'],
  desc:'Las palabras aparecen con fade y desenfoque, como generadas por IA. El Text Generate Effect de Aceternity.',
  meta:['Aceternity UI','blur fade','Stagger'],
  prompt:`Recrea el Text Generate Effect de Aceternity: cada palabra del párrafo aparece con opacity 0->1 y filter:blur(10px)->0, escalonadas, como si una IA fuera "generando" el texto.
Envuelve cada palabra en un span y aplica transición con delay creciente por índice. Dispara al montar/entrar en viewport.
Muy usado en heros de productos IA.`,
  code:`// Aceternity UI — Text Generate (React + Framer Motion)
<motion.span
  initial={{ opacity: 0, filter: 'blur(10px)' }}
  animate={{ opacity: 1, filter: 'blur(0px)' }}
  transition={{ duration: 0.5, delay: idx * 0.08 }}>
  {word}{' '}
</motion.span>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;padding:0 20px';
    s.innerHTML='<div id="tg" style="font-size:19px;font-weight:600;line-height:1.5;text-align:center;color:#eef0f7"></div>';
    el.appendChild(s);const tg=s.querySelector('#tg');const words='La inteligencia se genera palabra a palabra.'.split(' ');let to,run=true;
    (function go(){tg.innerHTML='';words.forEach((w,i)=>{const sp=document.createElement('span');sp.textContent=w+' ';sp.style.cssText='display:inline-block;opacity:0;filter:blur(10px);transition:.6s;transition-delay:'+(i*.1)+'s';tg.appendChild(sp);});requestAnimationFrame(()=>requestAnimationFrame(()=>{[...tg.children].forEach(c=>{c.style.opacity=1;c.style.filter='blur(0)';});}));if(run)to=setTimeout(go,3400);})();
    return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
