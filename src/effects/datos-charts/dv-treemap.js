import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-treemap', title:'Treemap', cat:'Datos / Charts',
  tags:['treemap','jerarquia','hierarchy','rectangulos','squarify','area','datos','viz'],
  desc:'Treemap de rectángulos jerárquicos cuyas áreas son proporcionales al valor y crecen al entrar.',
  meta:['canvas','squarify','hierarchy'],
  prompt:`Crea un treemap: un rectángulo se subdivide recursivamente en sub-rectángulos cuyas áreas son proporcionales a los valores de los hijos. Usa un layout tipo "slice-and-dice" o "squarify": en cada nivel reparte el espacio alternando orientación (o eligiendo la que da aspect ratios más cuadrados).
Estructura: árbol {name,value,children}. Algoritmo recursivo recibe un rect [x,y,w,h] y la lista de hijos; ordena por valor desc y va cortando franjas.
Animación: al entrar, cada celda crece desde el centro de su rect (scale 0->1) o desde área 0, con stagger por índice/nivel. Repite en bucle con pausa. Etiqueta con nombre+valor si cabe. Color por rama; marca #7b5cff / #00e0c6, fondo oscuro.
Para tamaños de disco, capitalización de mercado, composición de carteras.`,
  code:`/* Treemap (D3) — esqueleto idiomático */
const root = d3.hierarchy(data).sum(d=>d.value)
  .sort((a,b)=>b.value-a.value);
d3.treemap().size([width,height]).paddingInner(3)(root);
const cell = svg.selectAll('g').data(root.leaves()).join('g')
  .attr('transform', d=>'translate('+d.x0+','+d.y0+')');
cell.append('rect')
  .attr('width',0).attr('height',0).attr('fill', d=>color(d.parent.data.name))
  .transition().delay((d,i)=>i*60).duration(700)
  .attr('width', d=>d.x1-d.x0).attr('height', d=>d.y1-d.y0);`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const groups=[
      {name:'Dev',c:'#7b5cff',items:[{n:'JS',v:8},{n:'TS',v:5},{n:'CSS',v:3}]},
      {name:'Data',c:'#00b8d4',items:[{n:'SQL',v:4},{n:'ETL',v:2}]},
      {name:'Ops',c:'#00e0c6',items:[{n:'CI',v:3},{n:'K8s',v:2.5},{n:'Log',v:1.5}]}
    ];
    // aplanar a celdas con squarify por nivel
    let raf,run=true,t=0,hold=0;
    // layout slice-and-dice: primero columnas por grupo (por valor), luego filas dentro
    function layout(W,H){
      const pad=4;const total=groups.reduce((s,g)=>s+g.items.reduce((a,i)=>a+i.v,0),0);
      const cells=[];let gx=pad;
      groups.forEach((g,gi)=>{
        const gv=g.items.reduce((a,i)=>a+i.v,0);
        const gw=(W-pad*(groups.length+1))*(gv/total);
        let iy=pad;const ih=H-pad*2;
        g.items.forEach((it,ii)=>{
          const hh=(ih-pad*(g.items.length-1))*(it.v/gv);
          cells.push({x:gx,y:iy,w:gw,h:hh,c:g.c,n:it.n,v:it.v,idx:cells.length});
          iy+=hh+pad;
        });
        gx+=gw+pad;
      });
      return cells;
    }
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=.02;if(t>=1.4){t=1.4;hold=55;}}
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const cells=layout(W,H);
      cells.forEach(cell=>{
        const ct=Math.max(0,Math.min(1,(t-cell.idx*.09)/.8));
        const e=ct<.5?4*ct*ct*ct:1-Math.pow(-2*ct+2,3)/2;
        if(e<=0)return;
        const cx=cell.x+cell.w/2,cy=cell.y+cell.h/2;
        const w=cell.w*e,h=cell.h*e;
        const rx=cx-w/2,ry=cy-h/2;
        x.fillStyle=cell.c;x.globalAlpha=.85;
        rr(x,rx,ry,w,h,3);x.fill();x.globalAlpha=1;
        if(e>.9&&w>30&&h>18){
          x.fillStyle='rgba(255,255,255,.95)';x.font='700 11px Inter';x.textAlign='left';x.textBaseline='top';
          x.fillText(cell.n,rx+5,ry+5);
          x.fillStyle='rgba(255,255,255,.6)';x.font='600 9px Inter';
          x.fillText(cell.v,rx+5,ry+17);
        }
      });
      raf=requestAnimationFrame(loop);})();
    function rr(c,X,Y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(X+r,Y);c.arcTo(X+w,Y,X+w,Y+h,r);c.arcTo(X+w,Y+h,X,Y+h,r);c.arcTo(X,Y+h,X,Y,r);c.arcTo(X,Y,X+w,Y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
