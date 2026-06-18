/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-reveal', title:'Scroll Reveal Stagger', cat:'Scroll',
  tags:['scroll','reveal','intersection','fade','entrada','scrolltrigger','gsap'],
  desc:'Elementos que entran con fade + subida al llegar al viewport. La base de toda landing (ScrollTrigger de GSAP).',
  meta:['IntersectionObserver','Performante','Reusable'],
  prompt:`Sistema de scroll-reveal con IntersectionObserver (alternativa ligera al ScrollTrigger de GSAP).
Marca elementos con data-reveal; al cruzar el viewport (threshold ~0.15) añade una clase que dispara opacity 0->1 y translateY(24px)->0.
Soporta stagger con transition-delay por índice. Unobserve tras revelar. Respeta reduced-motion.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='overflow:hidden;padding:14px;display:flex;flex-direction:column;gap:10px;justify-content:center';
    el.appendChild(s);let to,run=true;
    (function go(){s.innerHTML='';for(let i=0;i<4;i++){const d=document.createElement('div');d.style.cssText='height:26px;border-radius:7px;background:linear-gradient(90deg,#16162a,#1e1e3a);opacity:0;transform:translateY(22px);transition:.6s cubic-bezier(.2,.8,.2,1);transition-delay:'+(i*.12)+'s;width:'+(60+i*10)+'%';s.appendChild(d);}
      requestAnimationFrame(()=>requestAnimationFrame(()=>{[...s.children].forEach(c=>{c.style.opacity=1;c.style.transform='none';});}));if(run)to=setTimeout(go,2600);})();
    return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
