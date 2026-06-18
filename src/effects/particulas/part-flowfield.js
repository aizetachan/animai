import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'part-flowfield', title:'Flow Field', cat:'Partículas',
  tags:['flow field','campo','flujo','partículas','perlin','trazos','generativo'],
  desc:'Miles de partículas siguen un campo de flujo dibujando trazos generativos. Arte de flujo.',
  meta:['Canvas 2D','flow field','Generativo'],
  prompt:`Crea un "flow field" generativo: muchas partículas que se mueven siguiendo un campo de ángulos (derivado de ruido), dejando trazos finos que componen un dibujo orgánico de líneas.
Para cada partícula, lee el ángulo del campo en su posición y avanza; no limpies el canvas (o muy poco) para que se acumulen los trazos. Reinicia partículas que salen.
Fondo generativo artístico, distinto del Vortex (aquí lo bonito son los trazos acumulados).`,
  code:`// Flow field — partículas siguen ángulos de ruido y dejan trazo
particles.forEach(p => {
  const angle = noise(p.x*0.003, p.y*0.003) * Math.PI * 2
  p.x += Math.cos(angle); p.y += Math.sin(angle)
  ctx.lineTo(p.x, p.y)   // acumula trazo (no limpiar el canvas)
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const P=[];for(let i=0;i<140;i++)P.push({x:Math.random()*o.W(),y:Math.random()*o.H(),px:0,py:0,life:Math.random()*100});
    function noise(a,b){return (Math.sin(a*1.3+b*2.1)+Math.cos(a*2.7-b*1.5))*.5;}
    let t=0,raf,run=true;x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
    (function loop(){if(!run)return;t+=.003;x.fillStyle='rgba(10,10,20,.04)';x.fillRect(0,0,o.W(),o.H());
      P.forEach(p=>{p.px=p.x;p.py=p.y;const ang=noise(p.x*.004,p.y*.004+t)*6.283;p.x+=Math.cos(ang)*1.6;p.y+=Math.sin(ang)*1.6;p.life--;if(p.life<0||p.x<0||p.x>o.W()||p.y<0||p.y>o.H()){p.x=Math.random()*o.W();p.y=Math.random()*o.H();p.px=p.x;p.py=p.y;p.life=80+Math.random()*60;}x.strokeStyle='hsla('+(250+Math.sin(t*2)*40)+',70%,65%,.5)';x.lineWidth=1;x.beginPath();x.moveTo(p.px,p.py);x.lineTo(p.x,p.y);x.stroke();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
