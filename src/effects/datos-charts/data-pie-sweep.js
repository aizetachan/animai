import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'data-pie-sweep', title:'Pie Chart Sweep', cat:'Datos / Charts',
  tags:['pie','tarta','sectores','barrido','porcentaje','chart','datos'],
  desc:'Una tarta cuyos sectores se dibujan con un barrido circular y se separan al destacar. Pie chart animado.',
  meta:['arc sweep','explode','Viz'],
  prompt:`Crea un "pie chart" animado: los sectores se dibujan con un barrido circular (de 0° a su ángulo) en secuencia, y opcionalmente el sector destacado se separa ligeramente del centro (explode) al resaltarse.
Acumula ángulos por valor; anima un ángulo de barrido global que revela los sectores; el activo se desplaza hacia fuera por su bisectriz. Leyenda con porcentajes.
Para composición/reparto: cuota de mercado, presupuesto, distribución.`,
  code:`// Pie sweep — sectores revelados por un ángulo de barrido global
let start = -Math.PI/2
slices.forEach(s => {
  const end = start + s.fraction * Math.PI*2
  drawArc(start, Math.min(end, sweep))   // sweep crece 0 -> 2π
  start = end
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const data=[{v:35,c:'#7b5cff'},{v:25,c:'#00e0c6'},{v:20,c:'#ff5ca8'},{v:12,c:'#ffd166'},{v:8,c:'#5a9cff'}];const total=data.reduce((a,b)=>a+b.v,0);
    let t=0,raf,run=true,hold=0,hi=0;
    (function loop(){if(!run)return;if(hold>0)hold--;else{t+=.015;if(t>=1){t=1;hold=20;if((performance.now()|0)%2===0)hi=(hi+1)%data.length;}}const sweep=Math.min(1,t)*6.283;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());const cx=o.W()*.42,cy=o.H()/2,R=Math.min(o.W(),o.H())*.34;
      let start=-1.5708;data.forEach((d,i)=>{const ang=d.v/total*6.283;const end=start+ang;const drawEnd=Math.min(end,-1.5708+sweep);if(drawEnd>start){const mid=(start+end)/2;const exp=i===hi?6:0;const ex=Math.cos(mid)*exp,ey=Math.sin(mid)*exp;x.fillStyle=d.c;x.beginPath();x.moveTo(cx+ex,cy+ey);x.arc(cx+ex,cy+ey,R,start,drawEnd);x.closePath();x.fill();}start=end;});
      // leyenda
      let ly=cy-data.length*9;data.forEach((d,i)=>{x.fillStyle=d.c;roundRect(x,o.W()-58,ly+i*18-5,10,10,2);x.fill();x.fillStyle=i===hi?'#eef0f7':'#8a8ca3';x.font='10px Inter';x.textAlign='left';x.textBaseline='middle';x.fillText(Math.round(d.v/total*100)+'%',o.W()-42,ly+i*18);});
      raf=requestAnimationFrame(loop);})();
    function roundRect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
