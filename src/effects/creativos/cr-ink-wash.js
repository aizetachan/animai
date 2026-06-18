import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-ink-wash', title:'Ink Wash', cat:'Creativos',
  tags:['tinta','ink','水墨','sumi-e','pincelada','difusión','wash'],
  desc:'Pincelada de tinta china que se difunde sobre papel, creciendo en capas suaves y desvaneciéndose.',
  meta:['canvas','blur','水墨'],
  prompt:`Crea el efecto de tinta china (水墨) que se difunde sobre papel en canvas 2D.
Estructura: una pincelada se modela como una secuencia de "manchas" (blobs) a lo largo de una curva de Bézier; cada mancha es un círculo con radio variable y opacidad baja en tinta negra/azulada.
Algoritmo: en cada frame avanza un progreso 0→1; para cada blob cuyo umbral t<=progreso, dibuja el círculo con un radio que crece (ease-out) y, alrededor, varios sub-puntos aleatorios pequeños que simulan la difusión irregular de la tinta sobre la fibra del papel. Usa ctx.filter='blur(Npx)' o múltiples capas semitransparentes para el sangrado.
Timings: la pincelada se traza en ~1.8s, se mantiene ~0.6s y se desvanece bajando globalAlpha en ~1s; luego reinicia con una nueva curva. Fondo papel crema oscuro.`,
  code:`// 水墨 Ink wash (canvas 2D)
// blobs a lo largo de una curva; cada uno crece y sangra
function blot(x, y, r, a){
  ctx.globalAlpha = a;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  // difusión: sub-puntos irregulares alrededor
  for (let k = 0; k < 5; k++){
    const ang = Math.random() * 6.283, d = r * (0.6 + Math.random() * 0.7);
    ctx.globalAlpha = a * 0.35;
    ctx.beginPath();
    ctx.arc(x + Math.cos(ang) * d, y + Math.sin(ang) * d, r * (0.3 + Math.random() * 0.4), 0, 6.283);
    ctx.fill();
  }
}
// en el loop: avanza progress, dibuja blobs con t<=progress con radio ease-out`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    function makeStroke(){
      const W=o.W(),H=o.H();
      const x0=W*(.15+Math.random()*.2), y0=H*(.2+Math.random()*.2);
      const x3=W*(.65+Math.random()*.2), y3=H*(.6+Math.random()*.2);
      const cx1=W*(.3+Math.random()*.3), cy1=H*(.7+Math.random()*.2);
      const cx2=W*(.5+Math.random()*.3), cy2=H*(.15+Math.random()*.2);
      const N=26, blobs=[];
      for(let i=0;i<=N;i++){
        const t=i/N, mt=1-t;
        const bx=mt*mt*mt*x0+3*mt*mt*t*cx1+3*mt*t*t*cx2+t*t*t*x3;
        const by=mt*mt*mt*y0+3*mt*mt*t*cy1+3*mt*t*t*cy2+t*t*t*y3;
        const taper=Math.sin(t*Math.PI);
        blobs.push({x:bx,y:by,r:3+taper*11+Math.random()*2,thr:t,seed:Math.random()*6.28});
      }
      return blobs;
    }
    let blobs=makeStroke();
    let raf,run=true,t0=performance.now();
    const DRAW=1800,HOLD=600,FADE=1000,TOTAL=DRAW+HOLD+FADE+200;
    function loop(now){
      if(!run)return;
      const W=o.W(),H=o.H();
      let el2=now-t0;
      if(el2>TOTAL){t0=now;el2=0;blobs=makeStroke();}
      // papel
      x.globalAlpha=1;x.fillStyle='#15131c';x.fillRect(0,0,W,H);
      x.fillStyle='#0d1a26';x.globalAlpha=.25;x.fillRect(0,0,W,H);
      const prog=Math.min(1,el2/DRAW);
      let layerAlpha=1;
      if(el2>DRAW+HOLD){layerAlpha=Math.max(0,1-(el2-DRAW-HOLD)/FADE);}
      x.fillStyle='#aeb8c4';
      blobs.forEach(b=>{
        if(b.thr>prog)return;
        const grow=Math.min(1,(prog-b.thr)*6+.2);
        const r=b.r*(1-Math.pow(1-grow,2));
        const a=.10*layerAlpha;
        x.globalAlpha=a;
        x.beginPath();x.arc(b.x,b.y,r,0,6.283);x.fill();
        for(let k=0;k<4;k++){
          const ang=b.seed+k*1.7+grow,d=r*(.5+(k%3)*.3);
          x.globalAlpha=a*.4;
          x.beginPath();x.arc(b.x+Math.cos(ang)*d,b.y+Math.sin(ang)*d,r*(.3+(k%2)*.25),0,6.283);x.fill();
        }
      });
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
