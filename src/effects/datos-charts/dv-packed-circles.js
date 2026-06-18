import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-packed-circles', title:'Packed Circles', cat:'Datos / Charts',
  tags:['packed circles','círculos empaquetados','气泡图','jerarquía','hierarchy','viz','d3'],
  desc:'Círculos empaquetados jerárquicos que se acomodan animando posición y radio.',
  meta:['canvas','pack','Viz'],
  prompt:`Crea un diagrama de círculos empaquetados (circle packing) en canvas 2D.
Estructura de datos: lista de nodos con {value}. El radio se deriva de sqrt(value) (área proporcional al valor).
Layout: relajación física simple. Inicializa cada círculo en una posición aleatoria cercana al centro. En cada frame aplica: (1) atracción suave hacia el centro, (2) resolución de colisiones empujando pares solapados a lo largo de su eje hasta que la distancia >= r1+r2. Itera para que el sistema se asiente (settle). Esto reproduce el "acomodo" del pack de D3 sin dependencias.
Animación: los círculos parten dispersos y convergen acomodándose; cada uno con color por valor (interpolado entre tonos de marca) y un valor de texto centrado. En bucle: reinicia posiciones cada cierto tiempo para re-demostrar el acomodo.
Para mostrar proporciones, categorías y datos jerárquicos.`,
  code:`// Packed circles — relajación por colisiones (Canvas 2D)
const nodes = data.map(d => ({ r: Math.sqrt(d.value)*k, x: cx+rnd(), y: cy+rnd() }));
function tick(){
  nodes.forEach(n => { n.x += (cx-n.x)*0.01; n.y += (cy-n.y)*0.01; }); // atracción al centro
  for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
    const a=nodes[i], b=nodes[j], dx=b.x-a.x, dy=b.y-a.y;
    const d=Math.hypot(dx,dy)||0.01, min=a.r+b.r+1;
    if(d<min){ const o=(min-d)/2, ux=dx/d, uy=dy/d;
      a.x-=ux*o; a.y-=uy*o; b.x+=ux*o; b.y+=uy*o; }
  }
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const DATA=[40,28,22,18,15,12,10,9,7,6,5,4];
    let nodes=[],raf,run=true,t=0;
    function lerpColor(a,b,k){return a.map((v,i)=>Math.round(v+(b[i]-v)*k));}
    const C1=[123,92,255],C2=[0,224,198];
    function init(){
      const cx=o.W()/2,cy=o.H()/2;const mx=Math.max(...DATA),mn=Math.min(...DATA);
      const k=(Math.min(o.W(),o.H())*.085)/Math.sqrt(mx);
      nodes=DATA.map(v=>{
        const kk=(v-mn)/(mx-mn||1);
        return {v,r:Math.max(7,Math.sqrt(v)*k),x:cx+(Math.random()-.5)*40,y:cy+(Math.random()-.5)*40,col:lerpColor(C2,C1,kk)};
      });
    }
    init();const ro2=new ResizeObserver(()=>{t=0;init();});ro2.observe(el);
    function tick(){
      const cx=o.W()/2,cy=o.H()/2;
      nodes.forEach(n=>{n.x+=(cx-n.x)*0.012;n.y+=(cy-n.y)*0.012;});
      for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j],dx=b.x-a.x,dy=b.y-a.y;
        const d=Math.hypot(dx,dy)||0.01,min=a.r+b.r+1.5;
        if(d<min){const ov=(min-d)/2,ux=dx/d,uy=dy/d;a.x-=ux*ov;a.y-=uy*ov;b.x+=ux*ov;b.y+=uy*ov;}
      }
      nodes.forEach(n=>{n.x=Math.max(n.r+1,Math.min(o.W()-n.r-1,n.x));n.y=Math.max(n.r+1,Math.min(o.H()-n.r-1,n.y));});
    }
    (function loop(){if(!run)return;
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      t++;tick();
      nodes.forEach(n=>{
        x.beginPath();x.arc(n.x,n.y,n.r,0,6.283);
        x.fillStyle='rgba('+n.col[0]+','+n.col[1]+','+n.col[2]+',.22)';x.fill();
        x.lineWidth=1.5;x.strokeStyle='rgb('+n.col[0]+','+n.col[1]+','+n.col[2]+')';x.stroke();
        if(n.r>11){x.fillStyle='#e8e8f0';x.font='600 '+Math.min(13,n.r*.55).toFixed(0)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(n.v,n.x,n.y);}
      });
      x.textAlign='start';
      if(t>240){t=0;init();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();ro2.disconnect();el.innerHTML='';}};
  }
};
export default effect;
