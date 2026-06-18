import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'txt-outline-fill', title:'Outline to Fill Text', cat:'Texto',
  tags:['outline','fill','texto','contorno','relleno','stroke','reveal'],
  desc:'El texto pasa de solo contorno a relleno sólido, como pintándose. Reveal tipográfico elegante.',
  meta:['text-stroke','fill','Reveal'],
  prompt:`Crea un texto que pasa de contorno (outline) a relleno: empieza mostrando solo el trazo de las letras (-webkit-text-stroke con fill transparente) y se rellena de color con un barrido (background-clip:text + gradiente que avanza, o transición de color).
Anima el relleno con un gradiente animado recortado al texto, o letra a letra. El contorno permanece para definir.
Para titulares editoriales y reveals tipográficos sofisticados.`,
  code:`/* Outline to fill text */
.otf {
  -webkit-text-stroke: 1.5px #7b5cff;
  color: transparent;
  background: linear-gradient(90deg, #7b5cff 50%, transparent 50%);
  background-size: 200% 100%; background-position: 100% 0;
  -webkit-background-clip: text; background-clip: text;
  transition: background-position 1s;
}
.otf.fill { background-position: 0 0; }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.012;if(t>=1.2){t=0;hold=30;}}x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const cx=o.W()/2,cy=o.H()/2;x.font='900 '+Math.min(o.W(),o.H())*.3+'px Inter';x.textAlign='center';x.textBaseline='middle';const word='FILL';
      // outline
      x.strokeStyle='#7b5cff';x.lineWidth=2;x.strokeText(word,cx,cy);
      // fill recortado por un clip que avanza
      const p=Math.min(1,t);const tw=x.measureText(word).width;x.save();x.beginPath();x.rect(cx-tw/2,cy-40,tw*p,80);x.clip();const g=x.createLinearGradient(cx-tw/2,0,cx+tw/2,0);g.addColorStop(0,'#7b5cff');g.addColorStop(1,'#00e0c6');x.fillStyle=g;x.fillText(word,cx,cy);x.restore();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
