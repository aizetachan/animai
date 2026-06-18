/** @type {import('../types.js').Effect} */
const effect = {
  id:'ripple-click', title:'Ripple on Click', cat:'Hover & UI',
  tags:['ripple','click','onda','material','feedback','interacción'],
  desc:'Ondas que se expanden desde el punto de click. Feedback táctil tipo Material. Haz click en la preview.',
  meta:['Click','scale+fade','Pool'],
  prompt:`Efecto ripple al hacer click (estilo Material Design).
En click, crea un span circular en las coordenadas del puntero dentro del contenedor (overflow:hidden) y anímalo scale(0)->scale(N) + opacity 1->0; elimínalo al terminar.
Sirve para botones, cards y CTAs. Usa transform/opacity para que sea GPU.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;display:grid;place-items:center;background:linear-gradient(135deg,#1a1330,#2c2c54);cursor:pointer';
    s.innerHTML='<span style="color:#eef0f7;font-weight:700;font-size:15px;pointer-events:none">Click anywhere</span>';
    el.appendChild(s);let raf,run=true,auto=0;
    function ripple(x,y){const r=document.createElement('span');r.style.cssText='position:absolute;left:'+x+'px;top:'+y+'px;width:12px;height:12px;margin:-6px;border-radius:50%;background:rgba(123,92,255,.5);transform:scale(0);pointer-events:none;transition:transform .7s ease-out,opacity .7s ease-out';s.appendChild(r);requestAnimationFrame(()=>{r.style.transform='scale(14)';r.style.opacity='0';});setTimeout(()=>r.remove(),720);}
    el.onclick=e=>{const b=el.getBoundingClientRect();ripple(e.clientX-b.left,e.clientY-b.top);};
    (function loop(){if(!run)return;auto++;if(auto%90===0&&!el.matches(':hover'))ripple(el.clientWidth*Math.random(),el.clientHeight*Math.random());raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
