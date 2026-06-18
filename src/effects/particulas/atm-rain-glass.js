import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'atm-rain-glass', title:'Rain on Glass', cat:'Partículas',
  tags:['rain','lluvia','cristal','gotas','resbalar','distorsión','ventana'],
  desc:'Gotas de lluvia que resbalan por un cristal dejando rastro. Ventana en día lluvioso.',
  meta:['Canvas 2D','drip','Atmósfera'],
  prompt:`Crea "lluvia sobre cristal": gotas que aparecen y resbalan hacia abajo por la pantalla dejando un rastro de gotitas, acelerando al crecer, sobre un fondo difuminado (como ver a través de una ventana mojada).
Cada gota tiene tamaño y velocidad (mayor = más rápida); deja pequeñas gotas residuales en su camino; se reinicia al salir. Fondo con un leve blur/gradiente.
Para atmósferas melancólicas, lo-fi, secciones de clima o mood.`,
  code:`// Rain on glass — gotas que resbalan dejando rastro
drops.forEach(d => {
  d.vy += d.r * 0.01            // las grandes caen más rápido
  d.y += d.vy
  if (Math.random() < 0.1) residuals.push({ x: d.x, y: d.y, r: d.r*0.3 })
  if (d.y > H) reset(d)
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const D=[],res=[];function mk(){return{x:Math.random()*o.W(),y:-10,r:2+Math.random()*5,vy:0};}for(let i=0;i<18;i++){const d=mk();d.y=Math.random()*o.H();D.push(d);}
    let raf,run=true;
    (function loop(){if(!run)return;const g=x.createLinearGradient(0,0,o.W(),o.H());g.addColorStop(0,'#0e1622');g.addColorStop(1,'#162230');x.fillStyle=g;x.fillRect(0,0,o.W(),o.H());
      for(let i=res.length-1;i>=0;i--){res[i].life=(res[i].life||1)-.008;if(res[i].life<=0){res.splice(i,1);continue;}x.fillStyle='rgba(150,200,230,'+res[i].life*.4+')';x.beginPath();x.arc(res[i].x,res[i].y,res[i].r,0,6.28);x.fill();}
      D.forEach(d=>{d.vy+=d.r*.006;d.y+=d.vy;if(Math.random()<.15)res.push({x:d.x+(Math.random()-.5)*2,y:d.y,r:d.r*.3,life:1});if(d.y>o.H()+10){Object.assign(d,mk());}const gr=x.createRadialGradient(d.x-d.r*.3,d.y-d.r*.3,0,d.x,d.y,d.r);gr.addColorStop(0,'rgba(200,230,250,.9)');gr.addColorStop(1,'rgba(120,170,200,.5)');x.fillStyle=gr;x.beginPath();x.arc(d.x,d.y,d.r,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
