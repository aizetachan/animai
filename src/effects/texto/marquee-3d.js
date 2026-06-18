/** @type {import('../types.js').Effect} */
const effect = {
  id:'marquee-3d', title:'Velocity Marquee', cat:'Texto',
  tags:['marquee','ticker','scroll','texto','infinito','velocidad'],
  desc:'Cinta de texto infinita cuya velocidad reacciona al scroll. Separadores de sección con carácter.',
  meta:['CSS + JS','Scroll-linked','Loop'],
  prompt:`Marquee de texto infinito como separador de sección.
Duplica el contenido y desplázalo con translateX en bucle (rAF). Liga la velocidad al scroll: lee el delta de scrollY entre frames y súmalo a la velocidad base, invirtiendo según el signo.
Tipografía display grande, sin radius.`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:flex;flex-direction:column;justify-content:center;gap:14px;overflow:hidden';
    s.innerHTML='<div id="m1" style="white-space:nowrap;font-size:30px;font-weight:800;color:#eef0f7"></div><div id="m2" style="white-space:nowrap;font-size:30px;font-weight:800;color:#7b5cff"></div>';
    el.appendChild(s);const t='MOTION · LAB · WEBGL · SCROLL · ',r1=s.querySelector('#m1'),r2=s.querySelector('#m2');r1.textContent=t.repeat(6);r2.textContent=t.repeat(6);
    let o1=0,o2=-300,raf,run=true;
    (function loop(){if(!run)return;o1-=1.2;o2+=1.0;if(o1<-600)o1=0;if(o2>0)o2=-600;r1.style.transform='translateX('+o1+'px)';r2.style.transform='translateX('+o2+'px)';raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
