import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-waffle', title:'Waffle Chart', cat:'Datos / Charts',
  tags:['waffle','cuadricula','grid','porcentaje','percentage','parte-todo','100'],
  desc:'Cuadrícula de 100 celdas que se rellenan en cascada según el porcentaje de cada categoría.',
  meta:['canvas','grid','Viz'],
  prompt:`Crea un waffle chart: una cuadrícula de 10x10 = 100 celdas que representa el 100%. Cada categoría ocupa tantas celdas como su porcentaje (p. ej. 45% -> 45 celdas).
Recorre las celdas en orden (fila por fila o columna por columna) y asigna el color de la categoría según rangos acumulados. Anima la entrada rellenando celda a celda en cascada (cada celda aparece con un retardo proporcional a su índice), con un pop de escala/opacidad. Mantén el resultado un instante y reinicia en bucle.
Ideal para mostrar composición parte-todo de forma intuitiva (cuota de mercado, distribución de usuarios).`,
  code:`// Waffle: 100 celdas = 100%. Asigna color por rango acumulado.
const cats=[{c:'#7b5cff',pct:45},{c:'#00e0c6',pct:30},{c:'#ff5ca8',pct:15}];
let acc=0; const cellCat=[];
for(const cat of cats){ for(let k=0;k<cat.pct;k++) cellCat[acc++]=cat.c; }
for(let i=0;i<100;i++){ // fila/col desde abajo-izquierda
  const col=i%10, row=9-Math.floor(i/10);
  ctx.fillStyle=cellCat[i]||'#1c1c2a';
  ctx.fillRect(x0+col*step, y0+row*step, cell, cell);
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const cats=[{c:'#7b5cff',pct:45},{c:'#00e0c6',pct:30},{c:'#ff5ca8',pct:15}];
    const cellCat=new Array(100).fill(null);let acc=0;
    for(const cat of cats){for(let k=0;k<cat.pct&&acc<100;k++)cellCat[acc++]=cat.c;}
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;
      if(hold>0){hold--;}else{t+=1.1;if(t>=110){t=110;hold=70;}}
      const W=o.W(),H=o.H();x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const grid=Math.min(W,H)-32;const step=grid/10;const cell=step*0.78;
      const x0=(W-grid)/2,y0=(H-grid)/2;
      for(let i=0;i<100;i++){
        const col=i%10,row=9-Math.floor(i/10);
        const appear=t-i;if(appear<=0)continue;
        const p=Math.min(1,appear/12);const e=1-Math.pow(1-p,3);
        const cx=x0+col*step+step/2,cy=y0+row*step+step/2;const s=cell*e;
        const col6=cellCat[i];
        x.globalAlpha=col6?e:e*0.5;
        x.fillStyle=col6||'#1c1c2a';
        const rr=Math.min(3,s/2);
        const rx=cx-s/2,ry=cy-s/2;
        x.beginPath();
        x.moveTo(rx+rr,ry);x.arcTo(rx+s,ry,rx+s,ry+s,rr);x.arcTo(rx+s,ry+s,rx,ry+s,rr);
        x.arcTo(rx,ry+s,rx,ry,rr);x.arcTo(rx,ry,rx+s,ry,rr);x.closePath();x.fill();
      }
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
