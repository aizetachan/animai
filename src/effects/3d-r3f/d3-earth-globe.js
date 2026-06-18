import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-earth-globe', title:'Animated Earth', cat:'3D / R3F',
  tags:['earth','tierra','globe','globo','dots','puntos','arcs','arcos','planet'],
  desc:'Globo terráqueo formado por puntos sobre una esfera, rotando, con arcos animados de conexión entre ciudades.',
  meta:['canvas','Sphere','Arcs'],
  prompt:`Crea un globo terráqueo de puntos (dot globe) con arcos de conexión animados, estilo dashboards de "alcance global".
1) Distribuye N puntos uniformemente sobre una esfera con el método fibonacci sphere:
     phi = acos(1 - 2·(i+0.5)/N);  theta = π·(1+√5)·i
     p = (sin φ·cos θ, cos φ, sin φ·sin θ)
2) Rota la esfera sobre el eje Y con un ángulo creciente y proyecta a 2D (ortográfica o perspectiva ligera). Usa la coordenada z proyectada para decidir si el punto está delante (visible, brillante) o detrás (tenue) y para su radio (back-face culling suave).
3) Arcos: para pares de puntos a,b calcula un punto medio elevado mid = normalize(a+b)·1.3 y traza una curva de Bézier cuadrática entre a y mid y b. Un pulso (cabeza luminosa) recorre el arco con t∈[0,1] en bucle.
Colores marca: puntos en #7b5cff, pulsos/arcos en #00e0c6. En R3F real: Points sobre SphereGeometry + líneas QuadraticBezierCurve3 con material animado.`,
  code:`// Dot globe — fibonacci sphere + arcos bézier
const N = 600, pts = [];
for(let i=0;i<N;i++){
  const phi = Math.acos(1 - 2*(i+0.5)/N);
  const theta = Math.PI*(1+Math.sqrt(5))*i;
  pts.push([Math.sin(phi)*Math.cos(theta), Math.cos(phi), Math.sin(phi)*Math.sin(theta)]);
}
// rotar + proyectar
function project(p, rot, cx, cy, R){
  const c=Math.cos(rot), s=Math.sin(rot);
  const x = p[0]*c - p[2]*s, z = p[0]*s + p[2]*c;
  return { x: cx + x*R, y: cy + p[1]*R, z };  // z>0 = frente
}
// arco entre a,b con pulso t
function bezier(a, mid, b, t){
  const u=1-t;
  return [ u*u*a[0]+2*u*t*mid[0]+t*t*b[0],
           u*u*a[1]+2*u*t*mid[1]+t*t*b[1],
           u*u*a[2]+2*u*t*mid[2]+t*t*b[2] ];
}
const mid = norm([(a[0]+b[0]),(a[1]+b[1]),(a[2]+b[2])]).map(v=>v*1.3);`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=520,pts=[];
    for(let i=0;i<N;i++){const phi=Math.acos(1-2*(i+0.5)/N);const th=Math.PI*(1+Math.sqrt(5))*i;pts.push([Math.sin(phi)*Math.cos(th),Math.cos(phi),Math.sin(phi)*Math.sin(th)]);}
    function norm(v){const l=Math.hypot(v[0],v[1],v[2])||1;return [v[0]/l,v[1]/l,v[2]/l];}
    const arcs=[];for(let i=0;i<6;i++){const a=pts[(Math.random()*N)|0],b=pts[(Math.random()*N)|0];const mid=norm([a[0]+b[0],a[1]+b[1],a[2]+b[2]]).map(v=>v*1.32);arcs.push({a,b,mid,t:Math.random()});}
    let rot=0,raf,run=true;
    function proj(p,cx,cy,R){const c=Math.cos(rot),s=Math.sin(rot);const X=p[0]*c-p[2]*s,Z=p[0]*s+p[2]*c;return [cx+X*R,cy+p[1]*R,Z];}
    function bez(a,mid,b,t){const u=1-t;return [u*u*a[0]+2*u*t*mid[0]+t*t*b[0],u*u*a[1]+2*u*t*mid[1]+t*t*b[1],u*u*a[2]+2*u*t*mid[2]+t*t*b[2]];}
    (function loop(){if(!run)return;rot+=0.006;
      const W=o.W(),H=o.H();const g=x.createRadialGradient(W/2,H/2,4,W/2,H/2,Math.max(W,H)*0.7);g.addColorStop(0,'#0b1024');g.addColorStop(1,'#05060f');x.fillStyle=g;x.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.4;
      // glow del planeta
      const gl=x.createRadialGradient(cx,cy,R*0.4,cx,cy,R*1.05);gl.addColorStop(0,'rgba(123,92,255,0.10)');gl.addColorStop(1,'rgba(123,92,255,0)');x.fillStyle=gl;x.beginPath();x.arc(cx,cy,R*1.05,0,6.283);x.fill();
      for(const p of pts){const[px,py,z]=proj(p,cx,cy,R);const front=z>0;const a=front?0.85:0.18;x.fillStyle='rgba(123,92,255,'+a+')';x.beginPath();x.arc(px,py,front?1.5:1,0,6.283);x.fill();}
      for(const A of arcs){A.t+=0.008;if(A.t>1)A.t=0;
        const steps=24;x.strokeStyle='rgba(0,224,198,0.45)';x.lineWidth=1.1;x.beginPath();
        for(let k=0;k<=steps;k++){const tt=k/steps;const pt=bez(A.a,A.mid,A.b,tt);const[px,py]=proj(pt,cx,cy,R);k===0?x.moveTo(px,py):x.lineTo(px,py);}
        x.stroke();
        const hp=bez(A.a,A.mid,A.b,A.t);const[hx,hy]=proj(hp,cx,cy,R);x.fillStyle='#00e0c6';x.beginPath();x.arc(hx,hy,2.6,0,6.283);x.fill();
        x.fillStyle='rgba(0,224,198,0.25)';x.beginPath();x.arc(hx,hy,5,0,6.283);x.fill();
      }
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
