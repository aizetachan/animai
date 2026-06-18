/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-glitch-text', title:'Glitch Text (CSS)', cat:'Texto',
  tags:['glitch','texto','css','rgb','clip','error','cyber'],
  desc:'Texto con glitch RGB usando clip-path y capas. El título corrupto cyberpunk, solo CSS.',
  meta:['CSS','clip-path','2 capas'],
  prompt:`Crea un título con efecto glitch en CSS puro.
Duplica el texto en dos pseudo-elementos (::before cian, ::after magenta) posicionados encima del original; anímalos con clip-path:inset() en bandas cambiantes y pequeños translateX, a destiempo, con steps().
Da el look de señal corrupta/cyberpunk sin JS. Úsalo con moderación en titulares.`,
  code:`/* Glitch text CSS (data-text duplica el contenido) */
.glitch { position: relative; color: #fff; }
.glitch::before, .glitch::after {
  content: attr(data-text); position: absolute; inset: 0;
}
.glitch::before { color: #00e0c6; animation: g1 2s infinite steps(2); }
.glitch::after  { color: #ff5ca8; animation: g2 2s infinite steps(2); }
@keyframes g1 { 0% { clip-path: inset(20% 0 60% 0); transform: translateX(-2px) } /* ... */ }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#08080f';
    s.innerHTML='<style>.gt{position:relative;font-size:30px;font-weight:900;color:#fff;letter-spacing:.02em}.gt::before,.gt::after{content:"GLITCH";position:absolute;inset:0}.gt::before{color:#00e0c6;animation:gg1 1.4s infinite steps(2)}.gt::after{color:#ff5ca8;animation:gg2 1.7s infinite steps(2)}@keyframes gg1{0%{clip-path:inset(10% 0 70% 0);transform:translateX(-2px)}50%{clip-path:inset(50% 0 20% 0);transform:translateX(2px)}100%{clip-path:inset(20% 0 60% 0);transform:translateX(-1px)}}@keyframes gg2{0%{clip-path:inset(60% 0 10% 0);transform:translateX(2px)}50%{clip-path:inset(20% 0 50% 0);transform:translateX(-2px)}100%{clip-path:inset(70% 0 5% 0);transform:translateX(1px)}}</style><span class="gt">GLITCH</span>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
