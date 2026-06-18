import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-ridgeline', title:'Ridgeline', cat:'Datos / Charts',
  tags:['ridgeline','joyplot','densidad','density','solapado','overlap','distribución'],
  desc:'Múltiples curvas de densidad solapadas y desplazadas verticalmente que se revelan una a una. Ridgeline / joyplot.',
  meta:['canvas','reveal','Viz'],
  prompt:`Crea un ridgeline plot (joyplot): varias filas, cada una es una curva de densidad rellena. Las filas se desplazan verticalmente con un paso menor que la altura de cada curva, de modo que se solapan parcialmente (las de arriba tapan las de abajo).
Estructura: array de filas, cada una con su array de densidad pre-binneada (KDE). Dibuja de abajo hacia arriba para que el solapamiento sea correcto.
Animación: revela las filas escalonadas (stagger) — cada curva crece su amplitud de 0 a su valor con un retardo creciente, en bucle.
Uso: comparar la evolución de una distribución a lo largo del tiempo o entre grupos.`,
  code:`// Ridgeline: filas solapadas, dibujadas de abajo a arriba
rows.forEach((row,i) => {
  const baseY = topY + i*step          // step < rowHeight => solapan
  ctx.beginPath()
  ctx.moveTo(x0, baseY)
  row.density.forEach((d,j) => {
    const px = x0 + j/(n-1)*width
    ctx.lineTo(px, baseY - d*amp*reveal[i]) // reveal escalonado 0..1
  })
  ctx.lineTo(x1, baseY); ctx.closePath()
  ctx.fill(); ctx.stroke()
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const L=48,ROWS=6;
    function gen(seed){const d=new Array(L).fill(0);const modes=[{mu:.3+seed*.07,s:.10,w:1},{mu:.65-seed*.04,s:.08,w:.4+seed*.08}];for(let i=0;i<L;i++){const c=i/(L-1);for(const m of modes)d[i]+=m.w*Math.exp(-((c-m.mu)**2)/(2*m.s*m.s));}const mx=Math.max(...d);return d.map(v=>v/mx);}
    const rows=[];for(let i=0;i<ROWS;i++)rows.push(gen(i));
    const col=(p)=>{const a=[123,92,255],b=[0,224,198];return'rgb('+Math.round(a[0]+(b[0]-a[0])*p)+','+Math.round(a[1]+(b[1]-a[1])*p)+','+Math.round(a[2]+(b[2]-a[2])*p)+')';};
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.012;if(t>=1.3){t=1.3;hold=60;}}
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const pad=16,topY=30,step=(H-40)/ROWS,amp=step*1.9;
      // de abajo a arriba
      for(let i=ROWS-1;i>=0;i--){
        const local=Math.max(0,Math.min(1,(t-i*0.10)/0.6));
        const rv=local<1?1-Math.pow(1-local,3):1;
        const baseY=topY+i*step;
        const cc=col(i/(ROWS-1));
        x.beginPath();x.moveTo(pad,baseY);
        for(let j=0;j<L;j++){const px=pad+j/(L-1)*(W-pad*2);x.lineTo(px,baseY-rows[i][j]*amp*rv);}
        x.lineTo(W-pad,baseY);x.closePath();
        x.fillStyle=cc.replace('rgb','rgba').replace(')',',0.85)');x.fill();
        x.strokeStyle='#0a0a14';x.lineWidth=1;x.stroke();
        x.strokeStyle=cc;x.lineWidth=1.4;
        x.beginPath();for(let j=0;j<L;j++){const px=pad+j/(L-1)*(W-pad*2),py=baseY-rows[i][j]*amp*rv;j?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();
      }
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
