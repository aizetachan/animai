import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-lottery-grid', title:'Lucky Grid', cat:'Creativos',
  tags:['lottery','九宫格','grid','sorteo','luck','premio','marquee'],
  desc:'Cuadrícula 3x3 con una luz que recorre las casillas, acelera y se detiene en el premio. El clásico 九宫格.',
  meta:['canvas','marquee','九宫格'],
  prompt:`Crea un sorteo estilo "九宫格" (lucky grid). Estructura: 9 casillas en una rejilla 3x3; la luz NO recorre el orden 0..8 sino el anillo exterior en sentido horario (índices 0,1,2,5,8,7,6,3) — la casilla central (4) nunca se ilumina, suele ser el botón.
Algoritmo: mantén un índice activo sobre el anillo (8 posiciones). Avanza el índice cada cierto intervalo; usa easing de velocidad: arranca rápido (intervalo corto), y al acercarse a la casilla ganadora desacelera (intervalo crece) hasta detenerse. Cuando se detiene, parpadea la casilla ganadora unos instantes y luego reinicia.
Render: dibuja las 9 casillas con esquinas redondeadas; la activa con glow/borde de acento (#7b5cff). La ganadora final se resalta con #00e0c6. Timings: fase de giro ~1.8s con desaceleración cuadrática, hold ~1.2s, reinicio.`,
  code:`// Lucky Grid (九宫格): la luz recorre el anillo exterior y desacelera hasta el premio
const ring = [0,1,2,5,8,7,6,3];      // anillo horario, el centro (4) se omite
const winner = 5;                     // índice del premio en 'ring'
const steps = 8*3 + winner;           // 3 vueltas + offset hasta el premio
let i = 0, last = 0, delay = 70;
function tick(t){
  if (t - last >= delay){
    last = t; i++;
    // easing: el intervalo crece al acercarse al final -> desacelera
    const p = i/steps;
    delay = 70 + 360*p*p;
    if (i >= steps){ highlight(ring[winner]); return; }
  }
  setActive(ring[i % ring.length]);
  requestAnimationFrame(tick);
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const ring=[0,1,2,5,8,7,6,3];
    let raf,run=true;
    const PRIZES=['x2','x5','???','x10','x3','x20','x1','x50'];
    let winner, steps, i, lastT, delay, phase, holdUntil;
    function reset(){
      winner=Math.floor(Math.random()*ring.length);
      steps=ring.length*3+winner;
      i=0; lastT=performance.now(); delay=70; phase='spin'; holdUntil=0;
    }
    reset();
    function loop(now){
      if(!run)return;
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a16';x.fillRect(0,0,W,H);
      const pad=10, gap=6;
      const cell=Math.min((W-pad*2-gap*2)/3,(H-pad*2-gap*2)/3);
      const gw=cell*3+gap*2, gh=gw;
      const ox=(W-gw)/2, oy=(H-gh)/2;
      if(phase==='spin'){
        if(now-lastT>=delay){
          lastT=now; i++;
          const p=i/steps; delay=60+420*p*p;
          if(i>=steps){phase='hold';holdUntil=now+1300;}
        }
      } else if(phase==='hold'){
        if(now>=holdUntil) reset();
      }
      const activeRingIdx = phase==='spin' ? (i % ring.length) : winner;
      const activeCell = ring[activeRingIdx];
      const blink = phase==='hold' ? (Math.floor(now/180)%2===0) : true;
      for(let c=0;c<9;c++){
        const r=Math.floor(c/3), col=c%3;
        const cx=ox+col*(cell+gap), cy=oy+r*(cell+gap);
        const isActive = c===activeCell;
        const isWin = phase==='hold' && c===activeCell;
        roundRect(x,cx,cy,cell,cell,8);
        if(c===4){
          x.fillStyle='#16162a';x.fill();
          x.fillStyle='#6b6b8a';x.font='700 '+(cell*.22)+'px Inter';x.textAlign='center';x.textBaseline='middle';
          x.fillText('GO',cx+cell/2,cy+cell/2);
          continue;
        }
        const prize=PRIZES[ring.indexOf(c)];
        if(isWin && blink){
          x.fillStyle='rgba(0,224,198,.18)';x.fill();
          x.lineWidth=2.5;x.strokeStyle='#00e0c6';x.stroke();
          x.shadowColor='#00e0c6';x.shadowBlur=14;x.fillStyle='#00e0c6';x.fill();x.shadowBlur=0;
        } else if(isActive){
          x.fillStyle='rgba(123,92,255,.16)';x.fill();
          x.lineWidth=2;x.strokeStyle='#7b5cff';x.stroke();
        } else {
          x.fillStyle='#121223';x.fill();
          x.lineWidth=1;x.strokeStyle='#26263f';x.stroke();
        }
        x.fillStyle=(isWin&&blink)?'#062b27':(isActive?'#cdbfff':'#9a9ab8');
        x.font='800 '+(cell*.26)+'px Inter';x.textAlign='center';x.textBaseline='middle';
        x.fillText(prize,cx+cell/2,cy+cell/2);
      }
      raf=requestAnimationFrame(loop);
    }
    function roundRect(c,X,Y,w,h,r){c.beginPath();c.moveTo(X+r,Y);c.arcTo(X+w,Y,X+w,Y+h,r);c.arcTo(X+w,Y+h,X,Y+h,r);c.arcTo(X,Y+h,X,Y,r);c.arcTo(X,Y,X+w,Y,r);c.closePath();}
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
