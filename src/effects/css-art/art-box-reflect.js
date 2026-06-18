/** @type {import('../types.js').Effect} */
const effect = {
  id:'art-box-reflect', title:'Reflection', cat:'CSS Art',
  tags:['css','reflejo','reflection','box-reflect','espejo','mirror','suelo'],
  desc:'Elemento animado con su reflejo invertido y degradado debajo usando -webkit-box-reflect.',
  meta:['-webkit-box-reflect','keyframes','CSS'],
  prompt:`Crea un elemento (texto o caja con gradiente) que flota verticalmente y proyecta un reflejo debajo.
Aplica -webkit-box-reflect: below 6px linear-gradient(transparent 40%, rgba(255,255,255,.35)) al elemento para que el navegador genere automáticamente el reflejo desvanecido.
Anima el elemento con @keyframes que suben y bajan ligeramente (translateY) en bucle, de modo que el reflejo se mueve en espejo. Usa colores de marca. Sin JS.`,
  code:`.shiny {
  font: 800 40px/1 system-ui, sans-serif;
  background: linear-gradient(90deg, #7b5cff, #00e0c6);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  -webkit-box-reflect: below 8px linear-gradient(transparent 45%, rgba(255,255,255,.4));
  animation: brFloat 2.4s ease-in-out infinite;
}
@keyframes brFloat {
  0%,100% { transform: translateY(-6px); }
  50%     { transform: translateY(6px); }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes brFloat{0%,100%{transform:translateY(-7px)}50%{transform:translateY(7px)}}.brShiny{font:800 46px/1 system-ui,sans-serif;letter-spacing:1px;background:linear-gradient(90deg,#7b5cff,#00e0c6);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-box-reflect:below 8px linear-gradient(transparent 45%,rgba(255,255,255,.4));animation:brFloat 2.4s ease-in-out infinite}</style><div class="brShiny">ANIMAI</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
