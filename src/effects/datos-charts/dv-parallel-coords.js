import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-parallel-coords', title:'Parallel Coords', cat:'Datos / Charts',
  tags:['parallel coordinates','coordenadas paralelas','平行坐标','multivariable','ejes','viz','d3'],
  desc:'Coordenadas paralelas con líneas multivariable que se trazan progresivamente.',
  meta:['canvas','axes','Viz'],
  prompt:`Crea un gráfico de coordenadas paralelas (parallel coordinates) en canvas 2D.
Estructura de datos: lista de registros, cada uno con N dimensiones numéricas (p.ej. {dimA, dimB, dimC, dimD}). Cada dimensión tiene su dominio [min,max].
Layout: N ejes verticales equiespaciados horizontalmente. Cada dimensión se escala de su dominio al rango vertical del lienzo. Cada registro es una polilínea que conecta su valor en cada eje.
Animación de trazado: las polilíneas se dibujan progresivamente de izquierda a derecha (progreso 0->1 que revela segmento por segmento, con interpolación dentro del segmento parcial). Stagger por registro para un efecto en cascada. Color por una dimensión categórica/valor. En bucle: reinicia el trazado.
Para comparar entidades en múltiples métricas y detectar correlaciones.`,
  code:`// Parallel coordinates — trazado progresivo (Canvas 2D)
const dims = ['A','B','C','D']; // ejes verticales equiespaciados
const xOf = i => pad + i*(W-2*pad)/(dims.length-1);
const yOf = (dim,v) => H-pad - (v-min[dim])/(max[dim]-min[dim])*(H-2*pad);
rows.forEach((r,ri) => {
  const pts = dims.map((d,i)=>({x:xOf(i), y:yOf(d,r[d])}));
  // progreso p reveal: dibuja hasta el segmento p*(n-1)
  ctx.beginPath();
  for(let i=0;i<pts.length-1;i++){ /* lerp del segmento parcial */ }
  ctx.stroke();
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const DIMS=['Velocidad','Peso','Costo','Energía'];
    const ROWS=[
      [0.85,0.30,0.55,0.70],[0.40,0.75,0.35,0.50],[0.65,0.50,0.80,0.30],
      [0.20,0.90,0.60,0.85],[0.95,0.15,0.45,0.40],[0.55,0.60,0.25,0.65],
      [0.30,0.45,0.70,0.55],[0.75,0.25,0.90,0.20]
    ];
    let raf,run=true,t=0;
    function lerpColor(a,b,k){return a.map((v,i)=>Math.round(v+(b[i]-v)*k));}
    const C1=[123,92,255],C2=[0,224,198];
    (function loop(){if(!run)return;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const W=o.W(),H=o.H(),padX=24,padY=24;
      const xOf=i=>padX+i*(W-2*padX)/(DIMS.length-1);
      const yOf=v=>H-padY-v*(H-2*padY);
      // ejes
      x.strokeStyle='#2a2a3e';x.lineWidth=1;x.fillStyle='#6b6b85';x.font='9px sans-serif';x.textAlign='center';
      DIMS.forEach((d,i)=>{const ax=xOf(i);x.beginPath();x.moveTo(ax,padY);x.lineTo(ax,H-padY);x.stroke();x.fillText(d,ax,12);});
      x.textAlign='start';
      t++;
      ROWS.forEach((r,ri)=>{
        const start=ri*8;
        const prog=Math.max(0,Math.min(1,(t-start)/55));
        if(prog<=0)return;
        const k=r[2];const col=lerpColor(C2,C1,k);
        const pts=r.map((v,i)=>({x:xOf(i),y:yOf(v)}));
        const segs=pts.length-1;const cover=prog*segs;
        x.beginPath();x.moveTo(pts[0].x,pts[0].y);
        for(let i=0;i<segs;i++){
          if(cover>=i+1){x.lineTo(pts[i+1].x,pts[i+1].y);}
          else if(cover>i){const f=cover-i;x.lineTo(pts[i].x+(pts[i+1].x-pts[i].x)*f,pts[i].y+(pts[i+1].y-pts[i].y)*f);break;}
          else break;
        }
        x.lineWidth=1.6;x.strokeStyle='rgba('+col[0]+','+col[1]+','+col[2]+',.8)';x.stroke();
      });
      if(t>180){t=0;}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
