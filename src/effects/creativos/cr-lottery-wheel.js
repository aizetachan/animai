import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-lottery-wheel', title:'Lottery Wheel', cat:'Creativos',
  tags:['lottery','转盘','ruleta','wheel','premios','spin','sorteo'],
  desc:'转盘: ruleta de premios que gira rápido y desacelera con easing hasta detenerse en un sector ganador.',
  meta:['canvas','spin easing','auto-demo'],
  prompt:`Crea una ruleta de premios (转盘 / lottery wheel) en canvas 2D.
Estructura: un array de sectores; cada sector tiene {label, color}. Reparte 2*PI entre todos: cada sector ocupa un ángulo seg = 2*PI / n y se dibuja como un arco (ctx.arc + lineTo al centro) con su etiqueta rotada en su bisectriz.
Animación de giro: define un ángulo objetivo = varias vueltas completas + el ángulo necesario para que el sector ganador quede bajo el puntero fijo (arriba). Anima la rotación con easeOutCubic durante ~3-4 s: angle = start + (target-start)*ease(p). Al terminar, marca el sector ganador (parpadeo o resaltado).
Auto-demo: tras detenerse, espera un momento y vuelve a girar eligiendo un ganador aleatorio, en bucle. Dibuja un puntero/triángulo fijo en la parte superior y un botón/eje central.
Para sorteos, gamificación, ruedas de la fortuna y recompensas.`,
  code:`// Lottery wheel (转盘) — giro con easeOutCubic en Canvas 2D
const seg = (Math.PI*2) / sectors.length
function spinTo(winner){
  const turns = 5
  target = turns*Math.PI*2 + (Math.PI*2 - (winner+0.5)*seg) - Math.PI/2
}
const ease = p => 1 - Math.pow(1-p, 3)
// loop: angle = start + (target-start)*ease(elapsed/duration)
// dibuja cada sector: ctx.arc(cx,cy,r, a, a+seg) -> lineTo(cx,cy) -> fill`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const sectors=[
      {label:'88',color:'#7b5cff'},{label:'谢谢',color:'#2a2a3a'},
      {label:'¡Premio!',color:'#00e0c6'},{label:'10%',color:'#2a2a3a'},
      {label:'★',color:'#ff8acb'},{label:'再来',color:'#2a2a3a'},
      {label:'500',color:'#ffc861'},{label:'???',color:'#2a2a3a'}
    ];
    const n=sectors.length,seg=Math.PI*2/n;
    const ease=p=>1-Math.pow(1-p,3);
    const DUR=2600;
    let angle=0,start=0,target=0,t0=performance.now(),winner=0,phase='spin',raf,run=true,holdUntil=0;
    function newSpin(now){
      winner=Math.floor(Math.random()*n);
      start=angle%(Math.PI*2);
      // ajustar para que el sector ganador quede bajo el puntero (-PI/2) tras 5 vueltas
      const want=(-Math.PI/2)-(winner+0.5)*seg;
      let cur=start%(Math.PI*2);let delta=((want-cur)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      target=start+5*Math.PI*2+delta;
      t0=now;phase='spin';
    }
    newSpin(t0);
    (function loop(){if(!run)return;const now=performance.now();
      if(phase==='spin'){
        const p=Math.min(1,(now-t0)/DUR);
        angle=start+(target-start)*ease(p);
        if(p>=1){phase='hold';holdUntil=now+1100;}
      }else if(now>=holdUntil){newSpin(now);}
      const W=o.W(),H=o.H(),cx=W/2,cy=H/2,r=Math.min(W,H)/2-14;
      x.fillStyle='#07070d';x.fillRect(0,0,W,H);
      // sectores
      for(let i=0;i<n;i++){
        const a0=angle+i*seg,a1=a0+seg;
        x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a0,a1);x.closePath();
        const isWin=(phase==='hold'&&i===winner);
        x.fillStyle=isWin?'#fff':sectors[i].color;x.fill();
        x.strokeStyle='rgba(7,7,13,.7)';x.lineWidth=1.5;x.stroke();
        // etiqueta
        x.save();x.translate(cx,cy);x.rotate(a0+seg/2);
        x.fillStyle=isWin?'#07070d':'#fff';x.font='bold 10px system-ui,sans-serif';
        x.textAlign='right';x.textBaseline='middle';
        x.fillText(sectors[i].label,r-8,0);x.restore();
      }
      // eje central
      x.fillStyle='#0a0a14';x.beginPath();x.arc(cx,cy,12,0,6.28);x.fill();
      x.strokeStyle='#7b5cff';x.lineWidth=2;x.stroke();
      // puntero arriba
      x.fillStyle='#00e0c6';x.beginPath();
      x.moveTo(cx-7,cy-r-2);x.lineTo(cx+7,cy-r-2);x.lineTo(cx,cy-r+10);x.closePath();x.fill();
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
