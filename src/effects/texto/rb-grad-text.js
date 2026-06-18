/** @type {import('../types.js').Effect} */
const effect = {
  id:'rb-grad-text', title:'Gradient Text Flow', cat:'Texto',
  tags:['gradient','texto','animado','react bits','color','clip','flow'],
  desc:'Texto relleno con un gradiente de colores que fluye sin parar. El Gradient Text animado de React Bits.',
  meta:['background-clip','flow','React Bits'],
  prompt:`Recrea "Gradient Text" de React Bits: un texto cuyo relleno es un gradiente de varios colores que se desplaza continuamente (animando background-position) gracias a background-clip:text.
Aplica un linear-gradient amplio con background-size 200%+ al texto, color transparent y background-clip:text, y anima background-position en bucle para que el color fluya.
Para titulares y claims con vida cromática.`,
  code:`/* Animated gradient text */
.grad-text {
  background: linear-gradient(90deg, #7b5cff, #00e0c6, #ff5ca8, #7b5cff);
  background-size: 300% 100%;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
  animation: flow 4s linear infinite;
}
@keyframes flow { to { background-position: 300% 0; } }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>@keyframes gtflow{to{background-position:300% 0}}</style><div style="font-size:32px;font-weight:900;background:linear-gradient(90deg,#7b5cff,#00e0c6,#ff5ca8,#7b5cff);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gtflow 4s linear infinite">Gradient</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
