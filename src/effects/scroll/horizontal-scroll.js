/** @type {import('../types.js').Effect} */
const effect = {
  id:'horizontal-scroll', title:'Horizontal Scroll', cat:'Scroll',
  tags:['horizontal','scroll','galería','sticky','pin','panels'],
  desc:'Paneles que se desplazan en horizontal mientras scrolleas en vertical. Galerías y comparativas.',
  meta:['sticky','translateX','Pin'],
  prompt:`Scroll horizontal ligado al scroll vertical.
Sección alta (p.ej. 300vh) con un track sticky de altura 100vh dentro. Mapea el progreso de scroll vertical a translateX negativo del track (de 0 a -(scrollWidth - viewport)).
Con GSAP es ScrollTrigger + pin + scrub. Bueno para galerías, pasos de producto o comparativas lado a lado.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden';
    s.innerHTML='<div id="tr" style="display:flex;gap:14px;padding:0 10px"></div>';
    el.appendChild(s);const tr=s.querySelector('#tr');const cols=['#7b5cff','#00e0c6','#ff5ca8','#3a2a7a','#5a3fd6'];cols.forEach((c,i)=>{const d=document.createElement('div');d.style.cssText='flex:0 0 auto;width:120px;height:120px;border-radius:14px;background:'+c+';display:grid;place-items:center;color:#fff;font-weight:800;font-size:24px';d.textContent=(i+1);tr.appendChild(d);});
    let x=0,dir=-1,raf,run=true;
    (function loop(){if(!run)return;x+=dir*1.4;const max=tr.scrollWidth-el.clientWidth+20;if(x<-max)dir=1;if(x>0)dir=-1;tr.style.transform='translateX('+x+'px)';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
