/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-coffee-cup', title:'Coffee Cup', cat:'Loaders',
  tags:['css','loader','coffee','cafe','vapor','steam','taza'],
  desc:'Taza de café con volutas de vapor que suben en bucle ascendente, en puro CSS.',
  meta:['transform','0 JS'],
  prompt:`Crea un loader de taza de café en puro CSS.
Dibuja la taza con un div (cuerpo redondeado abajo) y un asa con ::after (borde semicircular a la derecha).
Encima de la taza coloca 3 volutas de vapor (divs verticales finos y redondeados) separadas horizontalmente.
Anima cada voluta con @keyframes que combine translateY hacia arriba, opacity de 0 a 1 a 0 y un leve scaleX/translateX para dar ondulación, 2.5s infinite, con animation-delay escalonado (0s, .4s, .8s).
Sin JS. Usa colores claros para la taza y vapor sobre fondo oscuro.`,
  code:`.cup { position: relative; width: 70px; height: 56px; }
.cup .body {
  width: 70px; height: 46px; background: #e8e8f0;
  border-radius: 8px 8px 28px 28px; box-shadow: inset 0 6px 0 #00e0c6;
}
.cup .body::after {
  content:''; position:absolute; right:-18px; top:10px;
  width: 20px; height: 24px; border: 5px solid #e8e8f0;
  border-left: none; border-radius: 0 14px 14px 0;
}
.cup .steam {
  position:absolute; top:-26px; width:5px; height:22px;
  background: rgba(255,255,255,.6); border-radius: 5px; opacity:0;
  animation: cc-steam 2.5s ease-in-out infinite;
}
.cup .s1 { left: 14px; animation-delay: 0s; }
.cup .s2 { left: 32px; animation-delay: .4s; }
.cup .s3 { left: 50px; animation-delay: .8s; }
@keyframes cc-steam {
  0%   { transform: translateY(0) translateX(0) scaleX(1); opacity:0; }
  30%  { opacity:.8; }
  60%  { transform: translateY(-16px) translateX(4px) scaleX(.7); opacity:.4; }
  100% { transform: translateY(-30px) translateX(-2px) scaleX(.4); opacity:0; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'+
      '.ldcc-cup{position:relative;width:70px;height:56px}'+
      '.ldcc-cup .ldcc-body{width:70px;height:46px;background:#e8e8f0;border-radius:8px 8px 28px 28px;box-shadow:inset 0 6px 0 #00e0c6}'+
      '.ldcc-cup .ldcc-body::after{content:"";position:absolute;right:-18px;top:10px;width:20px;height:24px;border:5px solid #e8e8f0;border-left:none;border-radius:0 14px 14px 0}'+
      '.ldcc-st{position:absolute;top:-26px;width:5px;height:22px;background:rgba(255,255,255,.6);border-radius:5px;opacity:0;animation:ldccSteam 2.5s ease-in-out infinite}'+
      '.ldcc-s1{left:14px;animation-delay:0s}.ldcc-s2{left:32px;animation-delay:.4s}.ldcc-s3{left:50px;animation-delay:.8s}'+
      '@keyframes ldccSteam{0%{transform:translateY(0) translateX(0) scaleX(1);opacity:0}30%{opacity:.8}60%{transform:translateY(-16px) translateX(4px) scaleX(.7);opacity:.4}100%{transform:translateY(-30px) translateX(-2px) scaleX(.4);opacity:0}}'+
      '</style>'+
      '<div class="ldcc-cup"><span class="ldcc-st ldcc-s1"></span><span class="ldcc-st ldcc-s2"></span><span class="ldcc-st ldcc-s3"></span><div class="ldcc-body"></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
