/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-magnetic-button', title:'Magnetic Pull Button', cat:'Hover & UI',
  tags:['magnetic','botón','imán','atraer','codrops','cursor','seguir'],
  desc:'Un botón que se desplaza hacia el cursor como atraído por un imán, y vuelve al salir.',
  meta:['translate','attract','Hover'],
  prompt:`Crea un "magnetic button": cuando el cursor se acerca, el botón (y opcionalmente su texto) se desplaza hacia él como atraído por un imán, volviendo a su sitio con un muelle al alejarse.
Calcula el offset del cursor respecto al centro del botón dentro de un área y aplica un translate proporcional (atenuado). Al salir, vuelve a 0 con transición elástica.
El detalle de interacción que firma las webs premium.`,
  code:`// Magnetic button — se mueve hacia el cursor
btn.addEventListener('mousemove', e => {
  const r = btn.getBoundingClientRect()
  const mx = e.clientX - (r.left + r.width/2)
  const my = e.clientY - (r.top + r.height/2)
  btn.style.transform = \`translate(\${mx * 0.4}px, \${my * 0.4}px)\`
})
btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)')`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div id="mb" style="padding:15px 32px;border-radius:14px;background:linear-gradient(90deg,#7b5cff,#5a3fd6);color:#fff;font-weight:700;transition:transform .3s cubic-bezier(.3,1.4,.4,1)">Imán</div>';
    el.appendChild(s);const mb=s.querySelector('#mb');let a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const r=mb.getBoundingClientRect();const mx=e.clientX-(r.left+r.width/2),my=e.clientY-(r.top+r.height/2);mb.style.transform='translate('+mx*.4+'px,'+my*.4+'px)';};
    el.onmouseleave=()=>{hover=false;mb.style.transform='translate(0,0)';};
    (function loop(){if(!run)return;a+=.04;if(!hover){mb.style.transform='translate('+Math.cos(a)*14+'px,'+Math.sin(a*1.3)*8+'px)';}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
