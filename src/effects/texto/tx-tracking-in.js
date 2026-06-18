/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-tracking-in', title:'Tracking In', cat:'Texto',
  tags:['texto','text','tracking','letter-spacing','entrada','reveal','intro'],
  desc:'Texto que entra expandiendo su letter-spacing desde un estado comprimido hasta su espaciado natural.',
  meta:['letter-spacing','keyframes','CSS'],
  prompt:`Crea una animación de entrada de texto "tracking-in".
Elemento: un titular (h1/span) con la palabra centrada.
Técnica: anima la propiedad letter-spacing y opacity con @keyframes.
Keyframes: 0% { letter-spacing: -0.5em; opacity: 0; } 40% { opacity: 0.6; } 100% { letter-spacing: normal (0); opacity: 1; }
Opcional: combina con un ligero filter:blur(8px) al inicio que va a 0, o un translateZ para sensación de profundidad.
Timings: duración ~900ms, easing cubic-bezier(.215,.61,.355,1) (ease-out suave), fill-mode forwards.
Para mostrar el ciclo en bucle, reinicia la animación cada ~2.2s reasignando la clase.`,
  code:`<h1 class="tracking-in">ANIMAI</h1>
<style>
.tracking-in{
  letter-spacing:-0.5em;opacity:0;
  animation:trackIn .9s cubic-bezier(.215,.61,.355,1) forwards;
}
@keyframes trackIn{
  0%{letter-spacing:-0.5em;opacity:0;filter:blur(8px)}
  40%{opacity:.6}
  100%{letter-spacing:normal;opacity:1;filter:blur(0)}
}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center;background:#0b0b12';
    s.innerHTML='<style>'
      +'@keyframes txtiIn{0%{letter-spacing:-0.5em;opacity:0;filter:blur(9px)}40%{opacity:.6}100%{letter-spacing:.04em;opacity:1;filter:blur(0)}}'
      +'.txti{font:700 30px/1 system-ui,sans-serif;color:#fff;letter-spacing:.04em;white-space:nowrap;background:linear-gradient(90deg,#7b5cff,#00e0c6);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}'
      +'.txti.on{animation:txtiIn .9s cubic-bezier(.215,.61,.355,1) both}'
      +'</style>'
      +'<h1 class="txti">ANIMAI</h1>';
    el.appendChild(s);
    const t=s.querySelector('.txti');
    const fire=()=>{t.classList.remove('on');void t.offsetWidth;t.classList.add('on');};
    fire();
    const iv=setInterval(fire,2200);
    return{stop(){clearInterval(iv);el.innerHTML='';}};
  }
};
export default effect;
