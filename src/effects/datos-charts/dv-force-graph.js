import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-force-graph', title:'Force Graph', cat:'Datos / Charts',
  tags:['force','graph','grafo','red','network','fuerzas','simulación'],
  desc:'Grafo dirigido por fuerzas: los nodos se repelen, las aristas tiran como muelles y la red se asienta. Force-directed graph.',
  meta:['canvas','physics','Viz'],
  prompt:`Crea un grafo dirigido por fuerzas (force-directed): nodos conectados por aristas que se posicionan mediante una simulación física.
Estructura: nodes [{x,y,vx,vy}], links [{a,b}]. Fuerzas en cada frame:
1) Repulsión entre todos los pares (tipo Coulomb, ~1/d^2) para que no se solapen.
2) Atracción por muelle en cada arista (ley de Hooke) hacia una longitud de reposo.
3) Gravedad suave hacia el centro para mantener el grafo compacto.
Aplica amortiguación (damping) a las velocidades; el sistema se asienta y queda estable. Reinicia en bucle desde posiciones aleatorias para la demo.
Uso: visualizar relaciones, dependencias o redes sociales.`,
  code:`// Force-directed: repulsión + muelles + gravedad
for(const a of nodes){
  for(const b of nodes){ if(a===b) continue
    const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy)||1
    const f = REPEL/(d*d)              // Coulomb
    a.vx += dx/d*f; a.vy += dy/d*f
  }
}
for(const l of links){                 // muelle (Hooke)
  const a=nodes[l.a], b=nodes[l.b]
  const dx=b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy)||1
  const f=(d-REST)*SPRING
  a.vx+=dx/d*f; a.vy+=dy/d*f; b.vx-=dx/d*f; b.vy-=dy/d*f
}
for(const n of nodes){ n.vx*=DAMP; n.vy*=DAMP; n.x+=n.vx; n.y+=n.vy }`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=16;let nodes=[],links=[];
    function build(){
      const W=o.W(),H=o.H();
      nodes=[];for(let i=0;i<N;i++)nodes.push({x:W/2+(Math.random()-.5)*40,y:H/2+(Math.random()-.5)*40,vx:0,vy:0,r:3+Math.random()*3});
      links=[];
      // árbol base para que esté conectado
      for(let i=1;i<N;i++)links.push({a:i,b:Math.floor(Math.random()*i)});
      // unas pocas aristas extra
      for(let k=0;k<4;k++)links.push({a:Math.floor(Math.random()*N),b:Math.floor(Math.random()*N)});
    }
    build();
    let raf,run=true,frame=0;
    const REPEL=900,SPRING=0.02,REST=46,DAMP=0.86,GRAV=0.012;
    (function loop(){if(!run)return;
      const W=o.W(),H=o.H();
      // física
      for(let i=0;i<N;i++){const a=nodes[i];for(let j=0;j<N;j++){if(i===j)continue;const b=nodes[j];let dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy)||1;const f=REPEL/(d*d);a.vx+=dx/d*f;a.vy+=dy/d*f;}}
      for(const l of links){const a=nodes[l.a],b=nodes[l.b];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;const f=(d-REST)*SPRING;a.vx+=dx/d*f;a.vy+=dy/d*f;b.vx-=dx/d*f;b.vy-=dy/d*f;}
      for(const n of nodes){n.vx+=(W/2-n.x)*GRAV;n.vy+=(H/2-n.y)*GRAV;n.vx*=DAMP;n.vy*=DAMP;n.x+=n.vx;n.y+=n.vy;n.x=Math.max(8,Math.min(W-8,n.x));n.y=Math.max(8,Math.min(H-8,n.y));}
      // dibujo
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      x.strokeStyle='rgba(123,92,255,0.45)';x.lineWidth=1;
      for(const l of links){const a=nodes[l.a],b=nodes[l.b];x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}
      for(const n of nodes){const g=x.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*2.2);g.addColorStop(0,'#00e0c6');g.addColorStop(1,'rgba(0,224,198,0)');x.fillStyle=g;x.beginPath();x.arc(n.x,n.y,n.r*2.2,0,6.28);x.fill();x.fillStyle='#cfeeea';x.beginPath();x.arc(n.x,n.y,n.r,0,6.28);x.fill();}
      frame++;if(frame>320){frame=0;build();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
