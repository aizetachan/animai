import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-clip-reveal', title:'Clip-Path Image Reveal', cat:'Scroll',
  tags:['clip-path','reveal','imagen','codrops','máscara','entrada','wipe'],
  desc:'Una imagen se revela barriendo una máscara clip-path al entrar en pantalla. Reveal limpio y moderno.',
  meta:['clip-path','inset','Reveal'],
  prompt:`Crea un "image reveal" con clip-path: la imagen aparece como si una cortina se retirara, animando clip-path:inset() de cerrado (100% por un lado) a abierto (0).
Combínalo con un ligero scale de la imagen en sentido contrario (parallax interno) para un reveal más rico. Dispáralo al entrar en viewport (IntersectionObserver).
Reveal elegante para portfolios, galerías y secciones editoriales.`,
  code:`/* Clip-path image reveal (al entrar en viewport) */
.reveal img { transform: scale(1.3); transition: transform 1s; }
.reveal { clip-path: inset(0 100% 0 0); transition: clip-path 1s cubic-bezier(.7,0,.3,1); }
.reveal.in-view { clip-path: inset(0 0 0 0); }
.reveal.in-view img { transform: scale(1); }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let p=0,dir=1,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0){hold--;}else{p+=dir*.02;if(p>=1){p=1;hold=40;dir=-1;}if(p<=0){p=0;hold=40;dir=1;}}
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const pad=20,W=o.W()-pad*2,H=o.H()-pad*2;
      x.save();x.beginPath();x.rect(pad,pad,W*p,H);x.clip();const sc=1.25-p*.25;const iw=W*sc,ih=H*sc;const ix=pad-(iw-W)/2,iy=pad-(ih-H)/2;
      for(let yy=0;yy<ih;yy+=8)for(let xx=0;xx<iw;xx+=8){const u=xx/iw,v=yy/ih;x.fillStyle='hsl('+(250+u*50)+','+(50+v*20)+'%,'+(45+u*15)+'%)';x.fillRect(ix+xx,iy+yy,8,8);}x.restore();
      x.strokeStyle='#16162a';x.strokeRect(pad,pad,W,H);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
