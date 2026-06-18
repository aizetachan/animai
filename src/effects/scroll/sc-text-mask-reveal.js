/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-text-mask-reveal', title:'Text Mask Reveal', cat:'Scroll',
  tags:['scroll','text mask','background-clip','imagen','tipografia','reveal','clip'],
  desc:'Una imagen recortada con la forma del texto: el titulo crece con el scroll y va dejando ver mas de la imagen a traves de las letras.',
  meta:['background-clip:text','scale + scroll','Typography'],
  prompt:`Crea un "text mask reveal": un titulo cuyo relleno es una imagen (la imagen se ve solo dentro de las letras) y que crece al hacer scroll.
Estructura: un contenedor con background:url(imagen) y la propiedad background-clip:text + color:transparent, de modo que la imagen aparezca recortada por el texto. Coloca el texto centrado.
Algoritmo: mapea el progreso de scroll 0->1 a la escala del texto (scale ~0.6 a ~2.4) y/o al background-size, asi al crecer las letras se revela mas zona de la imagen. Opcional: mover el background-position para dar parallax.
Tecnica: CSS -webkit-background-clip:text; con GSAP ScrollTrigger (pin + scrub) animar transform:scale del titulo. En la preview se simula el progreso en bucle 0->1->0 con rAF.`,
  code:`<section class="tm-pin">
  <h1 class="tm-title">ANIMAI</h1>
</section>
<style>
.tm-title{
  font:900 120px/1 Inter,sans-serif; text-align:center;
  background-image:url('photo.jpg');
  background-size:140% auto; background-position:center;
  -webkit-background-clip:text; background-clip:text;
  color:transparent; transform:scale(.6);
}
</style>
<script type="module">
import gsap from 'gsap'; import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
gsap.to('.tm-title',{
  scale:2.4, backgroundPositionY:'30%',
  ease:'none',
  scrollTrigger:{trigger:'.tm-pin',pin:true,scrub:true,end:'+=160%'}
});
<\/script>`,
  /* @render-start */
  render(el){
    const wrap=document.createElement('div');wrap.className='stage';
    wrap.style.cssText='position:relative;width:100%;height:100%;overflow:hidden;background:#0b0b14;display:grid;place-items:center;border-radius:inherit';
    // imagen sintetica embebida como gradiente vivo
    const img='linear-gradient(120deg,#7b5cff,#00e0c6 40%,#ff5ca8 70%,#7b5cff)';
    wrap.innerHTML='<style>'
      +'@keyframes tmrFlow{0%{background-position:0% 50%,0 0}100%{background-position:100% 50%,0 0}}'
      +'.tmr-title{font:900 64px/1 Inter,Arial,sans-serif;letter-spacing:1px;text-align:center;'
      +'background-image:'+img+';background-size:280% 280%;background-position:50% 50%;'
      +'-webkit-background-clip:text;background-clip:text;color:transparent;'
      +'-webkit-text-fill-color:transparent;will-change:transform;animation:tmrFlow 5s linear infinite}'
      +'</style>'
      +'<h1 class="tmr-title">ANIMAI</h1>';
    el.appendChild(wrap);
    const title=wrap.querySelector('.tmr-title');
    const bar=document.createElement('div');
    bar.style.cssText='position:absolute;right:6px;top:0;width:3px;height:100%;background:#16162a;z-index:3';
    const fill=document.createElement('div');
    fill.style.cssText='position:absolute;right:6px;top:0;width:3px;background:#00e0c6;z-index:4';
    wrap.appendChild(bar);wrap.appendChild(fill);
    let p=0,dir=1,raf,run=true;
    (function loop(){if(!run)return;
      p+=dir*.006;
      if(p>=1){p=1;dir=-1;}
      if(p<=0){p=0;dir=1;}
      const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2; // easeInOutQuad
      const sc=0.6+e*1.9;
      title.style.transform='scale('+sc.toFixed(3)+')';
      title.style.backgroundSize=(180+e*180).toFixed(0)+'% '+(180+e*180).toFixed(0)+'%';
      fill.style.height=(p*100)+'%';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
