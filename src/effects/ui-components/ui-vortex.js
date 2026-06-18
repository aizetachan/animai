import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-vortex', title:'Vortex Background', cat:'UI Components',
  tags:['vortex','remolino','partículas','flow','aceternity','noise','fondo'],
  desc:'Remolino de partículas siguiendo un campo de flujo. El Vortex de Aceternity, hipnótico de fondo.',
  meta:['Aceternity UI','flow field','Partículas'],
  prompt:`Recrea el Vortex de Aceternity: cientos de partículas que se mueven siguiendo un campo de flujo (simplex/curl noise) creando un remolino orgánico.
Cada partícula avanza en la dirección del noise en su posición; con color por velocidad y trail por baja opacidad de limpieza.
Fondo oscuro, partículas de marca. Hipnótico para heros.`,
  code:`// Aceternity UI — Vortex (canvas + simplex-noise)
// Cada partícula sigue el ángulo del noise field en su posición
const angle = noise3D(x * 0.0015, y * 0.0015, t * 0.0003) * Math.PI * 2
vx += Math.cos(angle) * 0.5
vy += Math.sin(angle) * 0.5
x += vx; y += vy; vx *= 0.94; vy *= 0.94`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const P=[];for(let i=0;i<260;i++)P.push({x:Math.random()*o.W(),y:Math.random()*o.H(),vx:0,vy:0});
    function noise(a,b){return Math.sin(a*1.7+b*2.3)+Math.cos(a*2.9-b*1.3);}
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=1;x.fillStyle='rgba(8,8,15,.12)';x.fillRect(0,0,o.W(),o.H());
      P.forEach(p=>{const ang=noise(p.x*.006,p.y*.006+t*.01)*3.14;p.vx+=Math.cos(ang)*.5;p.vy+=Math.sin(ang)*.5;p.vx*=.92;p.vy*=.92;p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=o.W();if(p.x>o.W())p.x=0;if(p.y<0)p.y=o.H();if(p.y>o.H())p.y=0;const sp=Math.hypot(p.vx,p.vy);x.fillStyle='hsla('+(200+sp*30)+',90%,65%,.8)';x.beginPath();x.arc(p.x,p.y,1.3,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
