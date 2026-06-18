/** @type {import('../types.js').Effect} */
const effect = {
  id:'hover-cursor-follow', title:'Custom Cursor Follower', cat:'Hover & UI',
  tags:['cursor','follower','seguir','círculo','lerp','magnético','custom'],
  desc:'Un círculo sustituye al cursor y lo sigue con retardo, creciendo sobre elementos interactivos.',
  meta:['lerp','mix-blend','Cursor'],
  prompt:`Crea un cursor personalizado: oculta el cursor nativo y dibuja un círculo que sigue al ratón con un ligero retardo (lerp/lag), y que crece o cambia al pasar sobre links/botones.
Mantén un punto que sigue exacto y un anillo que persigue con interpolación. Usa mix-blend-mode:difference para que invierta el color del fondo.
El detalle que firma las webs de agencia. Desactívalo en táctil.`,
  code:`// Custom cursor con lag (lerp)
const dot = { x: 0, y: 0 }, ring = { x: 0, y: 0 }
addEventListener('mousemove', e => { dot.x = e.clientX; dot.y = e.clientY })
function loop() {
  ring.x += (dot.x - ring.x) * 0.15      // el anillo persigue con retardo
  ring.y += (dot.y - ring.y) * 0.15
  ringEl.style.transform = \`translate(\${ring.x}px, \${ring.y}px)\`
  dotEl.style.transform = \`translate(\${dot.x}px, \${dot.y}px)\`
  requestAnimationFrame(loop)
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden;cursor:none;display:grid;place-items:center';
    s.innerHTML='<div style="color:#8a8ca3;font-size:13px;pointer-events:none">mueve el ratón aquí</div><div id="ring" style="position:absolute;width:34px;height:34px;border:2px solid #7b5cff;border-radius:50%;left:0;top:0;margin:-17px 0 0 -17px;pointer-events:none;transition:width .2s,height .2s"></div><div id="dot" style="position:absolute;width:6px;height:6px;background:#00e0c6;border-radius:50%;left:0;top:0;margin:-3px 0 0 -3px;pointer-events:none"></div>';
    el.appendChild(s);const ring=s.querySelector('#ring'),dot=s.querySelector('#dot');let dx=0,dy=0,rx=0,ry=0,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();dx=e.clientX-b.left;dy=e.clientY-b.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.03;if(!hover){dx=o2(el).w*(.5+Math.cos(a)*.3);dy=o2(el).h*(.5+Math.sin(a*1.3)*.3);}rx+=(dx-rx)*.15;ry+=(dy-ry)*.15;ring.style.transform='translate('+rx+'px,'+ry+'px)';dot.style.transform='translate('+dx+'px,'+dy+'px)';raf=requestAnimationFrame(loop);})();
    function o2(e){const r=e.getBoundingClientRect();return{w:r.width,h:r.height};}
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
