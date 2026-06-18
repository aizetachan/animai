/** @type {import('../types.js').Effect} */
const effect = {
  id:'flip-layout', title:'Flip Layout', cat:'Hover & UI',
  tags:['flip','layout','transición','reorder','gsap','grid'],
  desc:'Los elementos animan su cambio de posición al reordenarse, como el plugin Flip de GSAP.',
  meta:['FLIP technique','transform','Auto'],
  prompt:`Anima cambios de layout con la técnica FLIP (lo que automatiza el plugin Flip de GSAP).
First: guarda getBoundingClientRect() de cada elemento. Last: cambia el DOM/orden. Invert: aplica transform que los devuelve a su posición previa. Play: transiciona transform a 0.
Úsalo al filtrar/reordenar una grid o al expandir una card. 60fps porque solo animas transform.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;padding:18px';
    el.appendChild(s);['#7b5cff','#00e0c6','#ff5ca8','#3a2a7a','#5a3fd6'].forEach(c=>{const d=document.createElement('div');d.style.cssText='width:46px;height:46px;border-radius:12px;background:'+c+';transition:transform .55s cubic-bezier(.2,.8,.2,1)';s.appendChild(d);});
    let to,run=true;
    function shuffle(){const kids=[...s.children];const first=kids.map(k=>k.getBoundingClientRect());
      for(let i=s.children.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));s.insertBefore(s.children[j],s.children[i].nextSibling);}
      const kids2=[...s.children];
      kids2.forEach(k=>{const f=first[kids.indexOf(k)],l=k.getBoundingClientRect();k.style.transition='none';k.style.transform='translate('+(f.left-l.left)+'px,'+(f.top-l.top)+'px)';});
      requestAnimationFrame(()=>requestAnimationFrame(()=>{kids2.forEach(k=>{k.style.transition='transform .55s cubic-bezier(.2,.8,.2,1)';k.style.transform='none';});}));
      if(run)to=setTimeout(shuffle,1900);}
    to=setTimeout(shuffle,900);
    return{stop(){run=false;clearTimeout(to);el.innerHTML='';}};
  }
};
export default effect;
