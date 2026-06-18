import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-danmaku', title:'Danmaku', cat:'Creativos',
  tags:['danmaku','弹幕','comentarios','bullet comments','carriles','overlay','bilibili'],
  desc:'弹幕: comentarios-bala que cruzan la pantalla de derecha a izquierda repartidos en carriles horizontales.',
  meta:['canvas','lanes','auto-demo'],
  prompt:`Crea un sistema de "danmaku" (弹幕, comentarios-bala estilo Bilibili/Niconico) en canvas 2D.
Estructura: una lista de comentarios; cada uno tiene {text, color, lane, x, speed}. La pantalla se divide en carriles (lanes) horizontales de altura fija (lineHeight).
Algoritmo: al emitir un comentario, busca un carril libre (cuyo último comentario ya entró del todo) y lo coloca en x = anchoTotal con su lane asignado. Cada frame: x -= speed (speed proporcional a la longitud del texto para que tarden lo mismo en cruzar). Cuando x + ancho del texto < 0, retira el comentario. Mide el texto con ctx.measureText.
Auto-demo: emite comentarios de un pool de ejemplo a intervalos regulares y reaprovecha carriles, formando un flujo continuo. Dibuja el texto con un sutil borde/sombra para legibilidad sobre cualquier fondo.
Para overlays de chat en vivo, reacciones en streaming o avisos divertidos.`,
  code:`// Danmaku (弹幕) — comentarios-bala en canvas 2D
const lanes = Math.floor(H / lineHeight)
function emit(text, color){
  ctx.font = '14px sans-serif'
  const w = ctx.measureText(text).width
  comments.push({ text, color, x: W, w, lane: freeLane(), speed: (W + w)/360 })
}
// loop: c.x -= c.speed; si (c.x + c.w < 0) eliminar
ctx.fillText(c.text, c.x, c.lane*lineHeight + 18)`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const pool=[
      {t:'¡Hola! 你好',c:'#fff'},{t:'666666',c:'#ffc861'},{t:'qué genial 草',c:'#00e0c6'},
      {t:'first!!',c:'#ff8acb'},{t:'前方高能',c:'#7b5cff'},{t:'jajaja xD',c:'#fff'},
      {t:'+1',c:'#00e0c6'},{t:'弹幕 rules',c:'#ffc861'},{t:'wowww',c:'#ff8acb'},
      {t:'awesome',c:'#7b5cff'},{t:'好看!',c:'#fff'},{t:'replay',c:'#00e0c6'}
    ];
    const lineH=22,font='14px system-ui,sans-serif';
    let comments=[],raf,run=true,frame=0,pi=0;
    function freeLane(){
      const lanes=Math.max(1,Math.floor((o.H()-8)/lineH));
      for(let l=0;l<lanes;l++){
        const last=comments.filter(c=>c.lane===l).sort((a,b)=>b.x-a.x)[0];
        if(!last||last.x+last.w<o.W()-12)return l;
      }
      return Math.floor(Math.random()*lanes);
    }
    function emit(){
      x.font=font;const p=pool[pi%pool.length];pi++;
      const w=x.measureText(p.t).width;
      comments.push({text:p.t,color:p.c,x:o.W(),w,lane:freeLane(),speed:(o.W()+w)/220});
    }
    emit();emit();
    (function loop(){if(!run)return;frame++;if(frame%32===0)emit();
      x.fillStyle='#07070d';x.fillRect(0,0,o.W(),o.H());
      x.font=font;x.textBaseline='top';
      for(let i=comments.length-1;i>=0;i--){
        const c=comments[i];c.x-=c.speed;
        if(c.x+c.w<0){comments.splice(i,1);continue;}
        const y=c.lane*lineH+5;
        x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=3;
        x.fillStyle=c.color;x.fillText(c.text,c.x,y);
        x.shadowBlur=0;
      }
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
