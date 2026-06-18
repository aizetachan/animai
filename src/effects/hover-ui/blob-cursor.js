/** @type {import('../types.js').Effect} */
const effect = {
  id:'blob-cursor', title:'Gooey Blob Follow', cat:'Hover & UI',
  tags:['blob','cursor','gooey','svg','filtro','seguimiento'],
  desc:'Un blob viscoso persigue al cursor con efecto gooey. Mueve el ratón por encima.',
  meta:['SVG filter','feGaussianBlur','Lerp'],
  prompt:`Cursor "gooey blob" personalizado.
Un blob grande persigue al puntero con lerp lento; añade 1-2 satélites con más retardo.
Filtro SVG gooey: feGaussianBlur + feColorMatrix de alto contraste sobre el contenedor para que se fundan al juntarse.
pointer-events:none, solo desktop.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden';
    s.innerHTML='<svg width="0" height="0"><filter id="goo2"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/></filter></svg><div id="gw" style="position:absolute;inset:0;filter:url(#goo2)"></div>';
    el.appendChild(s);const gw=s.querySelector('#gw');
    const blobs=[{r:34,c:'#7b5cff',l:.14,x:0,y:0},{r:22,c:'#00e0c6',l:.08,x:0,y:0},{r:16,c:'#ff5ca8',l:.05,x:0,y:0}];
    blobs.forEach(b=>{b.el=document.createElement('div');b.el.style.cssText='position:absolute;width:'+b.r*2+'px;height:'+b.r*2+'px;margin:'+(-b.r)+'px;border-radius:50%;background:'+b.c;gw.appendChild(b.el);});
    let tx=el.clientWidth/2,ty=el.clientHeight/2,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const r=el.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;if(!hover){a+=.03;tx=el.clientWidth/2+Math.cos(a)*el.clientWidth*.3;ty=el.clientHeight/2+Math.sin(a*1.3)*el.clientHeight*.3;}blobs.forEach(b=>{b.x+=(tx-b.x)*b.l;b.y+=(ty-b.y)*b.l;b.el.style.left=b.x+'px';b.el.style.top=b.y+'px';});raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
