import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'dv-hexbin', title:'Hexbin Density', cat:'Datos / Charts',
  tags:['hexbin','densidad','density','hexágonos','hexagons','binning','scatter','六边形'],
  desc:'Agrupa puntos dispersos en celdas hexagonales y colorea cada celda según cuántos puntos contiene.',
  meta:['canvas','density','Viz'],
  prompt:`Crea un "hexbin" de densidad en canvas 2D: parte de una nube de puntos (x,y) y agrégalos en una rejilla de hexágonos.
Algoritmo: define un radio de hexágono R. Para cada punto, calcula a qué celda hexagonal pertenece (rejilla offset: columnas separadas por 1.5*R en x, filas por sqrt(3)*R en y, con desplazamiento medio en columnas impares) y elige el hexágono cuyo centro esté más cerca. Cuenta los puntos por celda y mapea el conteo a un color de una rampa (de oscuro a #7b5cff/#00e0c6) y/o a una escala de tamaño.
Animación: revela los hexágonos con un stagger radial desde el centro y deja pulsar suavemente la opacidad; reinicia en bucle con una nube nueva.
Útil para densidad de scatter plots grandes, mapas de calor hexagonales, geo-binning.`,
  code:`// Hexbin — agrega puntos en celdas hexagonales y colorea por conteo (D3-style)
const R = 14, dx = R*1.5, dy = R*Math.sqrt(3)
const bins = new Map()
for (const p of points){
  let col = Math.round(p.x/dx)
  let row = Math.round((p.y - (col%2? dy/2:0))/dy)
  const key = col+','+row
  const b = bins.get(key) || {col,row,n:0}
  b.n++; bins.set(key,b)
}
const max = Math.max(...[...bins.values()].map(b=>b.n))
for (const b of bins.values()){
  const t = b.n/max
  drawHex(b.col*dx, b.row*dy + (b.col%2? dy/2:0), R, ramp(t))
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const R=11,dx=R*1.5,dy=R*Math.sqrt(3);
    let bins=[],maxN=1,cx=0,cy=0;
    function ramp(t){
      // dark -> #7b5cff -> #00e0c6
      const a=[20,18,40],b=[123,92,255],c=[0,224,198];
      let r,g,bl;
      if(t<.5){const k=t/.5;r=a[0]+(b[0]-a[0])*k;g=a[1]+(b[1]-a[1])*k;bl=a[2]+(b[2]-a[2])*k;}
      else{const k=(t-.5)/.5;r=b[0]+(c[0]-b[0])*k;g=b[1]+(c[1]-b[1])*k;bl=b[2]+(c[2]-b[2])*k;}
      return 'rgb('+(r|0)+','+(g|0)+','+(bl|0)+')';
    }
    function build(){
      const W=o.W(),H=o.H();cx=W/2;cy=H/2;
      const map=new Map();
      // cluster gaussian cloud
      const clusters=[[W*.4,H*.45],[W*.62,H*.55],[W*.5,H*.5]];
      const pts=[];
      for(let i=0;i<900;i++){
        const cl=clusters[i%clusters.length];
        const ang=Math.random()*6.283,rad=Math.abs(gauss())* (W*.16);
        pts.push([cl[0]+Math.cos(ang)*rad,cl[1]+Math.sin(ang)*rad]);
      }
      for(const[px,py]of pts){
        let col=Math.round(px/dx);
        let row=Math.round((py-(col&1?dy/2:0))/dy);
        const key=col+','+row;
        const b=map.get(key)||{col,row,n:0};b.n++;map.set(key,b);
      }
      bins=[...map.values()];maxN=1;
      bins.forEach(b=>{b.x=b.col*dx;b.y=b.row*dy+(b.col&1?dy/2:0);b.d=Math.hypot(b.x-cx,b.y-cy);if(b.n>maxN)maxN=b.n;});
    }
    function gauss(){let u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(6.283*v)*.4;}
    function hex(px,py,r){x.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i;const hx=px+r*Math.cos(a),hy=py+r*Math.sin(a);i?x.lineTo(hx,hy):x.moveTo(hx,hy);}x.closePath();}
    build();let t=0,raf,run=true,hold=0;
    (function loop(){if(!run)return;
      if(hold>0)hold--;else{t+=1;if(t>180){t=0;hold=30;build();}}
      x.fillStyle='#0a0a14';x.fillRect(0,0,o.W(),o.H());
      const maxD=Math.hypot(o.W(),o.H())/2;
      bins.forEach(b=>{
        const appear=Math.max(0,Math.min(1,(t*4-b.d)/30));
        if(appear<=.02)return;
        const tn=b.n/maxN;
        const pulse=.85+.15*Math.sin(t*.06+b.d*.05);
        x.globalAlpha=appear;
        x.fillStyle=ramp(tn);
        const sz=R*(.45+.55*tn)*appear;
        hex(b.x,b.y,sz);x.fill();
        x.globalAlpha=appear*.25*pulse;
        x.strokeStyle='#00e0c6';x.lineWidth=.5;hex(b.x,b.y,sz);x.stroke();
      });
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
