/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-space-in', title:'Space In', cat:'CSS Moderno',
  tags:['css','entrada','zoom','scale','fade','space','aparicion'],
  desc:'Zoom desde lejos: el elemento entra desde scale 2 hacia 1 mientras hace fade-in, como acercándose en el espacio.',
  meta:['transform scale','0 JS'],
  prompt:`Crea una animación de entrada "Space In" solo con CSS.
Un elemento arranca grande (transform: scale(2)) y transparente (opacity:0), simulando estar lejos y desenfocado, y se acerca/define hasta scale(1) con opacity:1.
Define @keyframes con 0% { opacity:0; transform:scale(2) } y 100% { opacity:1; transform:scale(1) }. Usa una curva suave ease-out, duración ~0.8s, animation-fill-mode both. Opcional: añade blur(8px) al inicio que se desvanece. Sin JS.`,
  code:`.space-in {
  animation: space-in 0.8s ease-out both;
}
@keyframes space-in {
  0%   { opacity: 0; transform: scale(2); filter: blur(8px); }
  100% { opacity: 1; transform: scale(1); filter: blur(0); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amSpaceIn{0%{opacity:0;transform:scale(2);filter:blur(8px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}</style><div class="amSpaceBox" style="width:104px;height:104px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#00e0c6,#7b5cff);display:grid;place-items:center;color:#07070d;font:800 16px/1 system-ui;box-shadow:0 0 40px rgba(0,224,198,.45)">SPACE</div>';
    el.appendChild(s);
    const box=s.querySelector('.amSpaceBox');
    let t=null;
    const run=()=>{box.style.animation='none';void box.offsetWidth;box.style.animation='amSpaceIn .8s ease-out both';};
    run();
    t=setInterval(run,1700);
    return{stop(){clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
