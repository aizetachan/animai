import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pt-ink-diffusion', title:'Ink Diffusion', cat:'Partículas',
  tags:['ink','tinta','diffusion','difusión','agua','blur','partículas','water'],
  desc:'Una gota de tinta cae y se difunde en el agua: partículas que se dispersan con turbulencia y se desvanecen.',
  meta:['Canvas 2D','partículas','blur'],
  prompt:`Simula una gota de tinta difundiéndose en agua usando partículas.
Lanza gotas periódicas desde un punto; cada gota emite N partículas con velocidad radial decreciente más un campo de ruido (curl/seno) que las desvía, imitando la turbulencia del fluido.
Cada partícula tiene radio creciente (la mancha se expande), velocidad amortiguada (drag ~0.96) y opacidad que decae con la vida. Dibújalas con relleno semitransparente y blur del contexto (filter:'blur(Npx)') o gradiente radial para el aspecto difuso.
Usa colores de marca (#7b5cff / #00e0c6). Limpia el canvas con un leve velo translúcido para acumular estelas suaves.`,
  code:`// Ink diffusion — gotas de tinta como partículas con turbulencia y blur
function noise(x,y){ return Math.sin(x*1.7+y*0.9)+Math.cos(x*0.6-y*1.4); }

function emit(cx,cy){
  for(let i=0;i<40;i++){
    const a=Math.random()*Math.PI*2, sp=0.3+Math.random()*1.6;
    parts.push({ x:cx, y:cy, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp,
                 r:2+Math.random()*3, life:1 });
  }
}

parts.forEach(p=>{
  const n=noise(p.x*0.02, p.y*0.02);          // turbulencia del fluido
  p.vx+=Math.cos(n*3.1)*0.05; p.vy+=Math.sin(n*3.1)*0.05;
  p.vx*=0.96; p.vy*=0.96;                       // drag (viscosidad)
  p.x+=p.vx; p.y+=p.vy;
  p.r+=0.25;                                     // la mancha se expande
  p.life-=0.006;                                 // se desvanece
  ctx.filter='blur(4px)';
  ctx.fillStyle='rgba(123,92,255,'+(p.life*0.5)+')';
  ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.283); ctx.fill();
});`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let raf,run=true,t=0,timer=0;
    const P=[];
    function noise(a,b){return Math.sin(a*1.7+b*.9)+Math.cos(a*.6-b*1.4);}
    function emit(cx,cy,col){for(let i=0;i<46;i++){const a=Math.random()*6.283,sp=.3+Math.random()*1.7;P.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:2+Math.random()*3,life:1,col});}}
    x.fillStyle='#070710';x.fillRect(0,0,o.W(),o.H());
    (function loop(){if(!run)return;t+=.016;timer-=1;
      x.filter='none';x.fillStyle='rgba(7,7,16,.06)';x.fillRect(0,0,o.W(),o.H());
      if(timer<=0){timer=90;const cx=o.W()*(.3+Math.random()*.4),cy=o.H()*(.2+Math.random()*.35);emit(cx,cy,Math.random()<.5?'123,92,255':'0,224,198');}
      x.filter='blur(4px)';x.globalCompositeOperation='lighter';
      for(let i=P.length-1;i>=0;i--){const p=P[i];const n=noise(p.x*.02,p.y*.02+t);p.vx+=Math.cos(n*3.1)*.06;p.vy+=Math.sin(n*3.1)*.06+.02;p.vx*=0.96;p.vy*=0.96;p.x+=p.vx;p.y+=p.vy;p.r+=.25;p.life-=.006;if(p.life<=0){P.splice(i,1);continue;}x.fillStyle='rgba('+p.col+','+(p.life*.5).toFixed(3)+')';x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill();}
      x.globalCompositeOperation='source-over';x.filter='none';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
