import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-beeswarm', title:'Beeswarm', cat:'Datos / Charts',
  tags:['beeswarm','enjambre','distribucion','dotplot','colision','jitter','puntos'],
  desc:'Puntos posicionados por su valor en X que se reacomodan sin solaparse y se asientan en un enjambre.',
  meta:['canvas','collide','Viz'],
  prompt:`Crea un beeswarm plot: cada dato tiene un valor que define su posición objetivo en el eje X. Los puntos arrancan dispersos y son atraídos a su X objetivo (fuerza hacia targetX) mientras se aplica detección de colisiones para que no se solapen: si dos discos se solapan, sepáralos a lo largo del vector que los une.
En cada frame: 1) fuerza de atracción al targetX, 2) ligera fuerza hacia la línea central en Y, 3) resolución de colisiones por pares (empuje proporcional al solape), 4) amortiguación. El sistema se asienta formando columnas verticales (el enjambre). Reinicia en bucle.
Ideal para distribuciones (una variable continua), comparativas tipo dotplot.`,
  code:`// Beeswarm: atracción a targetX + resolución de colisiones
nodes.forEach(n=>{ n.vx+=(n.tx-n.x)*0.05; n.vy+=(cy-n.y)*0.02; });
for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
  const a=nodes[i],b=nodes[j];let dx=b.x-a.x,dy=b.y-a.y;
  let d=Math.hypot(dx,dy)||0.01;const min=a.r+b.r;
  if(d<min){const push=(min-d)/d*0.5;a.x-=dx*push;a.y-=dy*push;b.x+=dx*push;b.y+=dy*push;}
}
nodes.forEach(n=>{ n.x+=n.vx*=0.8; n.y+=n.vy*=0.8; });`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const cols=['#7b5cff','#00e0c6','#ff5ca8'];
    let nodes=[],raf,run=true,frame=0;
    function seed(){
      const W=o.W(),H=o.H(),cy=H/2;nodes=[];
      for(let i=0;i<60;i++){
        // distribución sesgada hacia el centro
        const u=(Math.random()+Math.random()+Math.random())/3;
        const tx=20+u*(W-40);
        nodes.push({x:Math.random()*W,y:cy+(Math.random()-0.5)*20,vx:0,vy:0,tx,r:3+Math.random()*2,c:cols[i%3]});
      }
    }
    seed();
    (function loop(){if(!run)return;
      const W=o.W(),H=o.H(),cy=H/2;frame++;
      if(frame>320){frame=0;seed();}
      nodes.forEach(n=>{n.vx+=(n.tx-n.x)*0.05;n.vy+=(cy-n.y)*0.02;});
      for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j];let dx=b.x-a.x,dy=b.y-a.y;
        let d=Math.hypot(dx,dy)||0.01;const min=a.r+b.r+1.5;
        if(d<min){const push=(min-d)/d*0.5;dx*=push;dy*=push;a.x-=dx;a.y-=dy;b.x+=dx;b.y+=dy;}
      }
      nodes.forEach(n=>{n.vx*=0.78;n.vy*=0.78;n.x+=n.vx;n.y+=n.vy;n.x=Math.max(n.r,Math.min(W-n.r,n.x));n.y=Math.max(n.r,Math.min(H-n.r,n.y));});
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=1;x.beginPath();x.moveTo(10,cy);x.lineTo(W-10,cy);x.stroke();
      nodes.forEach(n=>{x.fillStyle=n.c;x.globalAlpha=0.88;x.beginPath();x.arc(n.x,n.y,n.r,0,6.2832);x.fill();});
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
