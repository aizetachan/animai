import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-hyperspeed', title:'Hyperspeed', cat:'3D / R3F',
  tags:['hyperspeed','warp','velocidad','luces','react bits','carretera','neon'],
  desc:'Estelas de luz volando hacia ti como una autopista a velocidad warp. El efecto Hyperspeed.',
  meta:['perspectiva','trails','React Bits'],
  prompt:`Recrea "Hyperspeed" de React Bits: estelas de luz (como faros de coches en una autopista nocturna) que vuelan desde el horizonte hacia el espectador con perspectiva, dando sensación de velocidad warp.
Genera líneas que parten de un punto de fuga central y se alargan hacia los bordes acelerando; colores neón. Profundidad por escala/opacidad.
Fondo energético para gaming, launches o secciones "speed".`,
  code:`// Hyperspeed — líneas que salen del punto de fuga acelerando
trails.forEach(t => {
  t.z -= speed                       // se acercan
  const scale = 1 / t.z
  const x = cx + t.dx * scale, y = cy + t.dy * scale
  // dibujar línea desde la posición anterior (estela)
  if (t.z < 0.1) reset(t)             // reaparece al fondo
})`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const T=[];function reset(t){t.dx=(Math.random()-.5)*2;t.dy=(Math.random()-.5)*2;t.z=1;t.c='hsl('+(250+Math.random()*60)+',90%,65%)';}
    for(let i=0;i<70;i++){const t={};reset(t);t.z=Math.random();T.push(t);}
    let raf,run=true;
    (function loop(){if(!run)return;x.fillStyle='rgba(7,7,14,.3)';x.fillRect(0,0,o.W(),o.H());const cx=o.W()/2,cy=o.H()/2;
      T.forEach(t=>{const pz=t.z;t.z-=.012;if(t.z<=.02)reset(t);const s1=1/t.z,s0=1/(t.z+.012);const x1=cx+t.dx*s1*60,y1=cy+t.dy*s1*60,x0=cx+t.dx*s0*60,y0=cy+t.dy*s0*60;x.strokeStyle=t.c;x.globalAlpha=Math.min(1,(1-t.z)*1.5);x.lineWidth=Math.max(.5,2*(1-t.z));x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();});x.globalAlpha=1;
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
