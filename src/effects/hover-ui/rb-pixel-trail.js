import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-pixel-trail', title:'Pixel Trail', cat:'Hover & UI',
  tags:['pixel','trail','estela','cursor','react bits','rejilla','iluminar'],
  desc:'Una estela de píxeles se ilumina por donde pasa el cursor y se apaga poco a poco. Pixel Trail de React Bits.',
  meta:['grid','fade','Cursor'],
  prompt:`Recrea "Pixel Trail" de React Bits: una rejilla de celdas donde las que toca el cursor se encienden a tope y luego se van apagando, dejando una estela pixelada por donde pasas el ratón.
Mantén un valor de brillo por celda; al pasar el cursor por encima, ponlo a 1; cada frame multiplícalo por ~0.9 para el decay. Color de acento.
Fondo interactivo retro-cool para heros con gracia.`,
  code:`// Pixel Trail — celdas que enciende el cursor y decaen
const col = Math.floor(mouseX / cell), row = Math.floor(mouseY / cell)
grid[row][col] = 1                       // enciende donde pasa el cursor
grid.forEach(r => r.forEach((v, i) => r[i] = v * 0.9))   // decay (estela)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const cell=18;let G=[],cols,rows;
    function grid(){cols=Math.ceil(o.W()/cell);rows=Math.ceil(o.H()/cell);G=Array.from({length:rows},()=>Array(cols).fill(0));}
    grid();let mx=-9,my=-9,a=0,raf,run=true,hover=false;
    el.onmousemove=e=>{hover=true;const b=el.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;};el.onmouseleave=()=>hover=false;
    (function loop(){if(!run)return;a+=.03;if(!hover){mx=o.W()*(.5+Math.cos(a)*.4);my=o.H()*(.5+Math.sin(a*1.7)*.4);}const ci=(mx/cell)|0,ri=(my/cell)|0;if(G[ri]&&G[ri][ci]!==undefined)G[ri][ci]=1;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(G[r][c]>.05){x.fillStyle='rgba('+(G[r][c]>.6?'0,224,198':'123,92,255')+','+G[r][c]+')';x.fillRect(c*cell+1,r*cell+1,cell-2,cell-2);G[r][c]*=.9;}}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
