import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'connect-dots', title:'Connected Nodes', cat:'Partículas',
  tags:['nodos','red','líneas','network','conexiones','ia','fintech'],
  desc:'Puntos que se conectan con líneas al acercarse. El efecto "red neuronal" de fintech / IA.',
  meta:['Canvas 2D','Ligero','Responsive'],
  prompt:`En canvas 2D crea una red de nodos: ~60 puntos con velocidad aleatoria que rebotan en los bordes.
Dibuja una línea entre dos nodos cuando su distancia < umbral, con opacidad inversa a la distancia.
Opcional: el ratón como nodo extra. Cuida rendimiento: O(n2) con n<=80, no más.`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=52,pp=[];for(let i=0;i<N;i++)pp.push({x:Math.random()*o.W(),y:Math.random()*o.H(),vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6});
    let raf,run=true;
    (function loop(){if(!run)return;x.clearRect(0,0,o.W(),o.H());
      for(const p of pp){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>o.W())p.vx*=-1;if(p.y<0||p.y>o.H())p.vy*=-1;}
      for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=pp[i],b=pp[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<110){x.strokeStyle='rgba(123,92,255,'+(1-d/110)*.5+')';x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}
      for(const p of pp){x.fillStyle='#00e0c6';x.beginPath();x.arc(p.x,p.y,2,0,6.28);x.fill();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
