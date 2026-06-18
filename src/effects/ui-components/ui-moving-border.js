/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-moving-border', title:'Moving Border', cat:'UI Components',
  tags:['border','borde','moving','botón','aceternity','glow','recorrido'],
  desc:'Un destello recorre el perímetro del botón en bucle. El Moving Border de Aceternity para CTAs.',
  meta:['Aceternity UI','offset-path','CTA'],
  prompt:`Recrea el Moving Border de Aceternity: un destello/punto de luz que viaja por el borde de un botón en bucle, dejando un rastro de glow.
Técnica moderna: un elemento pequeño animado con offset-path:rect() (o un radial-gradient cónico enmascarado) recorriendo el perímetro. El botón tiene fondo propio y el glow va por detrás del borde.
Para CTAs que destacan.`,
  code:`// Aceternity UI — Moving Border (React + Framer Motion + offset-path)
// Un span recorre el borde con offset-path y deja glow
.spark {
  offset-path: rect(0 100% 100% 0 round 16px);
  animation: move 3s linear infinite;
  background: radial-gradient(circle, #7b5cff, transparent 60%);
}
@keyframes move { to { offset-distance: 100%; } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div style="position:relative;border-radius:16px;padding:2px;overflow:hidden;background:#16162a"><canvas id="bc" width="320" height="120" style="position:absolute;inset:0;width:100%;height:100%"></canvas><div style="position:relative;background:#12121e;border-radius:14px;padding:14px 28px;color:#eef0f7;font-weight:700;font-size:15px">Get Started</div></div>';
    el.appendChild(s);const bc=s.querySelector('#bc'),bx=bc.getContext('2d');let p=0,raf,run=true;
    (function loop(){if(!run)return;p=(p+.006)%1;bx.clearRect(0,0,320,120);const W=320,H=120,per=2*(W+H);let d=p*per,px,py;if(d<W){px=d;py=0;}else if(d<W+H){px=W;py=d-W;}else if(d<2*W+H){px=W-(d-W-H);py=H;}else{px=0;py=H-(d-2*W-H);}
      const g=bx.createRadialGradient(px,py,0,px,py,40);g.addColorStop(0,'rgba(157,134,255,.9)');g.addColorStop(1,'rgba(157,134,255,0)');bx.fillStyle=g;bx.beginPath();bx.arc(px,py,40,0,6.28);bx.fill();raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
