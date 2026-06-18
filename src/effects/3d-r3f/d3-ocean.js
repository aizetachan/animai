import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'d3-ocean', title:'Gerstner Ocean', cat:'3D / R3F',
  tags:['ocean','océano','gerstner','olas','waves','malla','wireframe','agua'],
  desc:'Malla de océano deformada por olas de Gerstner que desplazan los vértices en círculos. El mar animado clásico.',
  meta:['canvas','Gerstner','Mesh'],
  prompt:`Crea una malla de océano animada con olas de Gerstner. A diferencia de un seno simple (que solo sube/baja), Gerstner desplaza cada vértice también en horizontal describiendo círculos, formando crestas afiladas y valles anchos realistas.
Para cada ola i con dirección D=(Dx,Dz), número de onda k=2π/λ, frecuencia ω=√(g·k), amplitud A y fase φ=k·(D·pos)-ω·t+offset:
  x += (Dx) · A · cos(φ)
  z += (Dz) · A · cos(φ)
  y  += A · sin(φ)
Suma 3-4 olas con distinta dirección, longitud y amplitud (espectro). Proyecta la grilla en perspectiva isométrica/cámara baja y dibuja como wireframe o malla rellena con sombreado según la altura y la normal aproximada.
Parámetros: tamaño de grilla (~30x30), gravedad g=9.8, amplitudes decrecientes, velocidad de tiempo ~0.6. En R3F real se haría con un ShaderMaterial vertex que aplica estas fórmulas a una PlaneGeometry subdividida.`,
  code:`// Gerstner waves — desplazamiento del vértice (suma de olas)
const waves = [
  { dir:[1,0],      amp:0.22, len:3.0, steep:0.8, off:0.0 },
  { dir:[0.6,0.8],  amp:0.14, len:1.7, steep:0.7, off:2.1 },
  { dir:[-0.7,0.4], amp:0.08, len:0.9, steep:0.6, off:4.3 },
];
function gerstner(px, pz, t){
  let x=px, z=pz, y=0, g=9.8;
  for(const w of waves){
    const k = 2*Math.PI / w.len;
    const omega = Math.sqrt(g * k);
    const dx=w.dir[0], dz=w.dir[1];
    const phase = k*(dx*px + dz*pz) - omega*t + w.off;
    const c = Math.cos(phase), s = Math.sin(phase);
    const Q = w.steep / (k * w.amp * waves.length); // limita pellizco
    x += Q * w.amp * dx * c;
    z += Q * w.amp * dz * c;
    y += w.amp * s;
  }
  return [x, y, z];
}
// En R3F: PlaneGeometry(10,10,128,128) + ShaderMaterial replicando esta suma en el vertex shader.`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const N=26, S=2.4;
    const waves=[
      {dir:[1,0],amp:0.22,len:3.0,off:0.0},
      {dir:[0.6,0.8],amp:0.14,len:1.7,off:2.1},
      {dir:[-0.7,0.4],amp:0.09,len:0.9,off:4.3}
    ];
    function gerstner(px,pz,t){let X=px,Z=pz,Y=0,g=9.8;for(const w of waves){const k=2*Math.PI/w.len;const om=Math.sqrt(g*k);const c=Math.cos(k*(w.dir[0]*px+w.dir[1]*pz)-om*t+w.off);const s=Math.sin(k*(w.dir[0]*px+w.dir[1]*pz)-om*t+w.off);const Q=0.7/(k*w.amp*waves.length);X+=Q*w.amp*w.dir[0]*c;Z+=Q*w.amp*w.dir[1]*c;Y+=w.amp*s;}return[X,Y,Z];}
    let t=0,raf,run=true;
    const tilt=0.55, sc0=1.0;
    function proj(X,Y,Z,cx,cy,sc){const sx=cx+X*sc;const sy=cy + (Z*Math.cos(tilt)-Y*Math.sin(tilt))*sc - Y*sc*0.6; return [sx,sy,Y];}
    (function loop(){if(!run)return;t+=0.016;
      const W=o.W(),H=o.H();const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#070b18');g.addColorStop(1,'#0a1226');x.fillStyle=g;x.fillRect(0,0,W,H);
      const cx=W/2,cy=H*0.42,sc=Math.min(W,H)/(S*2.1);
      for(let j=0;j<N-1;j++){
        for(let i=0;i<N-1;i++){
          const gx=(i/(N-1)-0.5)*S, gz=(j/(N-1)-0.5)*S;
          const gx2=((i+1)/(N-1)-0.5)*S, gz2=((j+1)/(N-1)-0.5)*S;
          const a=gerstner(gx,gz,t), b=gerstner(gx2,gz,t), c=gerstner(gx2,gz2,t), d=gerstner(gx,gz2,t);
          const pa=proj(a[0],a[1],a[2],cx,cy,sc),pb=proj(b[0],b[1],b[2],cx,cy,sc),pc=proj(c[0],c[1],c[2],cx,cy,sc),pd=proj(d[0],d[1],d[2],cx,cy,sc);
          const h=(a[1]+b[1]+c[1]+d[1])/4;const lt=Math.max(0,Math.min(1,(h+0.35)/0.7));
          const r=Math.round(20+lt*100),gg=Math.round(90+lt*150),bl=Math.round(150+lt*100);
          x.fillStyle='rgba('+r+','+gg+','+bl+',0.85)';
          x.beginPath();x.moveTo(pa[0],pa[1]);x.lineTo(pb[0],pb[1]);x.lineTo(pc[0],pc[1]);x.lineTo(pd[0],pd[1]);x.closePath();x.fill();
          x.strokeStyle='rgba(0,224,198,'+(0.05+lt*0.18)+')';x.lineWidth=0.6;x.stroke();
        }
      }
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
