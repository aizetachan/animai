/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-velocity-skew', title:'Velocity Skew', cat:'Scroll',
  tags:['skew','velocity','velocidad','scroll','inclinar','inertia','locomotive'],
  desc:'El contenido se inclina y escala según la velocidad de scroll, relajándose al detenerse.',
  meta:['css','skewY','scroll simulado'],
  prompt:`Recrea el efecto "velocity skew" (Locomotive/Lenis): el contenido se deforma según la velocidad de scroll.
Algoritmo: en cada frame calcula velocity = posScrollActual - posScrollPrevia. Suaviza con un lerp (smooth += (velocity - smooth) * 0.1). Mapea esa velocidad suavizada a:
  - skewY = clamp(smooth * 0.4, -12, 12) grados
  - scaleY = 1 + min(|smooth|*0.002, 0.12)
Aplica transform: skewY(...) scaleY(...) a los items. Cuando el scroll se detiene, velocity tiende a 0 y el contenido vuelve a su forma natural (el lerp hace la inercia).
Para la preview, SIMULA el scroll: anima una posición con ondas de velocidad (acelera, frena, invierte) en bucle y mueve una lista de tarjetas verticalmente aplicando el skew/scale calculado.`,
  code:`// Velocity skew (estilo Lenis/Locomotive)
let last = 0, smooth = 0
function onScroll(pos){
  const v = pos - last; last = pos
  smooth += (v - smooth) * 0.1                 // inercia
  const skew  = Math.max(-12, Math.min(12, smooth * 0.4))
  const scale = 1 + Math.min(Math.abs(smooth) * 0.002, 0.12)
  track.style.transform = \`translateY(\${-pos}px) skewY(\${skew}deg) scaleY(\${scale})\`
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;overflow:hidden;background:#0a0a14';
    const labels=['HERO','DESIGN','MOTION','SCROLL','VELOCITY','SKEW','ANIMAI','LENIS'];
    const cards=labels.map((t,i)=>{const grad=i%2? '#00e0c6,#0a8f80':'#7b5cff,#4a2fb0';
      return '<div class="svk-c" style="height:34px;margin:6px 14px;border-radius:8px;display:flex;align-items:center;padding-left:14px;font:700 12px system-ui;color:#fff;letter-spacing:1px;background:linear-gradient(135deg,'+grad+');box-shadow:0 4px 14px rgba(0,0,0,.4)">'+t+'</div>';}).join('');
    s.innerHTML='<div id="svk-track" style="position:absolute;left:0;right:0;top:0;transform-origin:center top;will-change:transform">'+cards+'</div>'
      +'<div style="position:absolute;left:0;right:0;bottom:6px;height:3px;background:rgba(255,255,255,.08)"><div id="svk-bar" style="height:100%;width:0;background:linear-gradient(90deg,#7b5cff,#00e0c6)"></div></div>';
    el.appendChild(s);
    const track=s.querySelector('#svk-track'),bar=s.querySelector('#svk-bar');
    let pos=0,last=0,smooth=0,phase=0,raf,run=true;
    (function loop(){if(!run)return;
      // scroll simulado: oscilación con tramos rápidos y pausas
      phase+=.018;
      const viewH=el.clientHeight||200;const maxScroll=Math.max(0,track.scrollHeight-viewH);
      const base=(Math.sin(phase)*.5+.5);              // 0..1 ida y vuelta
      const burst=Math.sin(phase*3)*0.12*Math.max(0,Math.sin(phase*1.5)); // ráfagas
      const target=Math.max(0,Math.min(1,base+burst))*maxScroll;
      pos+=(target-pos)*.18;
      const v=pos-last;last=pos;
      smooth+=(v-smooth)*.1;
      const skew=Math.max(-12,Math.min(12,smooth*0.8));
      const scale=1+Math.min(Math.abs(smooth)*.01,0.14);
      track.style.transform='translateY('+(-pos)+'px) skewY('+skew+'deg) scaleY('+scale+')';
      bar.style.width=(maxScroll?pos/maxScroll*100:0)+'%';
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
