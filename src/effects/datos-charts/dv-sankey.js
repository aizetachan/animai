import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-sankey', title:'Sankey Diagram', cat:'Datos / Charts',
  tags:['sankey','flujo','flow','enlaces','links','nodos','datos','viz'],
  desc:'Diagrama de flujo Sankey con nodos en columnas y enlaces curvos que se rellenan progresivamente.',
  meta:['canvas','bezier','flow'],
  prompt:`Crea un diagrama Sankey: nodos organizados en columnas (etapas) y enlaces que conectan nodos de columnas contiguas con cintas curvas cuyo grosor es proporcional al valor del flujo.
Estructura: nodes=[{col,name,value}], links=[{src,dst,value}]. Layout: para cada columna acumula la altura de sus nodos (proporcional al valor) con un gap; cada enlace sale de un offset vertical en el nodo origen y entra en un offset del nodo destino. La cinta se dibuja con dos curvas de Bézier cúbicas (borde superior e inferior) usando puntos de control a media distancia horizontal.
Animación: un progreso 0->1 (easing) revela las cintas recortando el ancho (clip) o interpolando el punto final en X; los nodos crecen en altura. Repite en bucle con una pausa. Gradiente #7b5cff -> #00e0c6.
Para visualizar conversiones, presupuestos, energía o tráfico entre etapas.`,
  code:`/* Sankey (D3) — esqueleto idiomático */
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
const { nodes, links } = sankey()
  .nodeWidth(14).nodePadding(12)
  .extent([[0,0],[width,height]])({
    nodes: data.nodes.map(d=>({...d})),
    links: data.links.map(d=>({...d}))
  });
svg.append('g').selectAll('path').data(links).join('path')
  .attr('d', sankeyLinkHorizontal())
  .attr('stroke-width', d=>Math.max(1,d.width))
  .attr('stroke','url(#grad)').attr('fill','none')
  .attr('stroke-dasharray', function(){const l=this.getTotalLength();return l+' '+l;})
  .attr('stroke-dashoffset', function(){return this.getTotalLength();})
  .transition().duration(900).attr('stroke-dashoffset',0);`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    // columnas de nodos: [col][{v}]
    const cols=[
      [{v:5,c:'#7b5cff'},{v:3,c:'#9d7bff'}],
      [{v:4,c:'#6a8cff'},{v:2.5,c:'#00b8d4'},{v:1.5,c:'#5ec8c0'}],
      [{v:3,c:'#00e0c6'},{v:2,c:'#3ee0b0'}]
    ];
    // enlaces entre col0->col1 y col1->col2 (src idx, dst idx, value)
    const links=[
      {a:[0,0],b:[1,0],v:3},{a:[0,0],b:[1,1],v:2},
      {a:[0,1],b:[1,1],v:0.5},{a:[0,1],b:[1,2],v:1.5},
      {a:[1,0],b:[2,0],v:2.5},{a:[1,0],b:[2,1],v:1.5},
      {a:[1,1],b:[2,0],v:0.5},{a:[1,2],b:[2,1],v:0.5}
    ];
    let t=0,raf,run=true,hold=0;
    function layout(){
      const W=o.W(),H=o.H(),padX=22,padY=14,nw=8;
      const colX=cols.map((_,i)=>padX+i*((W-padX*2-nw)/(cols.length-1)));
      const geo=cols.map((col,ci)=>{
        const total=col.reduce((s,n)=>s+n.v,0);
        const gap=8,avail=H-padY*2-gap*(col.length-1);
        let y=padY;const arr=[];
        col.forEach(n=>{const h=n.v/total*avail*(total/5);const hh=Math.max(10,h);arr.push({x:colX[ci],y,h:hh,c:n.c,topUsed:0,botUsed:0});y+=hh+gap;});
        // centrar verticalmente
        const used=y-gap-padY,off=(H-padY*2-used)/2;
        arr.forEach(a=>a.y+=off);
        return arr;
      });
      return {geo,nw,W,H};
    }
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=.018;if(t>=1){t=1;hold=50;}}
      const e=1-Math.pow(1-t,3);
      const {geo,nw,W,H}=layout();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      // reset usos
      geo.forEach(col=>col.forEach(n=>{n.topUsed=0;n.botUsed=0;}));
      // dibujar enlaces como cintas
      links.forEach(lk=>{
        const s=geo[lk.a[0]][lk.a[1]],d=geo[lk.b[0]][lk.b[1]];
        const sTot=cols[lk.a[0]][lk.a[1]].v,dTot=cols[lk.b[0]][lk.b[1]].v;
        const sw=lk.v/sTot*s.h,dw=lk.v/dTot*d.h;
        const sy0=s.y+s.botUsed;s.botUsed+=sw;
        const dy0=d.y+d.topUsed;d.topUsed+=dw;
        const x0=s.x+nw,x1=d.x;
        const xEnd=x0+(x1-x0)*e;
        const cx0=x0+(xEnd-x0)*.5,cx1=x1-(x1-x0)*.5;
        const g=x.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#7b5cff');g.addColorStop(1,'#00e0c6');
        x.fillStyle=g;x.globalAlpha=.42;
        const ey0=sy0+(dy0-sy0)*e,eyw=sw+(dw-sw)*e;
        x.beginPath();
        x.moveTo(x0,sy0);
        x.bezierCurveTo(cx0,sy0,cx1,ey0,xEnd,ey0);
        x.lineTo(xEnd,ey0+eyw);
        x.bezierCurveTo(cx1,ey0+eyw,cx0,sy0+sw,x0,sy0+sw);
        x.closePath();x.fill();
        x.globalAlpha=1;
      });
      // dibujar nodos
      geo.forEach(col=>col.forEach(n=>{
        x.fillStyle=n.c;
        const h=n.h*e;
        const yy=n.y+(n.h-h)/2;
        x.beginPath();x.rect(n.x,yy,nw,h);x.fill();
      }));
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
