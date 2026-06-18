import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pt-falling-sand', title:'Falling Sand', cat:'Partículas',
  tags:['falling sand','arena','autómata','cellular automata','física','apilar','grid'],
  desc:'Granos de arena que caen y se apilan formando montículos, autómata estilo "falling sand".',
  meta:['Canvas 2D','Autómata','Física'],
  prompt:`Implementa una simulación de "arena que cae" (falling sand) en canvas 2D sobre una rejilla de celdas (0 = vacío, >0 = grano con color).
Reglas por paso, recorriendo de abajo hacia arriba: un grano intenta moverse a la celda de abajo si está vacía; si no, intenta caer en diagonal abajo-izquierda o abajo-derecha (elige aleatoriamente el orden para simetría). Si no puede, se queda quieto (se apila).
Genera arena nueva desde una o varias fuentes en la parte superior cada frame, con tono de color que varía (gradiente marca #7b5cff → #00e0c6). Cuando la pila llega arriba, limpia para reiniciar el flujo.
Dibuja cada grano como un píxel/cuadrado del tamaño de celda.`,
  code:`// Falling sand — autómata de caída y apilado (canvas 2D)
// recorrer de abajo arriba para no mover el mismo grano dos veces
for(let y=rows-2; y>=0; y--){
  for(let x=0; x<cols; x++){
    const i=y*cols+x;
    if(!grid[i]) continue;
    const below=i+cols;
    if(!grid[below]){ grid[below]=grid[i]; grid[i]=0; continue; }
    const dir = Math.random()<0.5 ? -1 : 1; // izquierda o derecha primero
    const dl=below+dir, dr=below-dir;
    if(x+dir>=0 && x+dir<cols && !grid[dl]){ grid[dl]=grid[i]; grid[i]=0; }
    else if(x-dir>=0 && x-dir<cols && !grid[dr]){ grid[dr]=grid[i]; grid[i]=0; }
  }
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const cell=4;let cols=1,rows=1,grid=new Uint8Array(1);
    function alloc(){cols=Math.max(1,Math.floor(o.W()/cell));rows=Math.max(1,Math.floor(o.H()/cell));grid=new Uint8Array(cols*rows);}
    alloc();
    let raf,run=true,hue=0;
    (function loop(){if(!run)return;
      if(cols!==Math.max(1,Math.floor(o.W()/cell))||rows!==Math.max(1,Math.floor(o.H()/cell)))alloc();
      hue+=0.6;
      // fuentes en la parte superior
      const srcs=[Math.floor(cols*0.32),Math.floor(cols*0.5),Math.floor(cols*0.68)];
      srcs.forEach((sx,k)=>{if(Math.random()<0.8){const c=1+((hue+k*40)|0)%200;for(let w=-1;w<=1;w++){const px=sx+w;if(px>=0&&px<cols&&!grid[px])grid[px]=c;}}});
      // simulación: de abajo hacia arriba
      for(let y=rows-2;y>=0;y--){const lr=Math.random()<0.5?-1:1;for(let xx=0;xx<cols;xx++){const i=y*cols+xx;if(!grid[i])continue;const below=i+cols;if(!grid[below]){grid[below]=grid[i];grid[i]=0;continue;}const a=xx+lr,b=xx-lr;if(a>=0&&a<cols&&!grid[below+lr]){grid[below+lr]=grid[i];grid[i]=0;}else if(b>=0&&b<cols&&!grid[below-lr]){grid[below-lr]=grid[i];grid[i]=0;}}}
      // reinicio si la pila llega arriba
      let topFull=0;for(let xx=0;xx<cols;xx++)if(grid[xx]||grid[cols+xx])topFull++;
      if(topFull>cols*0.5)grid=new Uint8Array(cols*rows);
      x.fillStyle='#07090d';x.fillRect(0,0,o.W(),o.H());
      for(let y=0;y<rows;y++)for(let xx=0;xx<cols;xx++){const v=grid[y*cols+xx];if(v){const f=(v-1)/200;const r=Math.round(123+(0-123)*f);const g=Math.round(92+(224-92)*f);const bb=Math.round(255+(198-255)*f);x.fillStyle='rgb('+r+','+g+','+bb+')';x.fillRect(xx*cell,y*cell,cell,cell);}}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
