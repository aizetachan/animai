import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cd-elastic-slider', title:'Elastic Drag Slider', cat:'Hover & UI',
  tags:['slider','drag','elastic','codrops','arrastrar','inercia','carrusel'],
  desc:'Carrusel que se arrastra con inercia y rebote elástico en los extremos. Drag slider de Codrops.',
  meta:['drag','spring','Inercia'],
  prompt:`Recrea un "elastic drag slider" (Codrops): un carrusel que se arrastra con el ratón/dedo, con inercia al soltar y un rebote elástico (spring) cuando llega a los extremos.
Captura el drag para mover el track; al soltar, aplica la velocidad residual con fricción; si se pasa de los límites, tira de vuelta con un muelle.
Para galerías y carruseles con tacto físico premium.`,
  code:`// Elastic drag slider — inercia + rebote en límites
function loop() {
  if (!dragging) {
    velocity *= friction
    pos += velocity
    if (pos > 0) { pos += (0 - pos) * 0.2; velocity = 0 }      // rebote
    if (pos < min) { pos += (min - pos) * 0.2; velocity = 0 }
  }
  track.style.transform = \`translateX(\${pos}px)\`
  requestAnimationFrame(loop)
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const n=6,cardW=70,gap=12;const total=n*(cardW+gap);let pos=0,vel=0,dir=-1,raf,run=true,t=0;
    (function loop(){if(!run)return;t++;vel+=dir*.4;vel*=.92;pos+=vel;const min=-(total-o.W()+20);if(pos>0){pos+=(0-pos)*.15;vel=0;dir=-1;}if(pos<min){pos+=(min-pos)*.15;vel=0;dir=1;}
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());for(let i=0;i<n;i++){const cx=20+pos+i*(cardW+gap);x.fillStyle='hsl('+(250+i*15)+',60%,58%)';x.fillRect(cx,o.H()/2-30,cardW,60);x.fillStyle='rgba(255,255,255,.85)';x.font='bold 18px Inter';x.textAlign='center';x.textBaseline='middle';x.fillText(i+1,cx+cardW/2,o.H()/2);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
