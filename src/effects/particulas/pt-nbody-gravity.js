import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pt-nbody-gravity', title:'N-Body Gravity', cat:'Partículas',
  tags:['n-body','gravity','gravedad','órbitas','física','attractor','simulación'],
  desc:'Partículas con atracción gravitatoria mutua que orbitan y se enredan en danzas caóticas.',
  meta:['Canvas 2D','física','n-body'],
  prompt:`Simula una gravedad de N cuerpos en canvas 2D: cada partícula atrae a todas las demás según la ley de Newton F = G·m1·m2/r².
Para cada par (i,j) calcula el vector de distancia d = pos_j - pos_i, la distancia r = |d|, y aplica una aceleración a_i += G·m_j·d / (r² + ε)^{1.5} (softening ε evita singularidades cuando r→0). Integra velocidad y posición (Euler semi-implícito). Aplica un pequeño damping y rebote en bordes o wrap.
Dibuja estelas con un fade de fondo translúcido para ver las órbitas. Marca: #7b5cff / #00e0c6.`,
  code:`// N-Body — atracción mutua O(n²), softening, estelas
const G=0.6, EPS=140; // softening evita fuerzas infinitas
for(let i=0;i<P.length;i++){let ax=0,ay=0;
  for(let j=0;j<P.length;j++){ if(i===j) continue;
    const dx=P[j].x-P[i].x, dy=P[j].y-P[i].y;
    const r2=dx*dx+dy*dy+EPS;
    const inv=G*P[j].m/(r2*Math.sqrt(r2)); // 1/(r²+ε)^1.5
    ax+=dx*inv; ay+=dy*inv;
  }
  P[i].vx=(P[i].vx+ax)*0.999; P[i].vy=(P[i].vy+ay)*0.999;
}
P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; });`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=22, P=[]; const cx=o.W()/2, cy=o.H()/2;
    for(let i=0;i<N;i++){
      const a=Math.random()*6.283, rr=20+Math.random()*70;
      const px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr;
      // velocidad tangencial inicial para orbitar
      const sp=0.5+Math.random()*0.6;
      P.push({x:px,y:py,vx:-Math.sin(a)*sp,vy:Math.cos(a)*sp,m:0.8+Math.random()*1.6,hue:i%2?260:172});
    }
    const G=0.55,EPS=130;let raf,run=true;
    x.fillStyle='#06060f';x.fillRect(0,0,o.W(),o.H());
    (function loop(){if(!run)return;
      x.fillStyle='rgba(6,6,15,.16)';x.fillRect(0,0,o.W(),o.H());
      for(let i=0;i<N;i++){let ax=0,ay=0;
        for(let j=0;j<N;j++){if(i===j)continue;
          const dx=P[j].x-P[i].x,dy=P[j].y-P[i].y;
          const r2=dx*dx+dy*dy+EPS;
          const inv=G*P[j].m/(r2*Math.sqrt(r2));
          ax+=dx*inv;ay+=dy*inv;}
        P[i].vx=(P[i].vx+ax)*0.9995;P[i].vy=(P[i].vy+ay)*0.9995;}
      x.globalCompositeOperation='lighter';
      const W=o.W(),H=o.H();
      P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;
        if(p.x<-20)p.x=W+20;if(p.x>W+20)p.x=-20;if(p.y<-20)p.y=H+20;if(p.y>H+20)p.y=-20;
        const r=1.6+p.m*1.4;
        const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,r*3);
        const c=p.hue===260?'123,92,255':'0,224,198';
        g.addColorStop(0,'rgba('+c+',.9)');g.addColorStop(1,'rgba('+c+',0)');
        x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,r*3,0,6.283);x.fill();
        x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(p.x,p.y,r*0.5,0,6.283);x.fill();});
      x.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
