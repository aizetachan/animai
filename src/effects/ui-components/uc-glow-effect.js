/** @type {import('../types.js').Effect} */
const effect = {
  id:'uc-glow-effect', title:'Glow Effect', cat:'UI Components',
  tags:['glow','resplandor','conic','gradient','card','tarjeta','blur'],
  desc:'Resplandor de gradiente cónico animado que gira detrás de una tarjeta y la hace brillar por los bordes.',
  meta:['conic-gradient','blur','CSS'],
  prompt:`Crea un efecto de resplandor (glow) detrás de una tarjeta.
Elementos: un contenedor con position:relative; dentro una capa de resplandor (::before o un div absoluto) ligeramente más grande que la tarjeta, y encima la tarjeta opaca.
Técnica: la capa de resplandor usa background:conic-gradient con varios colores (acento #7b5cff y secundario #00e0c6) y filter:blur(18px) para difuminarla. Se posiciona detrás con z-index y se centra sobrepasando los bordes (inset negativo).
Animación: @keyframes que rota el gradiente girando la capa 360deg de forma continua (rotate, ~6s linear infinite). La tarjeta encima permanece fija, dejando ver el aura de color que late por los bordes.
Timings: rotación 6s linear infinite; opcional un pulso de opacidad lento.`,
  code:`<div class="glow-wrap">
  <div class="glow"></div>
  <div class="card">Glow Effect</div>
</div>
<style>
.glow-wrap{position:relative;width:220px;height:130px}
.glow{position:absolute;inset:-3px;border-radius:18px;
  background:conic-gradient(from 0deg,#7b5cff,#00e0c6,#7b5cff,#00e0c6,#7b5cff);
  filter:blur(16px);animation:glowSpin 6s linear infinite;z-index:0}
.card{position:relative;z-index:1;width:100%;height:100%;border-radius:16px;
  background:#12121c;color:#e8e8f0;display:grid;place-items:center;
  font:600 16px system-ui;border:1px solid rgba(255,255,255,.06)}
@keyframes glowSpin{to{transform:rotate(360deg)}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes ucgeSpin{to{transform:rotate(360deg)}}'
      +'@keyframes ucgePulse{0%,100%{opacity:.7}50%{opacity:1}}'
      +'.ucge-wrap{position:relative;width:200px;height:120px}'
      +'.ucge-glow{position:absolute;inset:-3px;border-radius:20px;background:conic-gradient(from 0deg,#7b5cff,#00e0c6,#7b5cff,#00e0c6,#7b5cff);filter:blur(16px);animation:ucgeSpin 6s linear infinite,ucgePulse 3s ease-in-out infinite;z-index:0}'
      +'.ucge-card{position:relative;z-index:1;width:100%;height:100%;border-radius:18px;background:#12121c;color:#e8e8f0;display:grid;place-items:center;font:600 16px system-ui;border:1px solid rgba(255,255,255,.06)}'
      +'</style>'
      +'<div class="ucge-wrap"><div class="ucge-glow"></div><div class="ucge-card">Glow Effect</div></div>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
