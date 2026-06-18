import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'part-snow', title:'Snowfall', cat:'Partículas',
  tags:['nieve','snow','invierno','partículas','fondo','copos'],
  desc:'Copos de nieve cayendo con deriva suave. Fondo estacional sutil y relajante.',
  meta:['Canvas 2D','Drift','Estacional'],
  prompt:`Crea una nevada suave en canvas 2D como capa de fondo (pointer-events:none).
Copos con tamaño/velocidad variables que caen y derivan horizontalmente con una onda seno; al salir por abajo reaparecen arriba. Tamaño afecta a velocidad y opacidad (profundidad).
Mantén la densidad baja para que sea sutil. Bonus: parallax con el scroll.`,
  code:`// Snowfall (canvas 2D)
flakes.forEach(f => {
  f.y += f.speed
  f.x += Math.sin(f.y * 0.01 + f.seed) * 0.5
  if (f.y > H) { f.y = -5; f.x = Math.random() * W }
  ctx.globalAlpha = f.size / 4
  ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, 6.28); ctx.fill()
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const F=[];for(let i=0;i<90;i++)F.push({x:Math.random()*o.W(),y:Math.random()*o.H(),size:1+Math.random()*3,speed:.3+Math.random()*1.2,seed:Math.random()*6.28});
    let raf,run=true;
    (function loop(){if(!run)return;x.fillStyle='#0a0a16';x.fillRect(0,0,o.W(),o.H());x.fillStyle='#fff';
      F.forEach(f=>{f.y+=f.speed;f.x+=Math.sin(f.y*.01+f.seed)*.5;if(f.y>o.H()){f.y=-5;f.x=Math.random()*o.W();}x.globalAlpha=f.size/4;x.beginPath();x.arc(f.x,f.y,f.size,0,6.28);x.fill();});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
