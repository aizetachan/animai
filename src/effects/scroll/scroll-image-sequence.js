import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'scroll-image-sequence', title:'Image Sequence Scroll', cat:'Scroll',
  tags:['scroll','sequence','frames','scrub','apple','vídeo','timeline'],
  desc:'Una secuencia de frames avanza con el scroll, como el vídeo scrubbed de Apple.',
  meta:['scroll %','frame index','Scrub'],
  prompt:`Recrea el "scroll-scrubbed video" de Apple: una secuencia de imágenes (frames) cuyo índice se controla con el progreso del scroll, dando la ilusión de un vídeo que avanza/retrocede al scrollear.
Precarga N frames; mapea scrollProgress (0-1) a frameIndex = floor(progress * (N-1)) y pinta ese frame en un canvas pinneado.
Para presentaciones de producto cinematográficas. Con GSAP: ScrollTrigger + scrub.`,
  code:`// Image sequence on scroll (estilo Apple)
const frames = []   // precargar N imágenes
ScrollTrigger.create({
  trigger: '.section', start: 'top top', end: '+=3000', scrub: true,
  onUpdate: (self) => {
    const i = Math.floor(self.progress * (frames.length - 1))
    ctx.drawImage(frames[i], 0, 0)
  }
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let p=0,dir=1,raf,run=true;const N=60;
    (function loop(){if(!run)return;p+=dir*.006;if(p>=1){dir=-1;}if(p<=0){dir=1;}const f=Math.floor(p*(N-1));
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2;const ang=f/N*6.283*2;
      // "frame": un objeto 3D-ish que rota según el frame
      x.save();x.translate(cx,cy);for(let i=0;i<3;i++){x.rotate(ang*.5+i*2.1);x.strokeStyle='hsl('+(260+i*40)+',80%,65%)';x.lineWidth=3;x.beginPath();x.ellipse(0,0,40+i*14,18+i*6,0,0,6.28);x.stroke();}x.restore();
      x.fillStyle='#8a8ca3';x.font='11px monospace';x.fillText('frame '+(f+1)+'/'+N,12,o.H()-12);
      x.fillStyle='#16162a';x.fillRect(0,o.H()-3,o.W(),3);x.fillStyle='#00e0c6';x.fillRect(0,o.H()-3,p*o.W(),3);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
