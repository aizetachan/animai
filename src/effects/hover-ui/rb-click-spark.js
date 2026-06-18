import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-click-spark', title:'Click Spark', cat:'Hover & UI',
  tags:['click','spark','chispa','partículas','react bits','feedback','tap'],
  desc:'Chispas que salen disparadas radialmente al hacer click. Feedback satisfactorio de React Bits.',
  meta:['Canvas 2D','burst','Feedback'],
  prompt:`Recrea "Click Spark" de React Bits: al hacer click, salen N chispas (líneas cortas) disparadas radialmente desde el punto del click, que se alejan y se desvanecen rápidamente.
En cada click crea las chispas con ángulos repartidos; anímalas hacia fuera con easing de salida y fade. Líneas finas de color de acento.
Microinteracción de feedback para botones, likes o cualquier acción puntual.`,
  code:`// Click Spark (React Bits) — chispas radiales al click
function spark(x, y) {
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    sparks.push({ x, y, a, dist: 0, life: 1 })
  }
}
// en loop: s.dist += easeOut; s.life -= 0.04; línea de (x,y)+a*dist`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const S=[];function spark(px,py){for(let i=0;i<9;i++){const a=i/9*6.283;S.push({x:px,y:py,a,d:0,v:3+Math.random(),life:1});}}
    el.onclick=e=>{const b=el.getBoundingClientRect();spark(e.clientX-b.left,e.clientY-b.top);};
    let raf,run=true,c=0;
    (function loop(){if(!run)return;c++;if(c%55===0)spark(o.W()*(.3+Math.random()*.4),o.H()*(.3+Math.random()*.4));x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      x.fillStyle='#8a8ca3';x.font='11px Inter';x.textAlign='center';x.fillText('click para chispas',o.W()/2,o.H()-14);
      for(let i=S.length-1;i>=0;i--){const s2=S[i];s2.v*=.94;s2.d+=s2.v;s2.life-=.035;if(s2.life<=0){S.splice(i,1);continue;}const x0=s2.x+Math.cos(s2.a)*s2.d,y0=s2.y+Math.sin(s2.a)*s2.d,x1=s2.x+Math.cos(s2.a)*(s2.d+8),y1=s2.y+Math.sin(s2.a)*(s2.d+8);x.strokeStyle='rgba(0,224,198,'+s2.life+')';x.lineWidth=2;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
