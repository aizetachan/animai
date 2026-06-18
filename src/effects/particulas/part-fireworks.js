import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'part-fireworks', title:'Fireworks', cat:'Partículas',
  tags:['fuegos','fireworks','artificiales','explosión','celebración','noche'],
  desc:'Fuegos artificiales que suben y explotan en chispas. Celebración espectacular en canvas.',
  meta:['Canvas 2D','2 fases','Celebración'],
  prompt:`Crea fuegos artificiales en canvas 2D con dos fases: un cohete que sube (con estela) y, al llegar a su apogeo, explota en N chispas radiales con gravedad y fade.
Gestiona un array de cohetes y otro de chispas; al explotar el cohete, genera las chispas en su posición. Colores aleatorios por explosión.
Para pantallas de éxito/fin de año/logros.`,
  code:`// Fireworks (canvas 2D) — cohete + explosión
function explode(x, y, hue) {
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, sp = 1 + Math.random() * 3
    sparks.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, hue, life: 1 })
  }
}
// rocket sube hasta targetY -> explode(); sparks: vy += 0.04 (gravedad), life -= 0.012`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const R=[],S=[];function rocket(){R.push({x:Math.random()*o.W(),y:o.H(),ty:o.H()*(.2+Math.random()*.3),hue:Math.random()*360});}
    function explode(px,py,hue){for(let i=0;i<54;i++){const a=i/54*6.28,sp=1+Math.random()*2.5;S.push({x:px,y:py,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,hue,life:1});}}
    let raf,run=true,c=0;
    (function loop(){if(!run)return;c++;if(c%40===0)rocket();x.fillStyle='rgba(7,7,16,.2)';x.fillRect(0,0,o.W(),o.H());
      for(let i=R.length-1;i>=0;i--){const r=R[i];r.y-=4;x.fillStyle='hsl('+r.hue+',90%,70%)';x.beginPath();x.arc(r.x,r.y,2,0,6.28);x.fill();if(r.y<=r.ty){explode(r.x,r.y,r.hue);R.splice(i,1);}}
      for(let i=S.length-1;i>=0;i--){const sp=S[i];sp.vy+=.04;sp.x+=sp.vx;sp.y+=sp.vy;sp.life-=.012;if(sp.life<=0){S.splice(i,1);continue;}x.fillStyle='hsla('+sp.hue+',90%,65%,'+sp.life+')';x.beginPath();x.arc(sp.x,sp.y,2*sp.life,0,6.28);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
