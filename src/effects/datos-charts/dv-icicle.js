import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-icicle', title:'Icicle Chart', cat:'Datos / Charts',
  tags:['icicle','jerarquía','hierarchy','partition','bloques','tree','viz'],
  desc:'Jerarquía dibujada como bloques apilados horizontalmente (icicle) que se expanden desde la raíz por niveles.',
  meta:['canvas','partition','Viz'],
  prompt:`Crea un Icicle Chart: representa una jerarquía (árbol con valores) como bloques rectangulares apilados por niveles/columnas (partition layout).
Estructura de datos: nodos {name, value?, children:[]}. Calcula el valor de cada nodo como la suma de sus hojas. Para cada nivel (profundidad) asigna una columna de ancho fijo; dentro de la columna reparte la altura proporcional al valor de cada nodo respecto a su padre.
Algoritmo de layout: recorre el árbol en preorden acumulando offset vertical por padre; cada nodo ocupa [x = depth*colW, y = offset, w = colW, h = (value/parentValue)*parentH].
Animación de entrada: anima la apertura nivel por nivel (stagger por profundidad), cada bloque crece su ancho desde 0 con easing; etiquetas aparecen al final. Repite en bucle.
Para dashboards de composición, tamaños de archivos, taxonomías.`,
  code:`// Icicle (partition) con D3
const root = d3.hierarchy(data).sum(d => d.value);
d3.partition().size([height, width])(root);
svg.selectAll('rect').data(root.descendants()).join('rect')
  .attr('x', d => d.y0).attr('y', d => d.x0)
  .attr('height', d => d.x1 - d.x0)
  .attr('width', 0)
  .transition().delay(d => d.depth * 200).duration(600)
  .attr('width', d => d.y1 - d.y0);`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const data={name:'root',children:[
      {name:'A',children:[{name:'a1',value:8},{name:'a2',value:5}]},
      {name:'B',children:[{name:'b1',value:6},{name:'b2',value:3},{name:'b3',value:4}]},
      {name:'C',children:[{name:'c1',value:7}]}
    ]};
    // calcular valores
    function sum(n){return n.children?n.children.reduce((s,c)=>s+sum(c),0):(n.value||0);}
    const total=sum(data);
    let t=0,raf,run=true,hold=0;
    const COLS=3;
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=.018;if(t>=2.2){t=0;hold=50;}}
      const W=o.W(),H=o.H(),padX=8,padY=10;
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const colW=(W-padX*2)/COLS, areaH=H-padY*2;
      const palette=['#7b5cff','#00e0c6','#9d7bff'];
      // recorrer niveles: depth0 root(col0), depth1 hijos(col1), depth2 hojas(col2)
      function drawNode(node,depth,y0,h,parentVal,idx){
        const open=Math.max(0,Math.min(1,(t-depth*.5)/.6));
        const e=1-Math.pow(1-open,3);
        const w=(colW-3)*e;
        const xx=padX+depth*colW;
        if(w>0.5){
          x.fillStyle=palette[depth%palette.length];
          x.globalAlpha=.85;
          roundRect(x,xx,y0,w,Math.max(1,h-2),3);x.fill();
          x.globalAlpha=1;
          if(e>.85&&h>14){
            x.fillStyle='#0a0a14';x.font='600 9px system-ui';x.textBaseline='middle';
            const lbl=node.name; x.fillText(lbl,xx+5,y0+h/2);
          }
        }
        if(node.children){
          let off=y0;
          node.children.forEach((c,i)=>{
            const cv=sum(c); const ch=(cv/parentVal)*h;
            drawNode(c,depth+1,off,ch,cv,i);
            off+=ch;
          });
        }
      }
      drawNode(data,0,padY,areaH,total,0);
      raf=requestAnimationFrame(loop);
    })();
    function roundRect(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
