import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-sunburst', title:'Sunburst', cat:'Datos / Charts',
  tags:['sunburst','jerarquia','hierarchy','radial','anillos','arcos','datos','viz'],
  desc:'Jerarquía radial multinivel (sunburst) con barrido angular de entrada anillo a anillo.',
  meta:['canvas','arc','hierarchy'],
  prompt:`Crea un sunburst: una jerarquía dibujada como anillos concéntricos. El nodo raíz ocupa el centro; cada nivel siguiente es un anillo cuyos arcos se reparten el ángulo de su padre proporcionalmente al valor de los hijos.
Estructura: árbol {name,value,children}. Calcula para cada nodo [a0,a1] (ángulos) y [r0,r1] (radios por nivel). El ángulo de un hijo es una fracción del rango del padre según su valor.
Animación: barrido angular de entrada — un progreso 0->1 (easing) que abre cada arco desde su a0 hasta a1; opcionalmente revela los anillos de dentro hacia fuera con stagger por nivel. Repite en bucle con pausa. Color por rama con luminosidad creciente por nivel; marca #7b5cff / #00e0c6.
Para explorar tamaños de archivos, taxonomías, presupuestos anidados.`,
  code:`/* Sunburst (D3) — esqueleto idiomático */
const root = d3.hierarchy(data).sum(d=>d.value)
  .sort((a,b)=>b.value-a.value);
const part = d3.partition().size([2*Math.PI, radius])(root);
const arc = d3.arc()
  .startAngle(d=>d.x0).endAngle(d=>d.x1)
  .innerRadius(d=>d.y0).outerRadius(d=>d.y1);
svg.selectAll('path').data(part.descendants().slice(1)).join('path')
  .attr('fill', d=>color(d))
  .attrTween('d', d=>{
    const i = d3.interpolate(d.x0, d.x1);
    return t => arc({...d, x1: d.x0 + (i(t)-d.x0)*t});
  });`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    // árbol de ejemplo
    const data={name:'root',children:[
      {name:'A',v:0,children:[{name:'A1',v:3},{name:'A2',v:2},{name:'A3',v:1.5}]},
      {name:'B',v:0,children:[{name:'B1',v:2.5},{name:'B2',v:1.5}]},
      {name:'C',v:0,children:[{name:'C1',v:2},{name:'C2',v:1},{name:'C3',v:1}]}
    ]};
    const palette=['#7b5cff','#00b8d4','#00e0c6'];
    function sumv(n){if(n.children){n.v=n.children.reduce((s,c)=>s+sumv(c),0);}return n.v;}
    sumv(data);
    // asignar ángulos
    function assign(n,a0,a1,depth,hue){
      n.a0=a0;n.a1=a1;n.depth=depth;n.hue=hue;
      if(n.children){let a=a0;n.children.forEach((c,i)=>{
        const span=(a1-a0)*(c.v/n.v);
        assign(c,a,a+span,depth+1,depth===0?i:hue);a+=span;});}
    }
    assign(data,-Math.PI/2,-Math.PI/2+Math.PI*2,0,0);
    const flat=[];(function walk(n){if(n.depth>0)flat.push(n);if(n.children)n.children.forEach(walk);})(data);
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=.016;if(t>=1.2){t=1.2;hold=55;}}
      const W=o.W(),H=o.H(),cx=W/2,cy=H/2,R=Math.min(W,H)*.46,ring=R/3.2;
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      flat.forEach(n=>{
        // stagger por nivel
        const lt=Math.max(0,Math.min(1,(t-(n.depth-1)*.18)/.8));
        const e=1-Math.pow(1-lt,3);
        if(e<=0)return;
        const a=n.a0+(n.a1-n.a0)*e;
        const r0=(n.depth-1)*ring+6,r1=n.depth*ring+6;
        const base=palette[n.hue%palette.length];
        x.fillStyle=shade(base,(n.depth-1)*0.18);
        x.beginPath();
        x.arc(cx,cy,r1,n.a0,a);
        x.arc(cx,cy,r0,a,n.a0,true);
        x.closePath();x.fill();
        x.strokeStyle='#0a0a14';x.lineWidth=1.5;x.stroke();
      });
      // centro
      x.fillStyle='#16162a';x.beginPath();x.arc(cx,cy,6,0,6.283);x.fill();
      raf=requestAnimationFrame(loop);})();
    function shade(hex,amt){
      const n=parseInt(hex.slice(1),16);let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
      r=Math.round(r+(255-r)*amt);g=Math.round(g+(255-g)*amt);b=Math.round(b+(255-b)*amt);
      return 'rgb('+r+','+g+','+b+')';
    }
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
