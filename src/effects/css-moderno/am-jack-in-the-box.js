/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-jack-in-the-box', title:'Jack In The Box', cat:'CSS Moderno',
  tags:['css','entrada','pop','scale','rotate','animate','jack in the box'],
  desc:'Pop de entrada que sale de una caja con escala creciente y rotación oscilante hasta asentarse.',
  meta:['@keyframes','0 JS'],
  prompt:`Crea una animación de entrada tipo "Jack In The Box".
Un elemento que comienza muy pequeño (scale .1) y rotado (rotate 30deg), invisible (opacity 0).
Define @keyframes con varios pasos: en 0% scale(.1) rotate(30deg) opacity 0; en 50% rotate(-10deg); en 70% rotate(3deg); en 100% scale(1) rotate(0) opacity 1.
Usa transform-origin:center bottom para simular que sale de una caja. Duración ~0.7s, easing ease-out. Sin JS, solo CSS.`,
  code:`/* Jack In The Box - entrada con pop y oscilacion */
.jack {
  animation: am-jack 0.7s ease-out both;
  transform-origin: center bottom;
}
@keyframes am-jack {
  0%   { transform: scale(0.1) rotate(30deg); opacity: 0; }
  50%  { transform: rotate(-10deg); }
  70%  { transform: rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amJack{0%{transform:scale(.1) rotate(30deg);opacity:0}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}</style><div id="amJackBox" style="width:90px;height:90px;border-radius:16px;background:linear-gradient(135deg,#7b5cff,#00e0c6);box-shadow:0 8px 24px rgba(123,92,255,.4);transform-origin:center bottom"></div>';
    el.appendChild(s);
    const box=s.querySelector('#amJackBox');
    let t=null;
    const play=()=>{box.style.animation='none';void box.offsetWidth;box.style.animation='amJack .7s ease-out both';};
    play();
    t=setInterval(play,1700);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
