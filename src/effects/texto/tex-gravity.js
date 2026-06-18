import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-gravity', title:'Gravity Text', cat:'Texto',
  tags:['gravity','gravedad','física','caer','letras','rebote','matter'],
  desc:'Las letras caen con física y rebotan en el suelo. Tipografía con gravedad simulada.',
  meta:['física','gravedad','Rebote'],
  prompt:`Crea texto con gravedad: las letras caen desde su posición, rebotan en el "suelo" del contenedor y se asientan, con física simple (velocidad, gravedad, restitución).
Cada letra es una partícula con y, vy; aplica gravedad cada frame y rebote al tocar el fondo (vy *= -0.6). Opcional: colisión lateral con las paredes.
Para heros lúdicos o un 404 con personalidad. (Versión pro: Matter.js).`,
  code:`// Gravity text — cada letra es una partícula con física
letters.forEach(L => {
  L.vy += 0.5                      // gravedad
  L.y += L.vy
  if (L.y > floor) { L.y = floor; L.vy *= -0.6 }   // rebote
  L.el.style.transform = \`translateY(\${L.y}px)\`
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const txt='GRAVITY';let L=[];
    function reset(){L=[];const fs=Math.min(o.W()/8,36);x.font='800 '+fs+'px Inter,sans-serif';let tw=0;const ws=[];for(const c of txt){const w=x.measureText(c).width;ws.push(w);tw+=w;}let cxp=(o.W()-tw)/2;for(let i=0;i<txt.length;i++){L.push({c:txt[i],x:cxp,y:-30-i*25,vy:0,w:ws[i],fs});cxp+=ws[i];}}
    reset();let raf,run=true,c=0;
    (function loop(){if(!run)return;c++;if(c%180===0)reset();x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());x.textBaseline='alphabetic';
      const floor=o.H()-14;L.forEach((l,i)=>{l.vy+=.5;l.y+=l.vy;if(l.y>floor){l.y=floor;l.vy*=-.55;if(Math.abs(l.vy)<1)l.vy=0;}x.font='800 '+l.fs+'px Inter,sans-serif';x.fillStyle=i%2?'#00e0c6':'#7b5cff';x.fillText(l.c,l.x,l.y);});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
