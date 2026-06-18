/** @type {import('../types.js').Effect} */
const effect = {
  id:'parallax-layers', title:'Depth Parallax', cat:'Scroll',
  tags:['parallax','scroll','profundidad','capas','3d','hero'],
  desc:'Capas que se mueven a distinta velocidad creando profundidad. Aquí ligado al ratón.',
  meta:['Transform','Multicapa','Suave'],
  prompt:`Parallax de profundidad multicapa ligado al scroll (o al ratón).
Cada capa con data-speed; en scroll aplica translateY = progress * speed (las de fondo más lentas). Usa transform (GPU) y will-change.
Para hero combina con parallax de ratón (lerp). Limita a 3-4 capas y clampa valores.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden';
    [{c:'#1a1330',z:60,r:90},{c:'#3a2a7a',z:40,r:60},{c:'#7b5cff',z:24,r:38},{c:'#00e0c6',z:12,r:22}].forEach((L,i)=>{const d=document.createElement('div');d.dataset.s=L.z;d.style.cssText='position:absolute;left:50%;top:50%;width:'+L.r*2+'px;height:'+L.r*2+'px;margin:'+(-L.r)+'px;border-radius:50%;background:'+L.c+';opacity:'+(1-i*.12)+';transition:transform .25s ease-out';s.appendChild(d);});
    el.appendChild(s);let mx=0,my=0,a=0,raf,run=true;
    el.onmousemove=e=>{const b=el.getBoundingClientRect();mx=(e.clientX-b.left)/el.clientWidth-.5;my=(e.clientY-b.top)/el.clientHeight-.5;};
    (function loop(){if(!run)return;a+=.02;const ax=el.matches(':hover')?mx:Math.cos(a)*.4,ay=el.matches(':hover')?my:Math.sin(a*1.2)*.4;[...s.children].forEach(c=>{const sp=+c.dataset.s;c.style.transform='translate('+(ax*sp)+'px,'+(ay*sp)+'px)';});raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
