/** @type {import('../types.js').Effect} */
const effect = {
  id:'svg-stagger-grid', title:'SVG Grid Stagger', cat:'SVG',
  tags:['svg','grid','rejilla','stagger','diagonal','reveal','escalonado'],
  desc:'Rejilla de celdas SVG que aparecen con stagger diagonal, formando una ola de entrada.',
  meta:['SVG','grid','stagger'],
  prompt:`Crea una rejilla NxM de celdas SVG (<rect>) que aparecen con stagger diagonal.
El retardo de cada celda depende de su posición: delay = (fila + columna) * paso. Anima cada celda (opacity 0->1 y scale 0->1 desde su centro) según un reloj global t menos su delay.
Recorta el progreso a [0..1] por celda y aplica un easing. La diagonal crea una "ola" que barre la rejilla. Ideal para galerías y mosaicos que aparecen.`,
  code:`// Stagger diagonal: delay por celda = (row+col)*step
const cols=6, rows=4, step=0.12
function loop(t){
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    const delay=(r+c)*step
    const k=clamp((t-delay)/0.5, 0, 1)   // progreso 0..1
    const e=1-Math.pow(1-k,3)            // easeOutCubic
    cell[r][c].style.opacity=e
    cell[r][c].style.transform=\`scale(\${e})\`
  }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const cols=6,rows=4,gap=4,W=200,H=120,pad=10;
    const cw=(W-pad*2-gap*(cols-1))/cols, ch=(H-pad*2-gap*(rows-1))/rows;
    let cells='';
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const x=pad+c*(cw+gap), y=pad+r*(ch+gap);
      const cx=x+cw/2, cy=y+ch/2;
      const col=((r+c)%2)?'#7b5cff':'#00e0c6';
      cells+=`<rect data-d="${r+c}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" rx="3" fill="${col}" style="transform-box:fill-box;transform-origin:${cx.toFixed(1)}px ${cy.toFixed(1)}px"/>`;
    }
    s.innerHTML=`<svg viewBox="0 0 200 120" width="92%">${cells}</svg>`;
    el.appendChild(s);
    const rects=Array.from(s.querySelectorAll('rect'));
    const step=.16,dur=.6;
    let t=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;t+=dir*.018;
      const maxD=(rows-1)+(cols-1);
      if(t>=maxD*step+dur+.6)dir=-1;if(t<=-.6)dir=1;
      rects.forEach(rc=>{const d=(+rc.dataset.d)*step;
        let k=Math.max(0,Math.min(1,(t-d)/dur));const e=1-Math.pow(1-k,3);
        rc.style.opacity=e.toFixed(3);rc.style.transform=`scale(${(0.2+0.8*e).toFixed(3)})`;});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
