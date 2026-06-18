import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'part-fireflies', title:'Fireflies', cat:'Partículas',
  tags:['fireflies','luciérnagas','noche','glow','partículas','flotar','bokeh'],
  desc:'Luciérnagas que flotan y parpadean suavemente en la oscuridad. Fondo nocturno mágico.',
  meta:['Canvas 2D','wander','Noche'],
  prompt:`Crea luciérnagas en canvas 2D como fondo nocturno: puntos luminosos que vagan suavemente (movimiento browniano/perlin) y parpadean (opacidad pulsante con fase propia), con un halo de glow.
Cada luciérnaga deriva con pequeñas aceleraciones aleatorias y su brillo oscila con un seno de fase única; añade un glow radial. Fondo muy oscuro.
Para secciones oníricas, naturaleza, bienestar o heros mágicos.`,
  code:`// Fireflies — wander + glow pulsante
flies.forEach(f => {
  f.vx += (Math.random()-0.5)*0.1; f.vy += (Math.random()-0.5)*0.1
  f.vx *= 0.95; f.vy *= 0.95
  f.x += f.vx; f.y += f.vy
  const glow = 0.4 + 0.6 * Math.sin(time + f.phase)   // parpadeo
  drawGlow(f.x, f.y, glow)
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const F=[];for(let i=0;i<22;i++)F.push({x:Math.random()*o.W(),y:Math.random()*o.H(),vx:0,vy:0,ph:Math.random()*6.28});
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=.05;x.fillStyle='#06070f';x.fillRect(0,0,o.W(),o.H());x.globalCompositeOperation='lighter';
      F.forEach(f=>{f.vx+=(Math.random()-.5)*.15;f.vy+=(Math.random()-.5)*.15;f.vx*=.94;f.vy*=.94;f.x+=f.vx;f.y+=f.vy;if(f.x<0)f.x=o.W();if(f.x>o.W())f.x=0;if(f.y<0)f.y=o.H();if(f.y>o.H())f.y=0;const glow=.3+.7*Math.max(0,Math.sin(t+f.ph));const g=x.createRadialGradient(f.x,f.y,0,f.x,f.y,10);g.addColorStop(0,'rgba(200,255,150,'+glow+')');g.addColorStop(1,'rgba(200,255,150,0)');x.fillStyle=g;x.beginPath();x.arc(f.x,f.y,10,0,6.28);x.fill();x.fillStyle='rgba(230,255,180,'+glow+')';x.beginPath();x.arc(f.x,f.y,1.5,0,6.28);x.fill();});x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
