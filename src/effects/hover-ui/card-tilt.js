/** @type {import('../types.js').Effect} */
const effect = {
  id:'card-tilt', title:'3D Card Tilt', cat:'Hover & UI',
  tags:['card','tilt','3d','hover','perspectiva','glare'],
  desc:'Tarjeta con inclinación 3D y reflejo que sigue al ratón. Mueve el cursor sobre la preview.',
  meta:['perspective','rotateXY','Glare'],
  prompt:`Tarjeta con tilt 3D al hover.
Contenedor con perspective. En mousemove mapea la posición del cursor (0->1) a rotateY(±10deg) y rotateX(∓10deg).
Añade capa "glare" (radial-gradient blanco) que sigue al cursor. Resetea suave en mouseleave. transform-style:preserve-3d.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;perspective:700px';
    s.innerHTML='<div id="tc" style="width:150px;height:100px;border-radius:16px;background:linear-gradient(135deg,#1e1e3a,#2c2c54);border:1px solid #3a3a5e;position:relative;overflow:hidden;transition:transform .2s;transform-style:preserve-3d;display:grid;place-items:center;color:#eef0f7;font-weight:700"><span style="transform:translateZ(30px)">Nakama</span><div id="gl" style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.35),transparent 50%);opacity:0;transition:opacity .2s"></div></div>';
    el.appendChild(s);const tc=s.querySelector('#tc'),gl=s.querySelector('#gl');let a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const r=tc.getBoundingClientRect();const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;tc.style.transform='rotateY('+((px-.5)*20)+'deg) rotateX('+(-(py-.5)*20)+'deg)';gl.style.opacity=1;gl.style.background='radial-gradient(circle at '+px*100+'% '+py*100+'%,rgba(255,255,255,.35),transparent 50%)';};
    el.onmouseleave=()=>{hover=false;tc.style.transform='none';gl.style.opacity=0;};
    (function loop(){if(!run)return;if(!hover){a+=.025;tc.style.transform='rotateY('+Math.cos(a)*12+'deg) rotateX('+Math.sin(a)*8+'deg)';}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
