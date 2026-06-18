/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-spotlight-cursor', title:'Spotlight Cursor Mask', cat:'Hover & UI',
  tags:['spotlight','cursor','máscara','codrops','revelar','oscuro','linterna'],
  desc:'Una linterna sigue al cursor revelando contenido oculto en la oscuridad. Spotlight mask.',
  meta:['radial mask','cursor','Reveal'],
  prompt:`Crea un efecto "linterna/spotlight" que revela contenido: la pantalla está oscura y un círculo de luz que sigue al cursor revela lo que hay debajo (texto/imagen).
Usa un overlay oscuro con una máscara radial (radial-gradient como mask) centrada en la posición del cursor, de modo que solo se ve el contenido dentro del círculo de luz.
Para reveals interactivos, easter eggs o secciones de misterio/descubrimiento.`,
  code:`// Spotlight cursor mask — overlay oscuro con agujero radial en el cursor
overlay.style.maskImage = \`radial-gradient(circle 100px at \${x}px \${y}px,
  transparent 0, transparent 80px, black 130px)\`
// lo que está bajo el agujero se ve; el resto queda oscuro`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:#0a0a14;cursor:none';
    s.innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:26px;font-weight:900;background:linear-gradient(135deg,#7b5cff,#00e0c6);-webkit-background-clip:text;background-clip:text;color:transparent">SECRETO</div><div id="ov" style="position:absolute;inset:0;background:#06060c"></div>';
    el.appendChild(s);const ov=s.querySelector('#ov');let a=0,raf,run=true,hover=false,mx=0,my=0;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.03;if(!hover){const b=el.getBoundingClientRect();mx=b.width*(.5+Math.cos(a)*.3);my=b.height*(.5+Math.sin(a*1.4)*.3);}const m='radial-gradient(circle 70px at '+mx+'px '+my+'px,transparent 0,transparent 50px,#000 90px)';ov.style.webkitMaskImage=m;ov.style.maskImage=m;raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
