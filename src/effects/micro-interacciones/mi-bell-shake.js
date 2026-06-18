/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-bell-shake', title:'Notification Bell', cat:'Micro-interacciones',
  tags:['bell','campana','notificacion','badge','shake','alerta','wobble'],
  desc:'Campana de notificacion que se agita con un wobble y hace aparecer un badge con un pop (auto-demo en bucle).',
  meta:['CSS+JS','transform-origin'],
  prompt:`Crea una campana de notificacion animada.
Dibuja la campana con CSS: un cuerpo (div redondeado por arriba), un badajo (circulo pequeno debajo). Coloca un badge rojo/acento en la esquina superior derecha con un numero.
Animacion al recibir notificacion: la campana se agita con @keyframes (rotate -15deg/15deg alternando, transform-origin:top center, ~0.6s) y el badge entra con un pop (scale 0->1.2->1, @keyframes).
Demo: dispara el ciclo con setInterval cada ~2.5s; entre ciclos esconde el badge.`,
  code:`<div class="bell-box">
  <div class="bell"><span class="badge">3</span></div>
</div>
<style>
.bell-box{position:relative;width:60px;height:64px}
.bell{position:absolute;left:14px;top:8px;width:30px;height:30px;
  border:4px solid #fff;border-radius:14px 14px 6px 6px;transform-origin:top center}
.bell::before{content:'';position:absolute;left:-7px;bottom:-7px;right:-7px;
  height:5px;background:#fff;border-radius:3px}
.bell::after{content:'';position:absolute;left:50%;bottom:-14px;width:8px;height:8px;
  margin-left:-4px;background:#fff;border-radius:50%}
.bell.ring{animation:bellShake .6s ease}
.badge{position:absolute;top:-9px;right:-9px;min-width:18px;height:18px;
  background:#7b5cff;color:#fff;border-radius:9px;font:700 11px system-ui;
  display:grid;place-items:center;transform:scale(0)}
.badge.on{animation:bellPop .4s cubic-bezier(.2,1.4,.4,1) forwards}
@keyframes bellShake{0%,100%{transform:rotate(0)}20%{transform:rotate(-15deg)}
  40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(5deg)}}
@keyframes bellPop{0%{transform:scale(0)}70%{transform:scale(1.25)}100%{transform:scale(1)}}
</style>
<script>
const bell=document.querySelector('.bell'),badge=document.querySelector('.badge');
function ring(){
  bell.classList.remove('ring');badge.classList.remove('on');
  void bell.offsetWidth;
  bell.classList.add('ring');badge.classList.add('on');
}
ring();setInterval(ring,2500);
</scr` + `ipt>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.miBellBox{position:relative;width:60px;height:64px}'
      +'.miBell{position:absolute;left:14px;top:8px;width:30px;height:30px;border:4px solid #fff;border-radius:14px 14px 6px 6px;transform-origin:top center}'
      +'.miBell::before{content:"";position:absolute;left:-7px;bottom:-7px;right:-7px;height:5px;background:#fff;border-radius:3px}'
      +'.miBell::after{content:"";position:absolute;left:50%;bottom:-14px;width:8px;height:8px;margin-left:-4px;background:#fff;border-radius:50%}'
      +'.miBell.ring{animation:miBellShake .6s ease}'
      +'.miBadge{position:absolute;top:-9px;right:-9px;min-width:18px;height:18px;background:#7b5cff;color:#fff;border-radius:9px;font:700 11px system-ui;display:grid;place-items:center;transform:scale(0);box-shadow:0 0 10px rgba(123,92,255,.6)}'
      +'.miBadge.on{animation:miBellPop .4s cubic-bezier(.2,1.4,.4,1) forwards}'
      +'@keyframes miBellShake{0%,100%{transform:rotate(0)}20%{transform:rotate(-15deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(5deg)}}'
      +'@keyframes miBellPop{0%{transform:scale(0)}70%{transform:scale(1.25)}100%{transform:scale(1)}}'
      +'</style><div class="miBellBox"><div class="miBell"><span class="miBadge">3</span></div></div>';
    el.appendChild(s);
    const bell=s.querySelector('.miBell'),badge=s.querySelector('.miBadge');
    function ring(){
      bell.classList.remove('ring');badge.classList.remove('on');
      void bell.offsetWidth;
      bell.classList.add('ring');badge.classList.add('on');
    }
    ring();const iv=setInterval(ring,2500);
    return{stop(){clearInterval(iv);el.innerHTML='';}};
  }
};
export default effect;
