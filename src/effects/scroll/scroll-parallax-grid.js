import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-parallax-grid', title:'Parallax Image Grid', cat:'Scroll',
  tags:['scroll','parallax','grid','columnas','velocidad','galería'],
  desc:'Galería donde las columnas se desplazan a distinta velocidad al scrollear. Parallax de columnas.',
  meta:['scroll %','translateY','Galería'],
  prompt:`Crea una galería en columnas con parallax: cada columna se desplaza verticalmente a una velocidad ligeramente distinta al scrollear (unas más rápidas, otras más lentas), creando profundidad.
Mapea el scroll a translateY por columna con un factor distinto (ej. col1 *0.8, col2 *1.2). Las imágenes/cards se "deslizan" entre sí.
Para portfolios y secciones visuales premium.`,
  code:`// Parallax image grid — translateY por columna con factor distinto
columns.forEach((col, i) => {
  const speed = 0.7 + i * 0.25
  col.style.transform = \`translateY(\${-scrollY * speed * 0.1}px)\`
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let p=0,dir=1,raf,run=true;const cols=3,items=5;
    (function loop(){if(!run)return;p+=dir*.004;if(p>=1)dir=-1;if(p<=0)dir=1;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const cw=o.W()/cols;for(let c=0;c<cols;c++){const speed=.6+c*.4;const off=p*200*speed;for(let i=-1;i<items;i++){const yy=((i*70+off)%(items*70))-20;const h=56;x.fillStyle='hsl('+(250+c*30)+','+(50+i*5)+'%,'+(40+(i%2)*10)+'%)';x.fillRect(c*cw+4,yy,cw-8,h);}}
      x.fillStyle='#16162a';x.fillRect(o.W()-5,0,3,o.H());x.fillStyle='#7b5cff';x.fillRect(o.W()-5,p*(o.H()-30),3,30);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
