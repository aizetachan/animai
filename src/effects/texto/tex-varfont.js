/** @type {import('../types.js').Effect} */
const effect = {
  id:'tex-varfont', title:'Variable Font Morph', cat:'Texto',
  tags:['variable font','peso','weight','morph','tipografía','animar'],
  desc:'El peso y la anchura de la tipografía cambian en bucle. Solo posible con variable fonts.',
  meta:['font-variation-settings','wght/wdth','Loop'],
  prompt:`Anima una variable font cambiando su peso y anchura en bucle con font-variation-settings.
Interpola 'wght' (100-900) y 'wdth' si la fuente lo soporta, con una transición CSS o un @keyframes. Da un efecto "respiración" tipográfica muy premium e imposible con fuentes estáticas.
Para titulares de marca, hero kinetic typography. Requiere una fuente variable cargada (Inter, Roboto Flex, etc.).`,
  code:`/* Variable font morph */
.vf {
  font-family: 'Inter', sans-serif;
  animation: weight 3s ease-in-out infinite;
}
@keyframes weight {
  0%,100% { font-variation-settings: 'wght' 200; }
  50%     { font-variation-settings: 'wght' 900; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes vfw{0%,100%{font-weight:200;letter-spacing:.12em}50%{font-weight:900;letter-spacing:-.02em}}</style><div style="font-size:30px;color:#eef0f7;animation:vfw 3s ease-in-out infinite">Variable</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
