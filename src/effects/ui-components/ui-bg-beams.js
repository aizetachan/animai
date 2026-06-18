import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'ui-bg-beams', title:'Background Beams', cat:'UI Components',
  tags:['beams','rayos','líneas','fondo','aceternity','svg','gradiente'],
  desc:'Haces de luz curvos que recorren caminos SVG en el fondo. Los Background Beams de Aceternity.',
  meta:['Aceternity UI','SVG path','Gradiente'],
  prompt:`Recrea los Background Beams de Aceternity: múltiples caminos SVG curvos en el fondo por los que viaja un gradiente luminoso (como impulsos de luz).
Cada path tiene un gradiente lineal animado (offset que se mueve) que crea el "beam" recorriéndolo. Posiciones y velocidades ligeramente distintas.
Sobre fondo oscuro. Estética conexión/datos/IA.`,
  code:`// Aceternity UI — Background Beams (SVG + Framer Motion)
// Cada beam = un <motion.path> con gradiente animado a lo largo del trazo
<motion.path d={path} stroke="url(#beamGradient)" strokeWidth="1.5" />
<motion.linearGradient id="beamGradient"
  animate={{ x1: ['0%','100%'], x2: ['10%','110%'] }}
  transition={{ duration: 3, repeat: Infinity }}>
  <stop stopColor="#7b5cff" stopOpacity="0" />
  <stop stopColor="#7b5cff" />
  <stop offset="1" stopColor="#00e0c6" stopOpacity="0" />
</motion.linearGradient>`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const paths=[];for(let i=0;i<7;i++)paths.push({x:o.W()*(.1+i*.13),phase:Math.random(),sp:.004+Math.random()*.004});
    let t=0,raf,run=true;
    (function loop(){if(!run)return;t+=1;x.fillStyle='#08080f';x.fillRect(0,0,o.W(),o.H());
      paths.forEach(p=>{x.strokeStyle='rgba(123,92,255,.12)';x.lineWidth=1;x.beginPath();for(let yy=0;yy<=o.H();yy+=6){const xx=p.x+Math.sin(yy*.02+p.phase*6)*20;yy===0?x.moveTo(xx,yy):x.lineTo(xx,yy);}x.stroke();
        const prog=((t*p.sp*100+p.phase*o.H())%(o.H()+80))-40;for(let k=0;k<18;k++){const yy=prog+k*4;if(yy<0||yy>o.H())continue;const xx=p.x+Math.sin(yy*.02+p.phase*6)*20;const a=(1-k/18)*.9;x.fillStyle='rgba('+(p.phase>.5?'0,224,198':'157,134,255')+','+a+')';x.beginPath();x.arc(xx,yy,1.6,0,6.28);x.fill();}});
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
