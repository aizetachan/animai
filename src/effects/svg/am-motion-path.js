import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-motion-path', title:'Motion Path Follow', cat:'SVG',
  tags:['motion path','trayectoria','anime.js','seguir','curva','orientado','svg'],
  desc:'Un objeto recorre una trayectoria SVG orientándose según la curva. Motion path de Anime.js.',
  meta:['Anime.js','motionPath','Orientado'],
  prompt:`Haz que un elemento recorra una trayectoria SVG con Anime.js (createMotionPath): el objeto sigue la curva del path y rota para orientarse según la tangente (como un coche en un circuito).
createMotionPath devuelve translateX, translateY y rotate animables a lo largo del path. Dibuja también el path con un drawable para ver la pista.
Para animaciones de "viaje", flujos de proceso o decoraciones que recorren la página.`,
  code:`// Anime.js — motion path
import { animate, svg } from 'animejs'
const { translateX, translateY, rotate } = svg.createMotionPath('.track')
animate('.car', {
  translateX, translateY, rotate,
  duration: 3000, loop: true, ease: 'linear',
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    function pt(p){const cx=o.W()/2,cy=o.H()/2,rx=o.W()*.32,ry=o.H()*.3;const a=p*6.283;return[cx+Math.cos(a)*rx+Math.sin(a*2)*15,cy+Math.sin(a)*ry];}
    (function loop(){if(!run)return;t+=.005;if(t>1)t=0;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      x.strokeStyle='#1e1e2e';x.lineWidth=2;x.setLineDash([5,5]);x.beginPath();for(let k=0;k<=60;k++){const[px,py]=pt(k/60);k===0?x.moveTo(px,py):x.lineTo(px,py);}x.closePath();x.stroke();x.setLineDash([]);
      const[px,py]=pt(t);const[nx,ny]=pt((t+.01)%1);const ang=Math.atan2(ny-py,nx-px);x.save();x.translate(px,py);x.rotate(ang);x.fillStyle='#7b5cff';x.fillRect(-10,-6,20,12);x.fillStyle='#00e0c6';x.fillRect(6,-6,4,12);x.restore();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
