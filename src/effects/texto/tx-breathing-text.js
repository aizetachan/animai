/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-breathing-text', title:'Breathing Text', cat:'Texto',
  tags:['variable font','breathing','respira','wght','letter-spacing','loop','tipografía'],
  desc:'Texto que respira: el peso variable y el letter-spacing se expanden y contraen en bucle suave.',
  meta:['font-variation-settings','letter-spacing','Loop'],
  prompt:`Crea un texto que "respira" en bucle infinito combinando peso variable y letter-spacing.
Técnica: con un único @keyframes anima a la vez font-variation-settings 'wght' (200 → 800 → 200) y letter-spacing (-.01em → .14em → -.01em), de modo que al inhalar el texto engorda y se separa, y al exhalar adelgaza y se junta.
Timings: ciclo lento ~4s con ease-in-out (cubic-bezier suave) y animation-iteration-count infinite. Opcional: un sutil cambio de opacidad/brillo en el acento.
Requiere una variable font cargada (Inter, Roboto Flex...). Ideal para hero o estados de espera elegantes.`,
  code:`<h1 class="breathe">breathe</h1>
<style>
.breathe{
  font-family:'Inter',sans-serif;font-size:54px;color:#eef0f7;
  animation:bt-breathe 4s cubic-bezier(.45,0,.55,1) infinite;
}
@keyframes bt-breathe{
  0%,100%{font-variation-settings:'wght' 200;letter-spacing:-.01em;opacity:.7}
  50%    {font-variation-settings:'wght' 800;letter-spacing:.14em;opacity:1}
}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes btw{0%,100%{font-weight:200;letter-spacing:-.01em;opacity:.65;text-shadow:none}50%{font-weight:800;letter-spacing:.14em;opacity:1;text-shadow:0 0 18px rgba(123,92,255,.45)}}'
      +'.bt-t{font-family:Inter,system-ui,sans-serif;font-size:42px;color:#eef0f7;animation:btw 4s cubic-bezier(.45,0,.55,1) infinite}'
      +'</style>'
      +'<div class="bt-t">breathe</div>';
    el.appendChild(s);
    return{stop(){el.innerHTML='';}};
  }
};
export default effect;
