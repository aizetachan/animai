/** @type {import('../types.js').Effect} */
const effect = {
  id:'spotlight', title:'Spotlight Cursor', cat:'Hover & UI',
  tags:['spotlight','cursor','glow','foco','linear','hover','reveal'],
  desc:'Un foco de luz sigue al cursor y revela el contenido bajo la oscuridad. Mueve el ratón.',
  meta:['radial-gradient','mask','Interactivo'],
  prompt:`Efecto "spotlight": una capa oscura cubre la sección y un radial-gradient transparente sigue al cursor revelando lo que hay debajo.
Actualiza --x/--y como CSS vars en mousemove y úsalas en el radial-gradient (mask o background).
Estética tipo Linear/landing dev. En mouseleave centra el foco o súbele opacidad a la capa.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:#0d0d18;display:grid;place-items:center';
    s.innerHTML='<div style="font-size:24px;font-weight:800;color:#7b5cff;letter-spacing:-.02em">Move your mouse</div><div id="sl" style="position:absolute;inset:0;background:radial-gradient(180px circle at 50% 50%,transparent,rgba(7,7,13,.92) 60%);transition:background .08s"></div>';
    el.appendChild(s);const sl=s.querySelector('#sl');let a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();sl.style.background='radial-gradient(180px circle at '+(e.clientX-b.left)+'px '+(e.clientY-b.top)+'px,transparent,rgba(7,7,13,.92) 60%)';};
    el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;if(!hover){a+=.02;const x=el.clientWidth*(.5+Math.cos(a)*.3),y=el.clientHeight*(.5+Math.sin(a*1.3)*.3);sl.style.background='radial-gradient(180px circle at '+x+'px '+y+'px,transparent,rgba(7,7,13,.92) 60%)';}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
