/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-zoom-text-reveal', title:'Zoom Text Reveal', cat:'Scroll',
  tags:['scroll','zoom','text reveal','escala','mask','tipografia','cinematic'],
  desc:'Una palabra gigante se escala hasta llenar la pantalla y, a traves de su interior, revela el contenido que hay detras.',
  meta:['scroll %','scale + clip','Cinematic'],
  prompt:`Crea un efecto de "zoom text reveal" ligado al scroll.
Estructura: una seccion fija (pin) con dos capas. Capa frontal: una mascara de color solido con un hueco con forma de texto gigante (usa una palabra centrada). Capa trasera: la imagen/contenido a revelar.
Algoritmo: mapea el progreso de scroll 0->1. Escala el texto (y por tanto el hueco) de scale ~0.4 a scale ~14, de modo que el interior de las letras crezca hasta dejar ver toda la capa trasera. Tecnica recomendada: SVG <mask> o <text> con un rect que cubre todo y el texto en negro (luminance mask), o background-clip:text invertido. Al final, fundir la mascara a opacidad 0.
Timings: scrub continuo con el scroll (GSAP ScrollTrigger pin + scrub). En la preview se simula el progreso en bucle 0->1->0 con rAF.`,
  code:`<!-- SVG luminance mask: el texto es el hueco que crece -->
<section class="zt-pin">
  <img class="zt-back" src="hero.jpg" alt="">
  <svg class="zt-mask" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
    <defs>
      <mask id="zt">
        <rect width="100%" height="100%" fill="#fff"/>
        <text x="600" y="350" text-anchor="middle" dominant-baseline="central"
              font-size="200" font-weight="900" fill="#000">ZOOM</text>
      </mask>
    </defs>
    <rect width="100%" height="100%" fill="#0b0b14" mask="url(#zt)"/>
  </svg>
</section>
<script type="module">
import gsap from 'gsap'; import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const txt = document.querySelector('.zt-mask text');
gsap.timeline({scrollTrigger:{trigger:'.zt-pin',pin:true,scrub:true,end:'+=180%'}})
  .fromTo(txt,{attr:{'font-size':200},transformOrigin:'center'},
              {attr:{'font-size':2800},ease:'power2.in'})
  .to('.zt-mask',{opacity:0},'>-0.1');
<\/script>`,
  /* @render-start */
  render(el){
    const wrap=document.createElement('div');wrap.className='stage';
    wrap.style.cssText='position:relative;width:100%;height:100%;overflow:hidden;background:#0b0b14;border-radius:inherit';
    wrap.innerHTML='<style>'
      +'@keyframes ztrGrad{0%{background-position:0% 50%}100%{background-position:100% 50%}}'
      +'.ztr-back{position:absolute;inset:0;background:linear-gradient(120deg,#7b5cff,#00e0c6,#ff5ca8,#7b5cff);background-size:300% 300%;animation:ztrGrad 6s linear infinite}'
      +'.ztr-back::after{content:"";position:absolute;inset:0;background:radial-gradient(120px 120px at 30% 35%,rgba(255,255,255,.35),transparent 70%)}'
      +'.ztr-svg{position:absolute;inset:0;width:100%;height:100%}'
      +'</style>'
      +'<div class="ztr-back"></div>'
      +'<svg class="ztr-svg" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid slice">'
      +'<defs><mask id="ztrMask">'
      +'<rect width="260" height="200" fill="#fff"/>'
      +'<text class="ztr-text" x="130" y="100" text-anchor="middle" dominant-baseline="central" font-family="Inter,Arial,sans-serif" font-weight="900" font-size="60" fill="#000">AI</text>'
      +'</mask></defs>'
      +'<rect class="ztr-cover" width="260" height="200" fill="#0b0b14" mask="url(#ztrMask)"/>'
      +'</svg>';
    el.appendChild(wrap);
    const txt=wrap.querySelector('.ztr-text');
    const cover=wrap.querySelector('.ztr-cover');
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
      const fs=60+e*1100;
      txt.setAttribute('font-size',fs.toFixed(1));
      cover.setAttribute('opacity',(1-Math.max(0,(p-.85)/.15)).toFixed(3));
      fill.style.height=(p*100)+'%';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
