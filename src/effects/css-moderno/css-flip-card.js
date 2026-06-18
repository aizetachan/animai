/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-flip-card', title:'3D Flip Card', cat:'CSS Moderno',
  tags:['css','flip','card','3d','rotate','hover','reverso'],
  desc:'Tarjeta que gira 180° mostrando su reverso al hover. El flip clásico con transform-style:preserve-3d.',
  meta:['preserve-3d','rotateY','Hover'],
  prompt:`Crea una tarjeta con flip 3D al hover.
Contenedor con perspective; hijo interior con transform-style:preserve-3d y transition de transform. Dos caras (.front/.back) con backface-visibility:hidden, la trasera rotada rotateY(180deg).
En hover del contenedor: el interior rota rotateY(180deg). Úsalo para flashcards, precios o "ver más". Da alternativa accesible por focus/click.`,
  code:`/* Flip card 3D */
.flip { perspective: 1000px; }
.flip-inner {
  position: relative; transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(.2,.8,.2,1);
}
.flip:hover .flip-inner { transform: rotateY(180deg); }
.flip .front, .flip .back {
  position: absolute; inset: 0; backface-visibility: hidden;
}
.flip .back { transform: rotateY(180deg); }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;perspective:900px';
    s.innerHTML='<div id="fi" style="position:relative;width:150px;height:96px;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.2,.8,.2,1)"><div style="position:absolute;inset:0;backface-visibility:hidden;border-radius:14px;background:linear-gradient(135deg,#7b5cff,#5a3fd6);display:grid;place-items:center;color:#fff;font-weight:700">Front</div><div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);border-radius:14px;background:linear-gradient(135deg,#00e0c6,#00a892);display:grid;place-items:center;color:#04221d;font-weight:700">Back</div></div>';
    el.appendChild(s);const fi=s.querySelector('#fi');let a=0,raf,run=true,hover=false;
    el.onmouseenter=()=>{hover=true;fi.style.transform='rotateY(180deg)';};el.onmouseleave=()=>{hover=false;fi.style.transform='rotateY(0deg)';};
    (function loop(){if(!run)return;if(!hover){a+=.01;fi.style.transform='rotateY('+(Math.sin(a)*180+180)/2+'deg)';}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
