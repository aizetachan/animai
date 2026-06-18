import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cursor-trail', title:'Fluid Cursor Trail', cat:'Partículas',
  tags:['cursor','ratón','trail','estela','interacción','hover'],
  desc:'Estela de partículas con física que sigue al cursor. Pasa el ratón por la preview.',
  meta:['Canvas 2D','Física simple','Interactivo'],
  prompt:`Crea una estela de cursor en canvas 2D superpuesto a la página (pointer-events:none).
Cada frame emite partículas en la posición del ratón con velocidad radial; aplica gravedad/fricción y fade de opacidad y tamaño.
Limita el pool (reusa array) para no fugar memoria. Desactiva en táctil / reduced-motion.`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const ps=[];let mx=o.W()/2,my=o.H()/2,auto=0,raf,run=true;
    el.onmousemove=e=>{const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};
    (function loop(){if(!run)return;auto+=.05;if(!el.matches(':hover')){mx=o.W()/2+Math.cos(auto)*o.W()*.3;my=o.H()/2+Math.sin(auto*1.3)*o.H()*.3;}
      for(let i=0;i<3;i++)ps.push({x:mx,y:my,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,life:1,h:255+Math.random()*40});
      x.fillStyle='rgba(7,7,13,.22)';x.fillRect(0,0,o.W(),o.H());
      for(let i=ps.length-1;i>=0;i--){const p=ps[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.02;p.vx*=.97;p.life-=.022;if(p.life<=0){ps.splice(i,1);continue;}x.fillStyle='hsla('+p.h+',90%,65%,'+p.life+')';x.beginPath();x.arc(p.x,p.y,p.life*4,0,6.28);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
