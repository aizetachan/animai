/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-gooey-nav', title:'Gooey Nav', cat:'Hover & UI',
  tags:['gooey','nav','menú','líquido','indicador','elastic','blob'],
  desc:'Un indicador líquido se estira entre los ítems del menú al cambiar de activo. Efecto gooey.',
  meta:['SVG filter','goo','Nav'],
  prompt:`Crea una navegación "gooey": un blob/indicador detrás del ítem activo que, al cambiar a otro ítem, se estira de forma líquida entre ambos antes de asentarse (efecto metaball).
Se logra con un filtro SVG goo (feGaussianBlur + feColorMatrix de contraste alto) sobre el indicador animado, o con un blob que se deforma. El indicador se mueve con un muelle.
Para navs y tabs con personalidad fluida.`,
  code:`/* Gooey filter (SVG) aplicado al contenedor del indicador */
<filter id="goo">
  <feGaussianBlur stdDeviation="8" result="blur" />
  <feColorMatrix in="blur" mode="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" />
</filter>
/* el indicador (un círculo/pill) se mueve con spring entre ítems,
   y el filtro hace que se "estire" como líquido al desplazarse */`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<svg width="0" height="0"><filter id="goon"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10"/></filter></svg><div style="position:relative;display:flex;gap:6px;padding:6px;filter:url(#goon)"><div id="gind" style="position:absolute;top:6px;left:6px;height:34px;width:70px;background:#7b5cff;border-radius:999px;transition:left .5s cubic-bezier(.5,1.6,.4,1),width .5s"></div></div><div id="glab" style="position:absolute;display:flex;gap:6px;padding:6px"></div>';
    el.appendChild(s);const ind=s.querySelector('#gind'),lab=s.querySelector('#glab');const items=['Inicio','Obra','Sobre','Contacto'];const els=[];
    items.forEach((t,i)=>{const b=document.createElement('div');b.textContent=t;b.style.cssText='position:relative;z-index:2;height:34px;display:grid;place-items:center;padding:0 14px;color:'+(i===0?'#fff':'#8a8ca3')+';font-size:13px;font-weight:600;cursor:pointer';lab.appendChild(b);els.push(b);});
    let act=0,raf,run=true,t=0;
    function move(i){els.forEach((e,k)=>e.style.color=k===i?'#fff':'#8a8ca3');const e=els[i];ind.style.left=e.offsetLeft+'px';ind.style.width=e.offsetWidth+'px';}
    requestAnimationFrame(()=>move(0));
    (function loop(){if(!run)return;t++;if(t%80===0){act=(act+1)%items.length;move(act);}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
