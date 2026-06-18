/** @type {import('../types.js').Effect} */
const effect = {
  id:'hv-magnet-lines', title:'Magnet Lines', cat:'Hover & UI',
  tags:['magnet','lines','grid','cursor','rotate','atan2','rejilla'],
  desc:'Rejilla de pequeñas líneas que se orientan apuntando al cursor como limaduras magnéticas.',
  meta:['grid','atan2','transform rotate'],
  prompt:`Crea una rejilla de líneas (varitas) que rotan para apuntar siempre hacia el cursor, como limaduras de hierro alrededor de un imán.
Elementos: un contenedor con display:grid de NxM celdas; cada celda contiene una línea (un span/div estrecho y alto, o un pseudo) centrada.
Técnica: en mousemove, para cada línea calcula el ángulo entre su centro y el cursor con Math.atan2(cursorY - lineY, cursorX - lineX). Aplica transform:rotate(angle) (suma 90deg si la línea es vertical). Cachea los centros de cada línea para no recalcular en cada frame.
Detalle: aplica una transición corta (transform .15s) para que el giro sea fluido. Opcional: atenúa opacidad o color según la distancia al cursor.
Timings: respuesta inmediata al cursor; en auto-demo mueve un cursor virtual en círculo.`,
  code:`<div class="grid"></div>
<style>.grid{display:grid;grid-template-columns:repeat(9,1fr);gap:6px}
.grid i{display:block;width:3px;height:18px;margin:auto;background:#7b5cff;border-radius:3px;transition:transform .15s ease}</style>
<script>
const g=document.querySelector('.grid');
for(let k=0;k<63;k++)g.appendChild(document.createElement('i'));
const lines=[...g.children];let centers=[];
function cache(){centers=lines.map(l=>{const b=l.getBoundingClientRect();return{x:b.left+b.width/2,y:b.top+b.height/2};});}
cache();addEventListener('resize',cache);
g.addEventListener('mousemove',e=>{
  lines.forEach((l,i)=>{
    const a=Math.atan2(e.clientY-centers[i].y,e.clientX-centers[i].x)*180/Math.PI+90;
    l.style.transform='rotate('+a+'deg)';
  });
});
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#06060c';
    const COLS=9,ROWS=7;
    let lines='';for(let k=0;k<COLS*ROWS;k++)lines+='<i></i>';
    s.innerHTML='<style>'
      +'.hvml{position:relative;display:grid;grid-template-columns:repeat('+COLS+',1fr);gap:7px;padding:8px}'
      +'.hvml i{display:block;width:3px;height:18px;margin:auto;background:#7b5cff;border-radius:3px;transition:transform .15s ease,background .2s}'
      +'.hvml-cur{position:absolute;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle,#00e0c6,transparent 70%);pointer-events:none;transform:translate(-50%,-50%);filter:blur(.5px)}'
      +'</style>'
      +'<div class="hvml">'+lines+'<div class="hvml-cur"></div></div>';
    el.appendChild(s);
    const grid=s.querySelector('.hvml'),cur=s.querySelector('.hvml-cur'),items=[...grid.querySelectorAll('i')];
    let centers=[];
    const cache=()=>{const gb=grid.getBoundingClientRect();centers=items.map(l=>{const b=l.getBoundingClientRect();return{x:b.left+b.width/2-gb.left,y:b.top+b.height/2-gb.top};});};
    const ro=new ResizeObserver(cache);ro.observe(grid);cache();
    let raf,run=true,a=0;
    (function loop(){
      if(!run)return;
      a+=.022;
      const gb=grid.getBoundingClientRect();
      const mx=gb.width*(.5+Math.cos(a)*.42),my=gb.height*(.5+Math.sin(a*1.5)*.42);
      cur.style.left=mx+'px';cur.style.top=my+'px';
      for(let i=0;i<items.length;i++){
        const dx=mx-centers[i].x,dy=my-centers[i].y;
        const ang=Math.atan2(dy,dx)*180/Math.PI+90;
        const d=Math.hypot(dx,dy);
        items[i].style.transform='rotate('+ang+'deg)';
        items[i].style.background=d<70?'#00e0c6':'#7b5cff';
      }
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
