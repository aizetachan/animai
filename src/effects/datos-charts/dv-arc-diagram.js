import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-arc-diagram', title:'Arc Diagram', cat:'Datos / Charts',
  tags:['arc','arco','nodos','enlaces','grafo','network','弧线图'],
  desc:'Nodos alineados en una fila conectados por arcos semicirculares que se trazan progresivamente.',
  meta:['canvas','arc','draw','Viz'],
  prompt:`Crea un "arc diagram" (diagrama de arcos) animado: una secuencia de nodos sobre una línea horizontal y enlaces dibujados como semicírculos por encima.
Estructura de datos: nodes = posiciones equiespaciadas en X (baseline Y fija). links = [ {source, target} ] con índices de nodo.
Layout: cada enlace es un semicírculo cuyo diámetro va del nodo source al target sobre la baseline; radio = |xTarget - xSource| / 2, centro en el punto medio. Arcos por encima de la línea (de 0 a π).
Animación: 1) aparecen los nodos (escala desde 0), 2) cada arco se traza de extremo a extremo escalonado (stagger por índice) avanzando el ángulo final del arco. Color por longitud del salto. Bucle con pausa.
Usos: dependencias en secuencias, conexiones lineales, estructura de texto/código, redes ordenadas.`,
  code:`// Arc diagram (Canvas 2D) — arcos semicirculares sobre una baseline
const xs = nodes.map((_,i)=> margin + i*(W-2*margin)/(nodes.length-1));
const baseY = H*0.72;
links.forEach((lk,k)=>{
  const x1 = xs[lk.source], x2 = xs[lk.target];
  const r = Math.abs(x2-x1)/2, mx = (x1+x2)/2;
  const p = ease(progress - k*stagger);     // 0->1 por arco, escalonado
  ctx.beginPath();
  // semicírculo superior: PI..2PI ; recortado por el progreso p
  ctx.arc(mx, baseY, r, Math.PI, Math.PI + Math.PI*p);
  ctx.stroke();
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=8;
    // links by node indices
    const links=[[0,3],[1,5],[2,4],[0,7],[3,6],[4,7],[1,2],[5,7]];
    let t=0,raf,run=true;
    const stagger=0.12;
    (function loop(){if(!run)return;
      t+=.01;const cycle=1+(links.length*stagger)+0.6;if(t>=cycle)t=0;
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const margin=W*0.12, baseY=H*0.70;
      const xs=[];for(let i=0;i<N;i++)xs.push(margin+i*(W-2*margin)/(N-1));
      // baseline
      x.strokeStyle='#1e1e2e';x.lineWidth=1;x.beginPath();x.moveTo(margin,baseY);x.lineTo(W-margin,baseY);x.stroke();
      // arcs
      links.forEach((lk,k)=>{
        const x1=xs[lk[0]],x2=xs[lk[1]];
        const r=Math.abs(x2-x1)/2,mx=(x1+x2)/2;
        let p=(t-k*stagger);p=Math.max(0,Math.min(1,p));
        const e=1-Math.pow(1-p,3);
        if(e<=0)return;
        const span=Math.abs(lk[1]-lk[0]);
        const mix=Math.min(1,span/N*1.6);
        const col=mix<0.5
          ? '#7b5cff'
          : '#00e0c6';
        x.strokeStyle=col;x.globalAlpha=0.35+0.5*e;x.lineWidth=2;
        x.beginPath();
        x.arc(mx,baseY,r,Math.PI,Math.PI+Math.PI*e);
        x.stroke();
        x.globalAlpha=1;
      });
      // nodes
      const nodeP=Math.min(1,t/0.4);const ne=1-Math.pow(1-nodeP,3);
      xs.forEach((nx,i)=>{
        const rr=3.5*ne;
        x.beginPath();x.arc(nx,baseY,rr,0,6.283);
        x.fillStyle=i%2?'#00e0c6':'#7b5cff';x.fill();
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
