/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-roll-in', title:'Roll In', cat:'CSS Moderno',
  tags:['css','roll','rodar','entrada','rotate','translate','animate'],
  desc:'Entrada rodando: el elemento llega desde la izquierda combinando translateX y una rotación que se asienta a 0.',
  meta:['transform','0 JS'],
  prompt:`Crea el efecto "Roll In" solo con CSS, estilo animate.css.
El elemento entra desde la izquierda fuera de pantalla combinando translateX(-100%) con rotate(-120deg) y opacity 0, y termina en translateX(0) rotate(0) opacity 1, como si rodara hasta su sitio.
Define @keyframes: 0% opacity 0, transform translateX(-100%) rotate(-120deg); 100% opacity 1, transform translateX(0) rotate(0). Usa ease-out, 1s. Para la preview repite en bucle con un breve respiro. Sin JS.`,
  code:`.roll-in {
  animation: am-roll 1s ease-out;
}
@keyframes am-roll {
  0%   { opacity: 0; transform: translateX(-100%) rotate(-120deg); }
  100% { opacity: 1; transform: translateX(0) rotate(0); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;overflow:hidden';
    s.innerHTML='<style>@keyframes amRoll{0%{opacity:0;transform:translateX(-140px) rotate(-120deg)}55%{opacity:1}100%{opacity:1;transform:translateX(0) rotate(0)}}</style><div style="animation:amRoll 1.7s ease-out infinite;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#7b5cff,#00e0c6);box-shadow:0 10px 22px rgba(123,92,255,.4);display:grid;place-items:center;color:#fff;font:700 13px system-ui">Roll</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
