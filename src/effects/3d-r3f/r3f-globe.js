import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'r3f-globe', title:'Wireframe Globe', cat:'3D / R3F',
  tags:['globe','globo','mundo','arcs','conexiones','mapa','tierra'],
  desc:'Globo de puntos con arcos animados entre ciudades. El "world map" de conexiones global.',
  meta:['Points','arcs','Mundo'],
  prompt:`Crea un globo terráqueo de puntos con arcos animados entre ubicaciones (estilo GitHub/Stripe globe).
Distribuye puntos sobre una esfera; rota el globo; dibuja arcos (curvas que se elevan sobre la superficie) entre pares de puntos con un pulso de luz que los recorre.
Para secciones de "alcance global", redes, infra. Da sensación de producto mundial.`,
  code:`// Wireframe globe + arcs (concepto)
// 1) puntos en esfera (fibonacci sphere), 2) rotar, 3) arcos:
function arc(a, b, t) {        // a,b puntos en la esfera, t=0..1
  const mid = a.clone().lerp(b, 0.5).multiplyScalar(1.3)  // elevar
  return quadraticBezier(a, mid, b, t)
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const N=140,pts=[];for(let i=0;i<N;i++){const ph=Math.acos(1-2*(i+.5)/N),th=Math.PI*(1+Math.sqrt(5))*i;pts.push([Math.sin(ph)*Math.cos(th),Math.cos(ph),Math.sin(ph)*Math.sin(th)]);}
    const arcs=[];for(let i=0;i<5;i++)arcs.push({a:pts[(Math.random()*N)|0],b:pts[(Math.random()*N)|0],t:Math.random()});
    let rot=0,raf,run=true;
    function proj(p,cx,cy,sc){const c=Math.cos(rot),s=Math.sin(rot);const xx=p[0]*c-p[2]*s,zz=p[0]*s+p[2]*c;return[cx+xx*sc,cy+p[1]*sc,zz];}
    (function loop(){if(!run)return;rot+=.006;x.fillStyle='#0a0a16';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2,sc=Math.min(o.W(),o.H())*.34;
      pts.forEach(p=>{const[px,py,zz]=proj(p,cx,cy,sc);const a=zz>0?.9:.25;x.fillStyle='rgba(123,92,255,'+a+')';x.beginPath();x.arc(px,py,zz>0?1.6:1,0,6.28);x.fill();});
      arcs.forEach(A=>{A.t+=.01;if(A.t>1)A.t=0;const steps=20;x.strokeStyle='rgba(0,224,198,.5)';x.lineWidth=1.2;x.beginPath();for(let k=0;k<=steps;k++){const tt=k/steps;const mid=[(A.a[0]+A.b[0])/2*1.4,(A.a[1]+A.b[1])/2*1.4,(A.a[2]+A.b[2])/2*1.4];const q=(u,p0,p1,p2)=>(1-u)*(1-u)*p0+2*(1-u)*u*p1+u*u*p2;const pt=[q(tt,A.a[0],mid[0],A.b[0]),q(tt,A.a[1],mid[1],A.b[1]),q(tt,A.a[2],mid[2],A.b[2])];const[px,py]=proj(pt,cx,cy,sc);k===0?x.moveTo(px,py):x.lineTo(px,py);}x.stroke();
        const mid=[(A.a[0]+A.b[0])/2*1.4,(A.a[1]+A.b[1])/2*1.4,(A.a[2]+A.b[2])/2*1.4];const q=(u,p0,p1,p2)=>(1-u)*(1-u)*p0+2*(1-u)*u*p1+u*u*p2;const hp=[q(A.t,A.a[0],mid[0],A.b[0]),q(A.t,A.a[1],mid[1],A.b[1]),q(A.t,A.a[2],mid[2],A.b[2])];const[hx,hy]=proj(hp,cx,cy,sc);x.fillStyle='#00e0c6';x.beginPath();x.arc(hx,hy,2.5,0,6.28);x.fill();});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
