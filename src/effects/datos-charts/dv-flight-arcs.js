import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-flight-arcs', title:'Flight Arcs', cat:'Datos / Charts',
  tags:['flight arcs','飞线','arcos','vuelos','rutas','routes','map','migración','flows'],
  desc:'Arcos animados que viajan entre puntos sobre un mapa abstracto, como rutas de vuelo (飞线).',
  meta:['canvas','flows','Viz'],
  prompt:`Crea "flight arcs" / líneas voladoras (飞线) en canvas 2D sobre un mapa abstracto: nodos (ciudades) como puntos pulsantes y rutas como arcos curvos entre pares de nodos.
Algoritmo: para cada ruta origen->destino, calcula un arco cuadrático con un punto de control elevado en la perpendicular del segmento (la altura escala con la distancia). Anima un "cometa" que recorre el arco interpolando puntos de la curva de Bézier (parámetro p de 0..1) con una cola que se desvanece (gradiente). Cuando una partícula llega al destino, emite un anillo (ripple) y reaparece en el origen tras un retardo.
Dibuja el arco completo tenue de fondo y la cabeza brillante encima. Mantén los nodos con un glow pulsante. Útil para mapas de tráfico, migraciones, conexiones de red, dashboards geo.`,
  code:`// Flight arcs (飞线) — cometa que recorre un arco de Bézier cuadrático
function bez(a, ctrl, b, p){
  const m = 1-p
  return { x: m*m*a.x + 2*m*p*ctrl.x + p*p*b.x,
           y: m*m*a.y + 2*m*p*ctrl.y + p*p*b.y }
}
routes.forEach(rt => {
  const mid = { x:(rt.a.x+rt.b.x)/2, y:(rt.a.y+rt.b.y)/2 }
  const d = dist(rt.a, rt.b)
  const ctrl = { x: mid.x + nx*d*0.3, y: mid.y + ny*d*0.3 } // control elevado
  const head = bez(rt.a, ctrl, rt.b, rt.p)                  // posición del cometa
  drawTrail(rt, ctrl, rt.p)                                 // cola con gradiente
  if ((rt.p += rt.speed) > 1){ rt.p = 0; ripple(rt.b) }     // reaparece + ripple
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    let nodes=[],routes=[],ripples=[];
    function build(){
      const W=o.W(),H=o.H();
      nodes=[];const N=7;
      for(let i=0;i<N;i++)nodes.push({x:18+Math.random()*(W-36),y:18+Math.random()*(H-36),ph:Math.random()*6.28});
      routes=[];
      for(let i=0;i<8;i++){
        const a=nodes[(Math.random()*N)|0];let b=nodes[(Math.random()*N)|0];
        if(a===b)continue;
        routes.push({a,b,p:-Math.random(),speed:.004+Math.random()*.006});
      }
      ripples=[];
    }
    function bez(a,c,b,p){const m=1-p;return{x:m*m*a.x+2*m*p*c.x+p*p*b.x,y:m*m*a.y+2*m*p*c.y+p*p*b.y};}
    function ctrlOf(rt){
      const mx=(rt.a.x+rt.b.x)/2,my=(rt.a.y+rt.b.y)/2;
      const dx=rt.b.x-rt.a.x,dy=rt.b.y-rt.a.y,d=Math.hypot(dx,dy)||1;
      const nx=-dy/d,ny=dx/d;const lift=d*.35;
      return{x:mx+nx*lift,y:my+ny*lift};
    }
    build();let t=0,raf,run=true,rebuild=0;
    (function loop(){if(!run)return;t+=1;rebuild++;if(rebuild>900){rebuild=0;build();}
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);
      // grid sutil tipo mapa abstracto
      x.strokeStyle='rgba(123,92,255,0.06)';x.lineWidth=1;
      for(let gx=0;gx<W;gx+=22){x.beginPath();x.moveTo(gx,0);x.lineTo(gx,H);x.stroke();}
      for(let gy=0;gy<H;gy+=22){x.beginPath();x.moveTo(0,gy);x.lineTo(W,gy);x.stroke();}
      // arcos
      routes.forEach(rt=>{
        const c=ctrlOf(rt);
        // arco de fondo tenue
        x.strokeStyle='rgba(0,224,198,0.12)';x.lineWidth=1;
        x.beginPath();x.moveTo(rt.a.x,rt.a.y);x.quadraticCurveTo(c.x,c.y,rt.b.x,rt.b.y);x.stroke();
        // avanzar cometa
        rt.p+=rt.speed;
        if(rt.p>1){rt.p=-Math.random()*.3;ripples.push({x:rt.b.x,y:rt.b.y,r:2,a:1});}
        if(rt.p<0)return;
        const p=rt.p;
        // cola: dibuja segmentos hacia atrás con alpha decreciente
        x.globalCompositeOperation='lighter';
        const tail=14;
        for(let i=0;i<tail;i++){
          const pp=p-i*.018;if(pp<0)break;
          const a1=bez(rt.a,c,rt.b,pp),a2=bez(rt.a,c,rt.b,Math.max(0,pp-.018));
          const al=(1-i/tail);
          x.strokeStyle='rgba(123,92,255,'+(al*.9)+')';x.lineWidth=2*al+.4;
          x.beginPath();x.moveTo(a1.x,a1.y);x.lineTo(a2.x,a2.y);x.stroke();
        }
        // cabeza brillante
        const head=bez(rt.a,c,rt.b,p);
        const g=x.createRadialGradient(head.x,head.y,0,head.x,head.y,5);
        g.addColorStop(0,'rgba(0,224,198,1)');g.addColorStop(1,'rgba(0,224,198,0)');
        x.fillStyle=g;x.beginPath();x.arc(head.x,head.y,5,0,6.28);x.fill();
        x.globalCompositeOperation='source-over';
      });
      // ripples al llegar
      ripples=ripples.filter(rp=>rp.a>0);
      ripples.forEach(rp=>{rp.r+=.7;rp.a-=.03;x.strokeStyle='rgba(0,224,198,'+rp.a+')';x.lineWidth=1.2;x.beginPath();x.arc(rp.x,rp.y,rp.r,0,6.28);x.stroke();});
      // nodos
      nodes.forEach(n=>{
        const pulse=.5+.5*Math.sin(t*.06+n.ph);
        const g=x.createRadialGradient(n.x,n.y,0,n.x,n.y,8);
        g.addColorStop(0,'rgba(123,92,255,'+(.5+.5*pulse)+')');g.addColorStop(1,'rgba(123,92,255,0)');
        x.fillStyle=g;x.beginPath();x.arc(n.x,n.y,8,0,6.28);x.fill();
        x.fillStyle='#e7e3ff';x.beginPath();x.arc(n.x,n.y,2,0,6.28);x.fill();
      });
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
