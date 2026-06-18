/** @type {import('../types.js').Effect} */
const effect = {
  id:'text-highlight', title:'Scroll Text Highlight', cat:'Texto',
  tags:['texto','highlight','scroll','palabra','resaltado','storytelling'],
  desc:'El texto se ilumina palabra a palabra según avanzas. El efecto "manifesto" de Stripe/agencias.',
  meta:['scroll %','word spans','Narrativa'],
  prompt:`Resaltado de texto palabra a palabra ligado al scroll (estilo manifesto de agencia).
Divide el párrafo en <span> por palabra. Calcula el progreso de scroll de la sección (0->1) y enciende el color de las palabras hasta el índice = progreso * total.
Usa colores apagado->marca. Da sensación de lectura guiada.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;padding:0 22px';
    const words='Diseñamos experiencias que la gente recuerda.'.split(' ');
    s.innerHTML='<div id="hl" style="font-size:20px;font-weight:700;line-height:1.5;text-align:center"></div>';
    el.appendChild(s);const hl=s.querySelector('#hl');words.forEach(w=>{const sp=document.createElement('span');sp.textContent=w+' ';sp.style.cssText='color:#33344a;transition:color .25s';hl.appendChild(sp);});
    let p=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;p+=dir*.006;if(p>=1.1)dir=-1;if(p<=-.1)dir=1;const k=Math.max(0,Math.min(1,p)),lit=Math.floor(k*words.length);[...hl.children].forEach((c,i)=>{c.style.color=i<lit?'#eef0f7':'#33344a';});raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
