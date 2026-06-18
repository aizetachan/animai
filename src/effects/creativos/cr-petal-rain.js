import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-petal-rain', title:'Petal Rain', cat:'Creativos',
  tags:['pétalos','petals','sakura','漫天花雨','cerezo','caída','oscilación'],
  desc:'Lluvia de pétalos de sakura que caen oscilando y girando sobre su eje, con deriva horizontal.',
  meta:['canvas','sakura','漫天花雨'],
  prompt:`Crea una lluvia de pétalos de cerezo (漫天花雨) en canvas 2D.
Estructura de datos: cada pétalo tiene posición (x,y), velocidad de caída, fase de oscilación, ángulo de giro y velocidad angular, tamaño y un factor de "spin" para el cabeceo 3D.
Algoritmo de animación por frame: y += vy; x += sin(fase)*amplitud (deriva lateral suave); fase += df; ángulo += va. El cabeceo 3D se simula escalando el ancho del pétalo con un cos(spin) que va de positivo a negativo (el pétalo parece girar mostrando anverso/reverso). Al salir por abajo reaparece arriba con x aleatoria.
Dibujo del pétalo: una forma de pétalo con dos curvas cuadráticas (quadraticCurveTo) y un degradado rosa→rosa pálido. Rota con ctx.rotate y escala el eje X según el cabeceo.
Timings: caída continua; densidad ~30-40 pétalos. Fondo oscuro.`,
  code:`// 漫天花雨 Petal rain (canvas 2D)
function drawPetal(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.ang);
  ctx.scale(Math.cos(p.spin) * 0.6 + 0.4, 1); // cabeceo 3D
  const s = p.size;
  const g = ctx.createLinearGradient(0, -s, 0, s);
  g.addColorStop(0, '#ffd3e6'); g.addColorStop(1, '#ff9ec4');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.8, 0, 0, s);
  ctx.quadraticCurveTo(-s * 0.8, 0, 0, -s);
  ctx.fill();
  ctx.restore();
}
// loop: p.y += p.vy; p.x += sin(p.phase)*p.amp; p.phase += p.df; p.ang += p.va; p.spin += p.vs;`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const P=[];
    function spawn(reset){
      const W=o.W(),H=o.H();
      return {x:Math.random()*W,y:reset?-10:Math.random()*H,
        vy:.4+Math.random()*.9,size:4+Math.random()*4,
        phase:Math.random()*6.28,df:.02+Math.random()*.03,amp:.4+Math.random()*.8,
        ang:Math.random()*6.28,va:(Math.random()-.5)*.05,
        spin:Math.random()*6.28,vs:.02+Math.random()*.04,
        hue:Math.random()};
    }
    for(let i=0;i<34;i++)P.push(spawn(false));
    let raf,run=true;
    function loop(){
      if(!run)return;
      const W=o.W(),H=o.H();
      x.fillStyle='#171019';x.fillRect(0,0,W,H);
      P.forEach(p=>{
        p.y+=p.vy;p.x+=Math.sin(p.phase)*p.amp;p.phase+=p.df;p.ang+=p.va;p.spin+=p.vs;
        if(p.y>H+12){const np=spawn(true);Object.assign(p,np);}
        if(p.x<-12)p.x=W+12;if(p.x>W+12)p.x=-12;
        x.save();
        x.translate(p.x,p.y);
        x.rotate(p.ang);
        x.scale(Math.cos(p.spin)*0.6+0.4,1);
        const s=p.size;
        const g=x.createLinearGradient(0,-s,0,s);
        g.addColorStop(0,p.hue>.5?'#ffd9ea':'#ffe0c4');
        g.addColorStop(1,p.hue>.5?'#ff9ec4':'#ffb3c9');
        x.fillStyle=g;x.globalAlpha=.9;
        x.beginPath();
        x.moveTo(0,-s);
        x.quadraticCurveTo(s*.8,0,0,s);
        x.quadraticCurveTo(-s*.8,0,0,-s);
        x.fill();
        x.restore();
      });
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
