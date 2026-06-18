/** @type {import('../types.js').Effect} */
const effect = {
  id:'am-flash', title:'Flash', cat:'CSS Moderno',
  tags:['css','flash','parpadeo','blink','opacity','destello','0 js'],
  desc:'Parpadeo de opacidad: el elemento se apaga y enciende dos veces por ciclo para llamar la atencion.',
  meta:['opacity','keyframes','0 JS'],
  prompt:`Crea un efecto "flash" (parpadeo) solo con CSS.
Anima la propiedad opacity con varios puntos clave para que aparezca y desaparezca dos veces por ciclo: 0% opacity 1, 25% opacity 0, 50% opacity 1, 75% opacity 0, 100% opacity 1.
Usa animation con duracion ~1.6s, linear e infinite. Sin JS.`,
  code:`.flash {
  animation: am-flash 1.6s linear infinite;
}
@keyframes am-flash {
  0%,50%,100% { opacity: 1; }
  25%,75%     { opacity: 0; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes amFlash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}</style><div style="font:700 24px/1 system-ui,sans-serif;letter-spacing:.12em;padding:14px 22px;border-radius:12px;color:#07070d;background:linear-gradient(135deg,#7b5cff,#00e0c6);box-shadow:0 0 28px rgba(123,92,255,.55);animation:amFlash 1.6s linear infinite">FLASH</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
