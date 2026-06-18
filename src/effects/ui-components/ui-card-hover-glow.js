/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-card-hover-glow', title:'Card Spotlight Hover', cat:'UI Components',
  tags:['card','spotlight','hover','glow','aceternity','seguir','borde'],
  desc:'Un resplandor sigue al cursor sobre la tarjeta revelando un patrón. El Card Spotlight de Aceternity.',
  meta:['Aceternity UI','radial follow','Hover'],
  prompt:`Recrea el Card Spotlight de Aceternity: al pasar el ratón sobre una tarjeta, un radial-gradient de luz sigue al cursor revelando un patrón de puntos/grid debajo y resaltando el borde.
Actualiza --mx/--my en mousemove; un pseudo-elemento usa esas vars en un radial-gradient (mask o background) sobre un patrón.
Para grids de features/pricing.`,
  code:`// Aceternity UI — Card Spotlight (React + Framer Motion)
const onMouseMove = (e) => {
  const r = ref.current.getBoundingClientRect()
  setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
}
// el overlay usa:
background: \`radial-gradient(220px circle at \${pos.x}px \${pos.y}px,
  rgba(123,92,255,0.25), transparent 70%)\``,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0a0a12';
    s.innerHTML='<div id="cs" style="position:relative;width:180px;height:120px;border-radius:16px;background:#101019;border:1px solid #1e1e2e;overflow:hidden"><div id="dots" style="position:absolute;inset:0;background-image:radial-gradient(circle,#2a2a3e 1px,transparent 1px);background-size:14px 14px;opacity:.6"></div><div id="glow" style="position:absolute;inset:0"></div><span style="position:absolute;inset:0;display:grid;place-items:center;color:#eef0f7;font-weight:700;font-size:14px">Hover me</span></div>';
    el.appendChild(s);const card=s.querySelector('#cs'),glow=s.querySelector('#glow');let a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const r=card.getBoundingClientRect();glow.style.background='radial-gradient(160px circle at '+(e.clientX-r.left)+'px '+(e.clientY-r.top)+'px,rgba(123,92,255,.3),transparent 70%)';};
    el.onmouseleave=()=>{hover=false;};
    (function loop(){if(!run)return;if(!hover){a+=.03;glow.style.background='radial-gradient(160px circle at '+(50+Math.cos(a)*30)+'% '+(50+Math.sin(a*1.3)*30)+'%,rgba(123,92,255,.3),transparent 70%)';}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
