import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'nav-command-palette', title:'Command Palette', cat:'Navegación',
  tags:['command','palette','cmdk','búsqueda','modal','spotlight','atajo'],
  desc:'Un buscador de comandos tipo ⌘K que aparece con blur y filtra resultados al teclear. El cmdk moderno.',
  meta:['modal','filter','⌘K'],
  prompt:`Crea un "command palette" estilo ⌘K (Raycast/Linear/Spotlight): al invocarlo, aparece un modal centrado con backdrop blur y un input; al teclear, la lista de comandos se filtra y el elemento resaltado se mueve, con iconos y atajos.
Anima la entrada del modal (scale+fade), filtra la lista en vivo y resalta la selección con un fondo deslizante. Cierra con Esc/click fuera.
Para apps productivas, dashboards y webs con navegación por teclado.`,
  code:`// Command palette (⌘K) — filtrado en vivo + selección deslizante
const filtered = commands.filter(c => c.label.toLowerCase().includes(query))
// modal: scale(.95)->1 + opacity; backdrop: blur
// flechas ↑↓ mueven el highlight; Enter ejecuta`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cmds=['Nuevo proyecto','Buscar archivos','Ir a ajustes','Invitar equipo','Cambiar tema'];let sel=0,t=0,raf,run=true;
    (function loop(){if(!run)return;t++;if(t%45===0)sel=(sel+1)%cmds.length;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      // backdrop
      x.fillStyle='rgba(0,0,0,.4)';x.fillRect(0,0,o.W(),o.H());
      const mw=o.W()*.8,mx=(o.W()-mw)/2,my=14,mh=o.H()-28;x.fillStyle='#16162a';roundRect(x,mx,my,mw,mh,10);x.fill();x.strokeStyle='#2a2a3e';x.stroke();
      // input
      x.fillStyle='#0e0e18';roundRect(x,mx+8,my+8,mw-16,20,6);x.fill();x.fillStyle='#7b5cff';x.font='11px Inter';x.textAlign='left';x.textBaseline='middle';x.fillText('⌘K  buscar…',mx+16,my+18);
      // list
      cmds.forEach((c,i)=>{const y=my+38+i*((mh-44)/cmds.length);const rowH=(mh-44)/cmds.length-2;if(i===sel){x.fillStyle='rgba(123,92,255,.25)';roundRect(x,mx+8,y,mw-16,rowH,5);x.fill();}x.fillStyle=i===sel?'#eef0f7':'#8a8ca3';x.font='11px Inter';x.fillText('▸ '+c,mx+16,y+rowH/2);});
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
