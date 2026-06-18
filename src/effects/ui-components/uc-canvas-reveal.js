import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-canvas-reveal', title:'Canvas Reveal', cat:'UI Components',
  tags:['canvas','reveal','dots','rejilla','puntos','aceternity','hover'],
  desc:'Rejilla de puntos de colores que aparece desde el cursor con una onda expansiva. El Canvas Reveal de Aceternity.',
  meta:['Aceternity UI','canvas','Rejilla de puntos'],
  prompt:`Recrea el Canvas Reveal Effect de Aceternity: una rejilla regular de puntos (dots) que aparecen al pasar el cursor, propagándose como una onda desde el punto de entrada.
Técnica: dibuja una rejilla en canvas con celdas de ~14px. Cada punto tiene una distancia al origen del cursor; su opacidad/escala depende de un frente de onda (radio creciente) menos esa distancia, con un leve jitter aleatorio por celda para que el reveal no sea perfectamente uniforme. Colores alternados de la marca (#7b5cff, #00e0c6).
Cuando no hay cursor, simula un punto de origen que recorre la caja para mostrar el ciclo completo (aparición y desvanecimiento). Limpia el canvas con un fondo oscuro casi opaco cada frame.`,
  code:`// Aceternity UI — Canvas Reveal Effect (canvas)
// Rejilla de puntos revelada por una onda desde el cursor
const cell = 14
for (let gx = 0; gx < cols; gx++) for (let gy = 0; gy < rows; gy++) {
  const px = gx*cell, py = gy*cell
  const d = Math.hypot(px - originX, py - originY)
  const reveal = Math.max(0, 1 - Math.abs(wave - d) / 60) // frente de onda
  const a = reveal * (0.6 + 0.4*jitter[gx][gy])
  ctx.fillStyle = (gx+gy)%2 ? '#7b5cff' : '#00e0c6'
  ctx.globalAlpha = a
  ctx.fillRect(px, py, 2.4, 2.4)
}
wave += 4 // radio creciente`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const cell=13;let jit=[];
    function buildJit(){jit=[];const cols=Math.ceil(o.W()/cell)+1,rows=Math.ceil(o.H()/cell)+1;for(let i=0;i<cols;i++){jit[i]=[];for(let j=0;j<rows;j++)jit[i][j]=Math.random();}}
    buildJit();
    let raf,run=true,t=0,ox=o.W()*.5,oy=o.H()*.5,wave=0,pulse=0;
    function loop(){if(!run)return;t+=1;pulse+=1;
      // ciclo simulado: nuevo origen cada ~150 frames, onda crece y reaparece
      if(pulse>150){pulse=0;ox=o.W()*(.2+Math.random()*.6);oy=o.H()*(.2+Math.random()*.6);}
      wave=pulse*3.2;
      x.fillStyle='#070710';x.fillRect(0,0,o.W(),o.H());
      const cols=Math.ceil(o.W()/cell)+1,rows=Math.ceil(o.H()/cell)+1;
      for(let gx=0;gx<cols;gx++)for(let gy=0;gy<rows;gy++){
        const px=gx*cell+cell*.5,py=gy*cell+cell*.5;
        const d=Math.hypot(px-ox,py-oy);
        const front=Math.max(0,1-Math.abs(wave-d)/70);
        const trail=Math.max(0,Math.min(1,(wave-d)/90));
        const a=Math.max(front,trail*.5)*(0.55+0.45*(jit[gx]?jit[gx][gy]||0:0));
        if(a<=0.02)continue;
        x.globalAlpha=Math.min(1,a);
        x.fillStyle=(gx+gy)%2?'#7b5cff':'#00e0c6';
        const sz=2.4+a*1.2;
        x.fillRect(px-sz/2,py-sz/2,sz,sz);
      }
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);
    }
    loop();
    const reJit=new ResizeObserver(buildJit);reJit.observe(el);
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();reJit.disconnect();el.innerHTML='';}};
  }
};
export default effect;
