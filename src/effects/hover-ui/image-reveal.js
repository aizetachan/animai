/** @type {import('../types.js').Effect} */
const effect = {
  id:'image-reveal', title:'Image Hover Reveal', cat:'Hover & UI',
  tags:['imagen','reveal','clip','hover','gallery','portfolio','mask'],
  desc:'La imagen se descubre con un barrido al hacer hover. El clásico de portfolios y agencias.',
  meta:['clip-path','Hover','Portfolio'],
  prompt:`Image reveal al hover con clip-path.
Estado inicial: clip-path:inset(0 100% 0 0) (oculta). Al hover: inset(0 0 0 0). Transición de clip-path ~0.6s con easing.
Acompaña con un ligero scale(1.05) de la imagen interior para dar profundidad. Ideal para grids de portfolio/agencia.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0d0d18';
    s.innerHTML='<div style="position:relative;width:160px;height:110px;border-radius:12px;overflow:hidden;background:#16162a"><div id="rv" style="position:absolute;inset:0;background:linear-gradient(135deg,#7b5cff,#00e0c6,#ff5ca8);clip-path:inset(0 100% 0 0);transition:clip-path .6s cubic-bezier(.7,0,.3,1)"></div><span style="position:absolute;inset:0;display:grid;place-items:center;color:#5a5c72;font-size:12px;font-weight:600">hover</span></div>';
    el.appendChild(s);const rv=s.querySelector('#rv');let a=0,raf,run=true,hover=false;
    el.onmouseenter=()=>{hover=true;rv.style.clipPath='inset(0 0 0 0)';};
    el.onmouseleave=()=>{hover=false;rv.style.clipPath='inset(0 100% 0 0)';};
    (function loop(){if(!run)return;if(!hover){a+=.012;const p=(Math.sin(a)*.5+.5)*100;rv.style.clipPath='inset(0 '+(100-p)+'% 0 0)';}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
