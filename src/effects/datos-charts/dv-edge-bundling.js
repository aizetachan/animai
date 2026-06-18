import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-edge-bundling', title:'Edge Bundling', cat:'Datos / Charts',
  tags:['edge bundling','agrupado','radial','jerarquía','hierarchy','grafo','边捆绑'],
  desc:'Nodos hoja en un anillo radial conectados por aristas agrupadas que se curvan hacia el centro jerárquico.',
  meta:['canvas','radial','bezier','Viz'],
  prompt:`Crea un "hierarchical edge bundling" (agrupamiento jerárquico de aristas) en disposición radial.
Estructura de datos: hojas distribuidas en un círculo (anillo exterior), cada una con un padre en un anillo intermedio (clusters). links = pares de hojas.
Layout: las hojas se reparten equiangularmente en el radio exterior R. Cada hoja pertenece a un cluster; el punto del cluster está en un radio menor sobre el ángulo medio del cluster.
Bundling: una arista entre hoja A y hoja B no va recta; se traza como curva que pasa por los puntos de control de los clusters/centro (path: A -> clusterA -> centro -> clusterB -> B), produciendo el "agrupamiento" visual hacia el interior. Usa curva suave (Catmull-Rom o Bézier por tramos).
Animación: las hojas aparecen en el anillo, luego cada haz de aristas se dibuja progresivamente (trazo creciente a lo largo del path) con stagger. Color degradado origen->destino. Bucle con pausa.
Usos: dependencias de software, redes sociales por comunidades, matrices de adyacencia radiales.`,
  code:`// Hierarchical edge bundling (Canvas 2D, radial)
// hojas en anillo R; cada arista pasa por puntos de control internos -> se agrupan
function leafPos(i){ const a = i/leaves.length*2*Math.PI - Math.PI/2;
  return { a, x: cx+Math.cos(a)*R, y: cy+Math.sin(a)*R }; }
function ctrl(a, r){ return { x: cx+Math.cos(a)*r, y: cy+Math.sin(a)*r }; }
links.forEach(lk=>{
  const A = leafPos(lk[0]), B = leafPos(lk[1]);
  const cA = ctrl(A.a, rCluster), cB = ctrl(B.a, rCluster);
  const pts = [ [A.x,A.y], [cA.x,cA.y], [cx,cy], [cB.x,cB.y], [B.x,B.y] ];
  // dibuja la curva suave a lo largo de pts hasta el progreso (trazo creciente)
  drawSpline(pts, progress);
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=18; // leaves
    const CL=4;  // clusters
    // links between leaf indices
    const links=[[0,9],[1,12],[2,7],[3,15],[4,11],[5,16],[6,13],[8,17],[10,1],[14,3],[0,6],[9,12],[7,16],[2,15]];
    const cols=['#7b5cff','#00e0c6','#ff5ca8','#ffb454'];
    let t=0,raf,run=true;
    const stagger=0.06;
    // Catmull-Rom -> point at param along polyline of control pts
    function spline(pts,u){
      // u in 0..1 over whole curve; sample many segments, return path up to u
      const seg=40; const out=[];
      const P=[pts[0],...pts,pts[pts.length-1]];
      const last=Math.floor(u*(pts.length-1)*seg);
      let count=0;
      for(let i=0;i<pts.length-1;i++){
        const p0=P[i],p1=P[i+1],p2=P[i+2],p3=P[i+3];
        for(let s=0;s<seg;s++){
          if(count>last)break;
          const tt=s/seg;const t2=tt*tt,t3=t2*tt;
          const px=0.5*((2*p1[0])+(-p0[0]+p2[0])*tt+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3);
          const py=0.5*((2*p1[1])+(-p0[1]+p2[1])*tt+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3);
          out.push([px,py]);count++;
        }
        if(count>last)break;
      }
      return out;
    }
    (function loop(){if(!run)return;
      t+=.008;const cycle=1+links.length*stagger+0.7;if(t>=cycle)t=0;
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.40,rCl=R*0.55;
      const leafPos=i=>{const a=i/N*6.283-1.5708;return{a,x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R};};
      const clusterAng=i=>{const cl=Math.floor(i/(N/CL));return (cl+0.5)/CL*6.283-1.5708;};
      // edges
      links.forEach((lk,k)=>{
        const A=leafPos(lk[0]),B=leafPos(lk[1]);
        const aCl=clusterAng(lk[0]),bCl=clusterAng(lk[1]);
        const cA=[cx+Math.cos(aCl)*rCl,cy+Math.sin(aCl)*rCl];
        const cB=[cx+Math.cos(bCl)*rCl,cy+Math.sin(bCl)*rCl];
        const pts=[[A.x,A.y],cA,[cx,cy],cB,[B.x,B.y]];
        let p=(t-k*stagger);p=Math.max(0,Math.min(1,p));
        const e=1-Math.pow(1-p,3);
        if(e<=0)return;
        const pl=spline(pts,e);
        if(pl.length<2)return;
        const g=x.createLinearGradient(A.x,A.y,B.x,B.y);
        g.addColorStop(0,cols[Math.floor(lk[0]/(N/CL))%CL]);
        g.addColorStop(1,cols[Math.floor(lk[1]/(N/CL))%CL]);
        x.strokeStyle=g;x.globalAlpha=0.55;x.lineWidth=1.4;
        x.beginPath();x.moveTo(pl[0][0],pl[0][1]);
        for(let i=1;i<pl.length;i++)x.lineTo(pl[i][0],pl[i][1]);
        x.stroke();x.globalAlpha=1;
      });
      // leaf nodes
      const nodeP=Math.min(1,t/0.4);const ne=1-Math.pow(1-nodeP,3);
      for(let i=0;i<N;i++){
        const L=leafPos(i);const cl=Math.floor(i/(N/CL))%CL;
        x.beginPath();x.arc(L.x,L.y,2.6*ne,0,6.283);
        x.fillStyle=cols[cl];x.fill();
      }
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
