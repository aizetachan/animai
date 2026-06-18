import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-chord', title:'Chord Diagram', cat:'Datos / Charts',
  tags:['chord','cuerdas','cintas','ribbon','flujo','matriz','弦图'],
  desc:'Un diagrama de cuerdas circular: arcos de grupo en el anillo y cintas curvas que conectan flujos entre ellos.',
  meta:['canvas','arc','ribbon','Viz'],
  prompt:`Crea un "chord diagram" (diagrama de cuerdas) animado a partir de una matriz cuadrada de flujos NxN.
Estructura de datos: matrix[i][j] = magnitud del flujo del grupo i al grupo j. Suma de cada fila = tamaño del arco del grupo.
Layout: reparte el círculo (2π) en arcos proporcionales a la suma de cada grupo, con un pequeño hueco (padAngle) entre arcos. Dentro de cada arco se subdividen sub-ángulos por destino.
Cada cinta conecta dos sub-arcos (origen i->j y j->i) mediante curvas de Bézier cuadráticas que pasan cerca del centro.
Animación: 1) los arcos del anillo barren su ángulo (growth 0->1), 2) las cintas hacen fade-in y se "rellenan" tras los arcos. Bucle con pausa.
Usos: relaciones entre categorías, migraciones, matrices de transición, dependencias.`,
  code:`// Chord diagram (Canvas 2D) — arcos + cintas Bézier hacia el centro
// matrix[i][j] = flujo i->j ; el anillo se reparte proporcional a la suma de filas
const total = matrix.flat().reduce((a,b)=>a+b,0);
let a0 = -Math.PI/2;
const groups = matrix.map(row=>{
  const sum = row.reduce((a,b)=>a+b,0);
  const span = (sum/total) * (Math.PI*2 - n*pad);
  const g = { start:a0, end:a0+span, subs:[] };
  let s = a0;
  row.forEach(v=>{ const sub = (v/total)*(Math.PI*2 - n*pad); g.subs.push([s,s+sub]); s+=sub; });
  a0 += span + pad; return g;
});
// una cinta: dos extremos sobre el anillo, control en el centro
function ribbon(a1,a2,b1,b2,R){
  ctx.beginPath();
  ctx.arc(cx,cy,R, a1,a2);
  ctx.quadraticCurveTo(cx,cy, cx+Math.cos(b1)*R, cy+Math.sin(b1)*R);
  ctx.arc(cx,cy,R, b1,b2);
  ctx.quadraticCurveTo(cx,cy, cx+Math.cos(a1)*R, cy+Math.sin(a1)*R);
  ctx.closePath(); ctx.fill();
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const matrix=[
      [0,5,3,2],
      [4,0,2,3],
      [2,3,0,4],
      [3,2,4,0]
    ];
    const n=matrix.length;
    const cols=['#7b5cff','#00e0c6','#ff5ca8','#ffb454'];
    const pad=0.10;
    const total=matrix.flat().reduce((a,b)=>a+b,0);
    // build groups + sub-arcs
    function build(){
      let a0=-Math.PI/2; const groups=[];
      for(let i=0;i<n;i++){
        const row=matrix[i]; const sum=row.reduce((a,b)=>a+b,0);
        const span=(sum/total)*(Math.PI*2-n*pad);
        const g={start:a0,end:a0+span,subs:[],color:cols[i]};
        let s=a0;
        for(let j=0;j<n;j++){ const sub=(row[j]/total)*(Math.PI*2-n*pad); g.subs.push([s,s+sub,j]); s+=sub; }
        a0+=span+pad; groups.push(g);
      }
      // ribbons: pair i->j with j->i, draw once for i<j
      const ribbons=[];
      for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
        const aSub=groups[i].subs[j];const bSub=groups[j].subs[i];
        ribbons.push({a:aSub,b:bSub,color:cols[i]});
      }
      return{groups,ribbons};
    }
    const {groups,ribbons}=build();
    let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=.012;if(t>=1.6){t=0;}}
      const arcE=Math.min(1,t/0.7); const ae=1-Math.pow(1-arcE,3);
      const ribE=Math.max(0,Math.min(1,(t-0.5)/0.6));
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.34;
      // ribbons (behind ring)
      x.globalAlpha=ribE;
      ribbons.forEach(r=>{
        const [a1,a2]=r.a,[b1,b2]=r.b;
        x.beginPath();
        x.arc(cx,cy,R,a1,a2);
        x.quadraticCurveTo(cx,cy,cx+Math.cos(b1)*R,cy+Math.sin(b1)*R);
        x.arc(cx,cy,R,b1,b2);
        x.quadraticCurveTo(cx,cy,cx+Math.cos(a1)*R,cy+Math.sin(a1)*R);
        x.closePath();
        x.fillStyle=r.color;x.globalAlpha=ribE*0.32;x.fill();
        x.globalAlpha=ribE*0.55;x.strokeStyle=r.color;x.lineWidth=0.8;x.stroke();
      });
      x.globalAlpha=1;
      // ring arcs
      x.lineWidth=Math.max(7,R*0.18);
      groups.forEach(g=>{
        const end=g.start+(g.end-g.start)*ae;
        x.beginPath();x.strokeStyle=g.color;x.lineCap='butt';
        x.arc(cx,cy,R,g.start,end);x.stroke();
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
