/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-focus-in', title:'Focus In', cat:'Texto',
  tags:['texto','text','focus','blur','desenfoque','entrada','reveal'],
  desc:'Texto que entra pasando de un desenfoque fuerte a totalmente nítido, como una lente enfocando.',
  meta:['filter:blur','keyframes','CSS'],
  prompt:`Crea una animación de entrada de texto "focus-in".
Elemento: un titular centrado.
Técnica: anima filter:blur() junto con opacity mediante @keyframes.
Keyframes: 0% { filter: blur(12px); opacity: 0; } 100% { filter: blur(0); opacity: 1; }
Timings: duración ~1s, easing cubic-bezier(.25,.46,.45,.94) (ease-out), fill-mode forwards.
Opcional: añade un sutil scale(1.04 -> 1) para reforzar la sensación de enfoque.
Para mostrar el ciclo en bucle, reinicia la animación cada ~2.4s reasignando la clase.`,
  code:`<h1 class="focus-in">ENFOQUE</h1>
<style>
.focus-in{
  filter:blur(12px);opacity:0;
  animation:focusIn 1s cubic-bezier(.25,.46,.45,.94) forwards;
}
@keyframes focusIn{
  0%{filter:blur(12px);opacity:0;transform:scale(1.04)}
  100%{filter:blur(0);opacity:1;transform:scale(1)}
}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0b0b12';
    s.innerHTML='<style>'
      +'@keyframes txfiIn{0%{filter:blur(12px);opacity:0;transform:scale(1.05)}100%{filter:blur(0);opacity:1;transform:scale(1)}}'
      +'.txfi{font:700 32px/1 system-ui,sans-serif;color:#fff;letter-spacing:.02em;white-space:nowrap;text-shadow:0 0 18px rgba(123,92,255,.5)}'
      +'.txfi.on{animation:txfiIn 1s cubic-bezier(.25,.46,.45,.94) both}'
      +'</style>'
      +'<h1 class="txfi">ENFOQUE</h1>';
    el.appendChild(s);
    const t=s.querySelector('.txfi');
    const fire=()=>{t.classList.remove('on');void t.offsetWidth;t.classList.add('on');};
    fire();
    const iv=setInterval(fire,2400);
    return{stop(){clearInterval(iv);el.innerHTML='';}};
  }
};
export default effect;
