import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-scratch-reveal', title:'Scratch to Reveal', cat:'Hover & UI',
  tags:['scratch','rascar','reveal','revelar','canvas','lottery','destination-out','mask'],
  desc:'Superficie rascable estilo tarjeta de lotería: arrastra para borrar la capa y revelar el premio debajo.',
  meta:['canvas','globalCompositeOperation','Reveal'],
  prompt:`Crea un efecto de "rascar para revelar" como las tarjetas de lotería.
Estructura: un contenedor con el contenido revelado debajo (texto/imagen) y, encima, un canvas cubierto por una capa opaca (color o gradiente) dibujada con fillRect.
Técnica: escucha pointer/mouse down+move sobre el canvas; mientras se arrastra, pinta círculos con ctx.globalCompositeOperation='destination-out' a lo largo del trazo para borrar la capa y dejar ver el contenido. Usa lineTo/arc o stamps circulares con un radio de ~20px para el "dedo".
Opcional: calcula el porcentaje borrado leyendo getImageData y, al superar un umbral, revela todo. Reinicia repintando la capa.`,
  code:`const ctx=canvas.getContext('2d');
ctx.fillStyle='#3a3a4a';ctx.fillRect(0,0,W,H); // capa que tapa
let down=false;
canvas.addEventListener('pointerdown',()=>down=true);
canvas.addEventListener('pointerup',()=>down=false);
canvas.addEventListener('pointermove',e=>{
  if(!down)return;
  const r=canvas.getBoundingClientRect();
  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath();
  ctx.arc(e.clientX-r.left,e.clientY-r.top,22,0,Math.PI*2);
  ctx.fill(); // borra la capa -> revela lo de debajo
});`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;background:#0a0a14;display:grid;place-items:center';
    s.innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:30px;font-weight:900;background:linear-gradient(135deg,#7b5cff,#00e0c6);-webkit-background-clip:text;background-clip:text;color:transparent">¡PREMIO!</div>';
    el.appendChild(s);
    const o=canvasPreview(s),x=o.x;o.c.style.position='absolute';o.c.style.inset='0';
    let raf,run=true,t=0;
    function coat(){x.globalCompositeOperation='source-over';const g=x.createLinearGradient(0,0,o.W(),o.H());g.addColorStop(0,'#2a2a3a');g.addColorStop(1,'#3c3c52');x.fillStyle=g;x.fillRect(0,0,o.W(),o.H());x.fillStyle='#ffffff22';x.font='bold 13px sans-serif';x.textAlign='center';x.fillText('RASCA AQUÍ',o.W()/2,o.H()/2);}
    coat();
    // trazo de rascado simulado: una S que recorre la caja
    function scratch(px,py){x.globalCompositeOperation='destination-out';x.beginPath();x.arc(px,py,20,0,Math.PI*2);x.fill();}
    (function loop(){if(!run)return;t+=.018;
      if(t<2.4){const u=t/2.4;const W=o.W(),H=o.H();const px=W*(.18+u*.64);const py=H*(.5+Math.sin(u*Math.PI*2.6)*.28);scratch(px,py);scratch(px,py-14);scratch(px,py+14);}
      else if(t>3.6){t=0;coat();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
