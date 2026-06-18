import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'atm-constellation', title:'Constellation Network', cat:'Partículas',
  tags:['constellation','network','red','líneas','conexión','puntos','partículas'],
  desc:'Puntos que se conectan con líneas cuando están cerca, formando una red viva. El clásico particles.',
  meta:['Canvas 2D','proximity','Network'],
  prompt:`Crea el clásico "particles network/constellation": puntos que flotan y se conectan con líneas cuando la distancia entre ellos es menor que un umbral (la opacidad de la línea decae con la distancia). Opcional: conectarse también al cursor.
Mueve cada punto con velocidad constante (rebote en bordes); en cada frame, para cada par cercano, dibuja una línea con alpha proporcional a la cercanía.
Fondo tech ubicuo para heros de tecnología, redes, datos.`,
  code:`// Constellation network
points.forEach((a, i) => {
  points.slice(i+1).forEach(b => {
    const d = Math.hypot(a.x-b.x, a.y-b.y)
    if (d < 120) {
      ctx.globalAlpha = 1 - d/120
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke()
    }
  })
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const P=[];for(let i=0;i<32;i++)P.push({x:Math.random()*o.W(),y:Math.random()*o.H(),vx:(Math.random()-.5)*.8,vy:(Math.random()-.5)*.8});
    let mx=-999,my=-999,raf,run=true;
    el.onmousemove=e=>{const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>{mx=-999;my=-999;};
    (function loop(){if(!run)return;x.fillStyle='#0a0a16';x.fillRect(0,0,o.W(),o.H());
      P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>o.W())p.vx*=-1;if(p.y<0||p.y>o.H())p.vy*=-1;});
      for(let i=0;i<P.length;i++){for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<90){x.globalAlpha=(1-d/90)*.5;x.strokeStyle='#7b5cff';x.lineWidth=1;x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke();}}
        const dm=Math.hypot(P[i].x-mx,P[i].y-my);if(dm<110){x.globalAlpha=(1-dm/110)*.8;x.strokeStyle='#00e0c6';x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(mx,my);x.stroke();}}
      x.globalAlpha=1;P.forEach(p=>{x.fillStyle='#9d86ff';x.beginPath();x.arc(p.x,p.y,2,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
