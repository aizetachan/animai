import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pt-game-of-life', title:'Game of Life', cat:'Partículas',
  tags:['game of life','conway','autómata','celular','cellular automata','vida','grid'],
  desc:'El autómata celular de Conway corriendo en una rejilla; se reinicia al estabilizarse.',
  meta:['Canvas 2D','Autómata','Conway'],
  prompt:`Implementa el "Juego de la Vida" de Conway en canvas 2D sobre una rejilla de celdas (cada celda viva o muerta).
Reglas por paso: cuenta los 8 vecinos vivos (vecindad de Moore, con bordes envolventes/toroidales). Una celda viva sobrevive con 2 o 3 vecinos; una celda muerta nace con exactamente 3 vecinos; en cualquier otro caso muere/queda muerta.
Usa doble buffer (lee del grid actual, escribe en el siguiente, luego intercambia). Dibuja cada celda viva como un cuadrado con color marca (#7b5cff / #00e0c6).
Detecta estabilización: si la población no cambia durante varias generaciones (o el hash del estado se repite), reinicia sembrando aleatoriamente ~28% de celdas vivas. Limita la velocidad con un acumulador de tiempo (~12 fps de simulación).`,
  code:`// Game of Life — autómata celular de Conway (canvas 2D)
function step(grid, next, cols, rows){
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    let n=0;
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
      if(dx===0&&dy===0) continue;
      const xx=(x+dx+cols)%cols, yy=(y+dy+rows)%rows; // toroidal
      n += grid[yy*cols+xx];
    }
    const a = grid[y*cols+x];
    next[y*cols+x] = (a && (n===2||n===3)) || (!a && n===3) ? 1 : 0;
  }
}
// reseed cuando población se estanca
if(stableFrames > 30) seed(grid, 0.28);`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const cell=6;let cols=1,rows=1,grid=new Uint8Array(1),next=new Uint8Array(1);
    function seed(){for(let i=0;i<grid.length;i++)grid[i]=Math.random()<0.28?1:0;}
    function alloc(){cols=Math.max(1,Math.floor(o.W()/cell));rows=Math.max(1,Math.floor(o.H()/cell));grid=new Uint8Array(cols*rows);next=new Uint8Array(cols*rows);seed();}
    alloc();
    let pop=-1,stable=0,acc=0,last=performance.now(),raf,run=true;
    (function loop(){if(!run)return;
      const now=performance.now();acc+=now-last;last=now;
      if(cols!==Math.max(1,Math.floor(o.W()/cell))||rows!==Math.max(1,Math.floor(o.H()/cell)))alloc();
      if(acc>80){acc=0;
        for(let y=0;y<rows;y++)for(let xx=0;xx<cols;xx++){let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(dx===0&&dy===0)continue;const ax=(xx+dx+cols)%cols,ay=(y+dy+rows)%rows;n+=grid[ay*cols+ax];}const a=grid[y*cols+xx];next[y*cols+xx]=(a&&(n===2||n===3))||(!a&&n===3)?1:0;}
        const tmp=grid;grid=next;next=tmp;
        let p=0;for(let i=0;i<grid.length;i++)p+=grid[i];
        if(p===pop)stable++;else stable=0;pop=p;
        if(stable>30||p===0){seed();stable=0;pop=-1;}
      }
      x.fillStyle='#07090d';x.fillRect(0,0,o.W(),o.H());
      for(let y=0;y<rows;y++)for(let xx=0;xx<cols;xx++){if(grid[y*cols+xx]){const t=(xx/cols+y/rows)*0.5;x.fillStyle=t<0.5?'#7b5cff':'#00e0c6';x.fillRect(xx*cell,y*cell,cell-1,cell-1);}}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
