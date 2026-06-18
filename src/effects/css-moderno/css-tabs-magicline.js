/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-tabs-magicline', title:'Animated Tabs', cat:'CSS Moderno',
  tags:['tabs','pestañas','magic line','indicador','deslizar','layout'],
  desc:'Un indicador se desliza suavemente bajo la pestaña activa. La "magic line" de tabs.',
  meta:['layout animation','transform','Tabs'],
  prompt:`Crea tabs con "magic line": una línea/pill indicadora que se desliza y redimensiona suavemente hasta la pestaña activa al cambiar.
Mide la posición y ancho del tab activo y mueve el indicador con transform/left+width animados. En React, Framer Motion layoutId lo hace automático (shared layout).
Para barras de navegación, filtros y secciones con pestañas pulidas.`,
  code:`// Magic line tabs (Framer Motion shared layout)
{tabs.map(tab => (
  <button onClick={() => setActive(tab)}>
    {tab}
    {active === tab && (
      <motion.div layoutId="underline" className="indicator" />
    )}
  </button>
))}
// layoutId hace que el indicador se "teletransporte" animando entre tabs`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div style="position:relative;display:flex;gap:4px;border-bottom:1px solid #1e1e2e;padding-bottom:8px"><div id="tind" style="position:absolute;bottom:-1px;height:2px;background:#7b5cff;border-radius:2px;transition:left .4s cubic-bezier(.4,0,.2,1),width .4s"></div></div><div id="tlab" style="position:absolute;display:flex;gap:4px"></div>';
    el.appendChild(s);const ind=s.querySelector('#tind'),lab=s.querySelector('#tlab');const tabs=['Resumen','Detalles','Reseñas'];const els=[];
    tabs.forEach((t,i)=>{const b=document.createElement('div');b.textContent=t;b.style.cssText='padding:6px 14px;color:'+(i===0?'#eef0f7':'#8a8ca3')+';font-size:13px;font-weight:600;cursor:pointer;transition:color .3s';lab.appendChild(b);els.push(b);});
    let act=0,raf,run=true,t=0;function move(i){els.forEach((e,k)=>e.style.color=k===i?'#eef0f7':'#8a8ca3');const e=els[i];ind.style.left=e.offsetLeft+'px';ind.style.width=e.offsetWidth+'px';}
    requestAnimationFrame(()=>move(0));
    (function loop(){if(!run)return;t++;if(t%80===0){act=(act+1)%tabs.length;move(act);}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
