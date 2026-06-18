import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-applause-burst', title:'Applause Burst', cat:'Creativos',
  tags:['aplauso','applause','点赞','like','corazones','manos','ascenso'],
  desc:'Ráfaga estilo "点赞" de corazones y manos aplaudiendo que ascienden flotando y se desvanecen.',
  meta:['canvas','emoji','点赞'],
  prompt:`Crea la ráfaga de reacciones tipo livestream chino (点赞): emojis de manos aplaudiendo y corazones que brotan desde abajo, ascienden oscilando y se desvanecen.
Estructura de datos: cada partícula tiene x, y, velocidad de ascenso vy, fase y amplitud de oscilación horizontal, escala con pop inicial (overshoot), rotación leve, vida (0→1) y un glifo (emoji 👏 ❤️ 👍 etc.).
Algoritmo por frame: y -= vy; x oscila con sin(fase); fase += df; vida += dv. Escala = pop ease-out al nacer (0→1.2→1) y luego mantiene; opacidad cae en el último tercio de la vida. Al morir (vida>=1) o salir por arriba, se recicla desde abajo.
Auto-demo: emite ráfagas periódicas (cada ~700ms varias partículas) desde un punto inferior con dispersión, en bucle infinito. Fondo oscuro.`,
  code:`// 点赞 Applause / like burst (canvas 2D)
const GLYPHS = ['👏','❤️','👍','💜','🙌'];
function emit(){
  for (let i = 0; i < 4; i++){
    parts.push({
      x: W * 0.5 + (Math.random() - 0.5) * W * 0.4,
      y: H + 10,
      vy: 0.6 + Math.random() * 0.8,
      phase: Math.random() * 6.28, df: 0.05 + Math.random() * 0.04,
      amp: 6 + Math.random() * 14,
      life: 0, dv: 0.006 + Math.random() * 0.004,
      size: 16 + Math.random() * 12,
      rot: (Math.random() - 0.5) * 0.4,
      g: GLYPHS[(Math.random() * GLYPHS.length) | 0]
    });
  }
}
// loop: p.y -= p.vy; p.life += p.dv;
// pop = life<0.2 ? ease overshoot : 1; alpha = life>0.66 ? 1-(life-0.66)/0.34 : 1`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const GLYPHS=['👏','❤️','👍','💜','🙌'];
    const parts=[];
    function emit(){
      const W=o.W(),H=o.H();
      for(let i=0;i<4;i++){
        parts.push({
          x:W*.5+(Math.random()-.5)*W*.45,
          y:H+10,
          vy:.6+Math.random()*.8,
          phase:Math.random()*6.28,df:.05+Math.random()*.04,
          amp:5+Math.random()*13,
          life:0,dv:.006+Math.random()*.004,
          size:15+Math.random()*11,
          rot:(Math.random()-.5)*.4,
          g:GLYPHS[(Math.random()*GLYPHS.length)|0]
        });
      }
    }
    emit();
    let raf,run=true,last=performance.now();
    function loop(now){
      if(!run)return;
      const W=o.W(),H=o.H();
      if(now-last>700){last=now;emit();}
      x.fillStyle='#141019';x.fillRect(0,0,W,H);
      x.textAlign='center';x.textBaseline='middle';
      for(let i=parts.length-1;i>=0;i--){
        const p=parts[i];
        p.y-=p.vy;p.phase+=p.df;p.life+=p.dv;
        if(p.life>=1||p.y<-20){parts.splice(i,1);continue;}
        const pop=p.life<.2?(1.2*(1-Math.pow(1-p.life/.2,2))):(1.2-0.2*Math.min(1,(p.life-.2)/.15));
        const alpha=p.life>.66?Math.max(0,1-(p.life-.66)/.34):1;
        const px=p.x+Math.sin(p.phase)*p.amp;
        x.save();
        x.globalAlpha=alpha;
        x.translate(px,p.y);
        x.rotate(p.rot*Math.sin(p.phase));
        x.font=(p.size*Math.max(.1,pop)).toFixed(1)+'px serif';
        x.fillText(p.g,0,0);
        x.restore();
      }
      x.globalAlpha=1;
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
