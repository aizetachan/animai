import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'part-confetti', title:'Confetti Burst', cat:'Partículas',
  tags:['confetti','confeti','celebración','éxito','partículas','explosión'],
  desc:'Explosión de confeti con física y gravedad. El feedback de éxito/celebración por excelencia.',
  meta:['Canvas 2D','Gravedad','Celebración'],
  prompt:`Crea una explosión de confeti en canvas 2D para celebrar una acción (compra, registro, logro).
Emite N partículas rectangulares con velocidad radial aleatoria, color variado, gravedad, fricción, rotación propia y fade. Dispáralo en un evento (ej. submit ok).
Limita la duración y limpia el pool. Librería conocida: canvas-confetti.`,
  code:`// Confetti burst (canvas 2D) — concepto de canvas-confetti
function burst(x, y) {
  for (let i = 0; i < 120; i++) {
    const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 6
    particles.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
      color: \`hsl(\${Math.random()*360},90%,60%)\`, life: 1,
    })
  }
}
// en el loop: vy += 0.15 (gravedad); vx *= 0.99; life -= 0.01`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;const P=[];function burst(){for(let i=0;i<90;i++){const a=Math.random()*6.28,sp=3+Math.random()*5;P.push({x:o.W()/2,y:o.H()/2,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-3,rot:Math.random()*6.28,vr:(Math.random()-.5)*.3,h:Math.random()*360,life:1,w:4+Math.random()*4});}}
    let raf,run=true,c=0;burst();
    (function loop(){if(!run)return;c++;if(c%70===0)burst();x.fillStyle='rgba(7,7,13,.25)';x.fillRect(0,0,o.W(),o.H());
      for(let i=P.length-1;i>=0;i--){const p=P[i];p.vy+=.15;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life-=.01;if(p.life<=0||p.y>o.H()+10){P.splice(i,1);continue;}x.save();x.translate(p.x,p.y);x.rotate(p.rot);x.fillStyle='hsla('+p.h+',90%,60%,'+p.life+')';x.fillRect(-p.w/2,-p.w/4,p.w,p.w/2);x.restore();}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
